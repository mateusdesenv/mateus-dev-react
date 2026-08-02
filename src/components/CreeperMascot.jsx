import { useEffect, useRef, useState } from 'react';

const EXPLOSION_DELAY = 500;
const EXPLOSION_RANGE = 20;
const CURSOR_EXPLOSION_RANGE = 110;
const CREEPER_WIDTH = 76;
const STEVE_WIDTH = 48;
const CREEPER_SPEED = 105;
const STEVE_SPEED = 82;
const STEVE_ESCAPE_SPEED = 148;
const STEVE_MANUAL_SPEED = 190;
const STEVE_DANGER_RANGE = 180;
const DIRECTION_LOCK_TIME = 550;
const SKELETON_MIN_SHOT_INTERVAL = 5000;
const SKELETON_MAX_SHOT_INTERVAL = 10000;
const SKELETON_AIM_TIME = 480;
const SKELETON_SHOT_TIME = 1050;
const ENDERMAN_MIN_TELEPORT_INTERVAL = 5000;
const ENDERMAN_MAX_TELEPORT_INTERVAL = 10000;
const ENDERMAN_TELEPORT_MOVE_TIME = 180;
const ENDERMAN_TELEPORT_DURATION = 520;
const ENDERMAN_MIN_WALK_INTERVAL = 7000;
const ENDERMAN_MAX_WALK_INTERVAL = 15000;
const ENDERMAN_WALK_DURATION = 1000;
const ENDERMAN_WALK_SPEED = 38;
const MOBS = [
  { id: 'creeper', label: 'Creeper' },
  { id: 'skeleton', label: 'Esqueleto' },
  { id: 'zombie', label: 'Zumbi' },
  { id: 'jockey', label: 'Baby Zumbi' },
  { id: 'spider', label: 'Aranha' },
  { id: 'spiderJockey', label: 'Spider Jockey' },
  { id: 'pigman', label: 'Zombie Pigman' },
  { id: 'enderman', label: 'Enderman' },
];

const SKINS = [
  { id: 'steve', label: 'Steve' },
  { id: 'technoblade', label: 'Technoblade' },
  { id: 'viniccius13', label: 'Viniccius 13' },
  { id: 'daviGamer', label: 'Davi Gamer' },
  { id: 'authenticGames', label: 'Authentic Games' },
  { id: 'leon', label: 'Leon · Coisa de Nerd' },
  { id: 'venomExtreme', label: 'Venom Extreme' },
  { id: 'edukof', label: 'EduKof' },
  { id: 'feromonas', label: 'Feromonas' },
  { id: 'monark', label: 'Monark' },
  { id: 'afreim', label: 'Afreim' },
];

const SKIN_COLORS = {
  steve: { skin: '#b96f50', skinLight: '#d9966b', hair: '#39251d', shirt: '#188f91', shirtLight: '#35b8b1', shirtDark: '#0c6269', pants: '#263b9b', boots: '#151c4b' },
  technoblade: { skin: '#ef9c91', skinLight: '#ffc0b3', hair: '#d86673', shirt: '#a71f32', shirtLight: '#d43743', shirtDark: '#681522', pants: '#26252e', boots: '#111117' },
  viniccius13: { skin: '#d19a68', skinLight: '#edb77d', hair: '#111213', shirt: '#d90d15', shirtLight: '#f21a20', shirtDark: '#7d080d', pants: '#11131d', boots: '#49171b' },
  daviGamer: { skin: '#9f5e3f', skinLight: '#ca825d', hair: '#32180c', shirt: '#07183a', shirtLight: '#0a4f9d', shirtDark: '#020817', pants: '#071022', boots: '#02040a' },
  authenticGames: { skin: '#bb7353', skinLight: '#df9870', hair: '#251c1a', shirt: '#bd2930', shirtLight: '#eb4547', shirtDark: '#6e1a21', pants: '#292a31', boots: '#121319' },
  leon: { skin: '#bd7959', skinLight: '#dfa07a', hair: '#4b3024', shirt: '#236f85', shirtLight: '#3693a5', shirtDark: '#174857', pants: '#39434c', boots: '#1c2228' },
  venomExtreme: { skin: '#9b6249', skinLight: '#c68462', hair: '#151819', shirt: '#1b2221', shirtLight: '#27322f', shirtDark: '#0d1211', pants: '#172321', boots: '#090d0c' },
  edukof: { skin: '#b96f50', skinLight: '#e29a70', hair: '#211b1b', shirt: '#bd232b', shirtLight: '#ed3e43', shirtDark: '#71171d', pants: '#292638', boots: '#13121a' },
  feromonas: { skin: '#a8674c', skinLight: '#d48c65', hair: '#2a2020', shirt: '#20232b', shirtLight: '#343a46', shirtDark: '#101218', pants: '#24242b', boots: '#111116' },
  monark: { skin: '#b97755', skinLight: '#dc9870', hair: '#3d2b22', shirt: '#426f38', shirtLight: '#61964f', shirtDark: '#284722', pants: '#30343a', boots: '#171a1d' },
  afreim: { skin: '#ae6d50', skinLight: '#d99169', hair: '#35231f', shirt: '#653c91', shirtLight: '#8c59bd', shirtDark: '#3e285e', pants: '#282c45', boots: '#131626' },
};

function SkinDockIcon({ skin }) {
  const colors = SKIN_COLORS[skin];
  const isTechno = skin === 'technoblade';

  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      <path fill={isTechno ? '#ef9c91' : colors.hair} d="M2 1h12v14H2z" />
      <path fill={colors.skinLight} d="M3 4h10v9H3z" />
      {!isTechno && <path fill={colors.hair} d="M3 2h10v4H3zM3 5h2v4H3zM11 5h2v4h-2z" />}
      {isTechno && <path fill="#efc43b" d="M2 0h3v3h3V0h3v3h3V0h1v5H2z" />}
      <path fill={skin === 'venomExtreme' ? '#71d64f' : '#f5f2e9'} d="M4 7h3v2H4zM10 7h3v2h-3z" />
      <path fill={skin === 'venomExtreme' ? '#07100a' : '#2f5363'} d="M6 7h1v2H6zM10 7h1v2h-1z" />
      {isTechno && <path fill="#9d4e51" d="M6 10h5v3H6zM5 11h1v2H5zM11 11h1v2h-1z" />}
      {skin === 'steve' && <path fill="#5a3629" d="M3 9h2v4h2v2h5v-2h2V9h-2v2h-2v2H7v-2H5V9z" />}
      {skin === 'leon' && <path fill="#34241f" d="M3 6h5v4H3zM9 6h5v4H9zM7 7h3v1H7zM5 11h7v3H5z" fillOpacity=".8" />}
      {skin === 'authenticGames' && <path fill="#fff" d="M3 13h10v2H3z" />}
      {skin === 'viniccius13' && <path fill="#f5f3eb" d="M5 9h7v4H5z" />}
      {skin === 'viniccius13' && <path fill="#111217" d="M2 4h2v8H2zM13 4h2v8h-2zM12 10h4v2h-4zM7 13h4v2H7z" />}
      {skin === 'viniccius13' && <path fill="#e7131b" d="M2 13h12v2H2z" />}
      {skin === 'daviGamer' && <path fill="#f4f2eb" d="M3 12h10v3H3z" />}
      {skin === 'daviGamer' && <path fill="#0b60bc" d="M7 12h3v3H7z" />}
      {skin === 'edukof' && <path fill="#ffd83d" d="M7 3h4L9 7h3l-6 7 2-5H5z" />}
      {skin === 'feromonas' && <path fill="#b6242d" d="M2 1h12v4H2z" />}
      {skin === 'feromonas' && <path fill="#f1e9d4" d="M7 1h3v2H7zM6 2h5v1H6z" />}
      {skin === 'monark' && <path fill="#4d3228" d="M5 10h7v4H5z" />}
      {skin === 'afreim' && <path fill="#9f65d0" d="M2 12h12v3H2z" />}
    </svg>
  );
}

function CharacterSkin({ skin }) {
  const colors = SKIN_COLORS[skin] || SKIN_COLORS.technoblade;
  const isTechno = skin === 'technoblade';

  return (
    <svg className="creeper-mascot__steve-sprite" data-skin={skin} viewBox="0 0 48 88" role="presentation" shapeRendering="crispEdges">
      <g className="creeper-mascot__steve-head">
        {isTechno ? (
          <>
            <path fill="#efc43b" d="M6 0h7v7h7V0h8v7h7V0h7v13H6z" />
            <path fill="#fff0a0" d="M9 3h4v7H9zM23 3h5v7h-5zM38 3h4v7h-4z" />
            <path fill="#b47a19" d="M6 10h36v4H6z" />
            <path fill="#d86673" d="M7 13h34v20H7z" />
            <path fill="#ef9c91" d="M10 15h28v16H10z" />
            <path fill="#ffc0b3" d="M13 16h22v13H13z" />
            <path fill="#fff" d="M13 19h7v5h-7zM28 19h7v5h-7z" />
            <path fill="#33516b" d="M17 19h3v5h-3zM28 19h3v5h-3z" />
            <path fill="#a94d53" d="M18 25h12v6H18z" />
            <path fill="#552f34" d="M21 27h3v3h-3zM27 27h3v3h-3z" />
            <path fill="#f8eee0" d="M15 27h3v5h-3zM30 27h3v5h-3z" />
          </>
        ) : (
          <>
            <path fill={colors.hair} d="M7 0h34v33H7z" />
            <path fill={colors.skin} d="M10 4h28v27H10z" />
            <path fill={colors.skinLight} d="M13 8h22v19H13z" />
            <path fill={colors.hair} d="M10 4h28v7H10zM10 10h4v11h-4zM34 10h4v11h-4z" />
            <path fill="#f8f4eb" d="M14 14h8v5h-8zM27 14h7v5h-7z" />
            <path fill={skin === 'venomExtreme' ? '#63d64c' : '#3c7187'} d="M19 14h3v5h-3zM27 14h3v5h-3z" />
            <path fill="#744331" d="M20 24h10v3H20z" />
            {skin === 'steve' && <path fill="#5a3629" d="M10 20h4v8h5v4h15v-4h4v-8h-4v5h-5v3H20v-3h-6v-5z" />}
            {skin === 'steve' && <path fill={colors.skin} d="M22 19h6v6h-6z" />}
            {skin === 'viniccius13' && <path fill="#eeeee9" d="M16 19h18v11H16z" />}
            {skin === 'viniccius13' && <path fill="#101116" d="M19 14h3v5h-3zM27 14h3v5h-3zM21 29h10v4H21z" />}
            {skin === 'viniccius13' && <path fill="#f1f0eb" d="M8 4h4V1h25v3h4v20h-3V7h-3V4H14v3h-3v17H8z" />}
            {skin === 'viniccius13' && <path fill="#111217" d="M10 7h3v16h-3zM37 7h3v16h-3zM34 20h11v4H34zM42 23h3v4h-3z" />}
            {skin === 'leon' && <path fill="#3e2a22" d="M12 12h12v9H12zM25 12h12v9H25zM22 15h5v2h-5zM17 23h17v8H17z" fillOpacity=".72" />}
            {skin === 'venomExtreme' && <path fill="#0b1210" d="M10 4h28v9H10zM10 9h7v20h-7zM31 9h7v20h-7z" fillOpacity=".82" />}
            {skin === 'daviGamer' && <path fill="#1d0d07" d="M10 4h28v5H10zM13 8h6v4h-6zM29 7h9v5h-9z" />}
            {skin === 'daviGamer' && <path fill="#55bfff" d="M19 14h3v5h-3zM27 14h3v5h-3z" />}
            {skin === 'edukof' && <path fill="#d52731" d="M10 4h28v5H10z" opacity=".45" />}
            {skin === 'edukof' && <path fill="#9b2229" d="M19 14h3v5h-3zM27 14h3v5h-3z" />}
            {skin === 'feromonas' && <path fill="#a9242d" d="M7 0h34v8H7z" />}
            {skin === 'feromonas' && <path fill="#eee6d3" d="M21 1h7v4h-7zM19 3h11v2H19z" />}
            {skin === 'feromonas' && <path fill="#17171c" d="M12 12h10v8H12z" opacity=".72" />}
            {skin === 'monark' && <path fill="#4c3227" d="M16 22h18v9H16zM13 18h5v7h-5z" />}
            {skin === 'afreim' && <path fill="#6d4695" d="M10 4h28v4H10z" opacity=".55" />}
          </>
        )}
      </g>
      <path fill={colors.shirtDark} d="M11 33h26v28H11z" />
      <path fill={colors.shirt} d="M14 34h20v25H14z" />
      <path fill={colors.shirtLight} d="M14 34h6v25h-6z" />
      <path fill={colors.shirtDark} d="M30 34h4v25h-4zM14 56h20v4H14z" />
      {skin === 'technoblade' && <path fill="#efc43b" d="M22 34h5v22h-5zM14 39h20v4H14z" />}
      {skin === 'viniccius13' && <path fill="#120b0d" d="M16 38h5v9h3v4h3v-4h3v-9h5v19h-5v-5h-3v5h-6v-5h-3v5h-5V38z" />}
      {skin === 'viniccius13' && <path fill="#ff3035" d="M14 34h20v4H14z" />}
      {skin === 'daviGamer' && <path fill="#f0eee7" d="M18 34h12v22H18zM14 34h6v8h-6zM28 34h6v8h-6z" />}
      {skin === 'daviGamer' && <path fill="#0a57ac" d="M22 35h5v5h-5zM23 40h4v13h-4zM18 53h12v4H18z" />}
      {skin === 'daviGamer' && <path fill="#020817" d="M14 42h5v17h-5zM29 42h5v17h-5z" />}
      {skin === 'authenticGames' && <path fill="#fff" d="M18 34h12v6H18zM21 42h6v13h-6z" />}
      {skin === 'leon' && <path fill="#dae9e2" d="M20 37h8v3h-8zM22 40h4v5h-4z" />}
      {skin === 'venomExtreme' && <path fill="#65d34d" d="M21 35h6v5h4v5h-4v10h-6V45h-4v-5h4z" />}
      {skin === 'edukof' && <path fill="#ffd83d" d="M23 35h8l-5 8h5L18 57l5-10h-6z" />}
      {skin === 'feromonas' && <path fill="#d5ae36" d="M14 35h4v24h-4zM30 35h4v24h-4zM14 50h20v4H14z" />}
      {skin === 'feromonas' && <path fill="#f0e8d5" d="M21 38h7v7h-7zM19 40h11v3H19zM22 45h2v3h-2zM27 45h2v3h-2z" />}
      {skin === 'monark' && <path fill="#d7e6ca" d="M20 39h9v13h-9zM22 41h5v3h-5zM22 46h5v4h-5z" />}
      {skin === 'afreim' && <path fill="#efe7ff" d="M20 39h9v4h-9zM18 43h4v11h-4zM27 43h4v11h-4zM22 47h5v3h-5z" />}
      <g className="creeper-mascot__steve-arm creeper-mascot__steve-arm--back">
        <path fill={colors.shirtDark} d="M35 35h10v29H35z" />
        <path fill={colors.shirt} d="M35 36h7v17h-7z" />
        <path fill={colors.skin} d="M35 53h10v12H35z" />
      </g>
      <g className="creeper-mascot__steve-arm creeper-mascot__steve-arm--front">
        <path fill={colors.shirtDark} d="M3 35h10v29H3z" />
        <path fill={colors.shirtLight} d="M6 36h7v17H6z" />
        <path fill={colors.skinLight} d="M3 53h10v12H3z" />
      </g>
      <g className="creeper-mascot__steve-leg creeper-mascot__steve-leg--back">
        <path fill={colors.pants} d="M25 59h12v25H25z" />
        <path fill={colors.shirtDark} d="M25 60h7v20h-7z" opacity=".42" />
        <path fill={colors.boots} d="M25 81h12v7H25z" />
      </g>
      <g className="creeper-mascot__steve-leg creeper-mascot__steve-leg--front">
        <path fill={colors.pants} d="M11 59h12v25H11z" />
        <path fill={colors.shirtLight} d="M14 60h7v20h-7z" opacity=".32" />
        <path fill={colors.boots} d="M11 81h12v7H11z" />
      </g>
    </svg>
  );
}

function MobDockIcon({ mob }) {
  if (mob === 'enderman') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="#111213" d="M2 1h12v14H2z" />
        <path fill="#252327" d="M4 3h8v9H4z" />
        <path fill="#c72cff" d="M3 6h4v2H3zM9 6h4v2H9z" />
        <path fill="#f2a2ff" d="M5 6h2v1H5zM11 6h2v1h-2z" />
        <path fill="#090a0b" d="M4 12h3v4H4zM9 12h3v4H9z" />
      </svg>
    );
  }

  if (mob === 'pigman') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="#d88e82" d="M2 1h12v12H2z" />
        <path fill="#efaaa0" d="M3 2h8v8H3z" />
        <path fill="#745a42" d="M10 1h4v7h-4zM2 9h5v4H2z" />
        <path fill="#667548" d="M11 4h3v6h-3zM3 10h4v3H3z" />
        <path fill="#3d2726" d="M4 5h3v3H4zM10 5h3v3h-3z" />
        <path fill="#bc706a" d="M5 9h7v4H5z" />
        <path fill="#5b3432" d="M6 10h2v2H6zM10 10h2v2h-2z" />
        <path fill="#e7b837" d="M12 0h3v10h-3zM10 2h6v3h-6z" />
      </svg>
    );
  }

  if (mob === 'spiderJockey') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="#dddcd4" d="M5 0h7v7H5z" />
        <path fill="#555955" d="M6 2h2v2H6zM10 2h2v2h-2zM8 4h2v2H8z" />
        <path fill="#aaaDa6" d="M7 7h4v3H7z" />
        <path fill="#2a2523" d="M3 9h11v6H3z" />
        <path fill="#a82424" d="M9 10h2v2H9zM12 10h2v2h-2z" />
        <path fill="#211d1b" d="M0 8h4v2H2v2H0zM13 8h3v4h-2v-2h-1zM0 13h4v2H0zM13 13h3v2h-3z" />
      </svg>
    );
  }

  if (mob === 'spider') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="#2a2523" d="M3 5h10v8H3z" />
        <path fill="#4b403a" d="M5 4h7v7H5z" />
        <path fill="#9f2424" d="M7 6h2v2H7zM11 6h2v2h-2z" />
        <path fill="#211d1b" d="M0 3h4v2H2v2H0zM12 3h4v4h-2V5h-2zM0 9h4v2H2v3H0zM12 9h4v5h-2v-3h-2z" />
      </svg>
    );
  }

  if (mob === 'jockey') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="#568847" d="M5 1h7v6H5z" />
        <path fill="#223622" d="M6 3h2v2H6zM10 3h2v2h-2z" />
        <path fill="#27999a" d="M6 7h6v3H6z" />
        <path fill="#eee9d5" d="M2 9h12v6H2z" />
        <path fill="#fffdf0" d="M3 9h8v4H3z" />
        <path fill="#d94a35" d="M11 12h3v3h-3z" />
        <path fill="#e4a52e" d="M14 10h2v3h-2z" />
      </svg>
    );
  }

  if (mob === 'skeleton') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="#d8d8d0" d="M2 2h12v11H2z" />
        <path fill="#f1f1e8" d="M3 3h9v7H3z" />
        <path fill="#575b57" d="M4 5h3v3H4zM10 5h3v3h-3zM7 8h2v2H7zM5 11h2v2H5zM9 11h2v2H9z" />
      </svg>
    );
  }

  if (mob === 'zombie') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="#477d3d" d="M2 2h12v12H2z" />
        <path fill="#6c9b53" d="M3 3h9v9H3z" />
        <path fill="#273724" d="M4 5h3v3H4zM10 5h3v3h-3zM6 10h6v2H6z" />
        <path fill="#5d395f" d="M2 13h12v2H2z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      <path fill="#4ba63d" d="M1 1h14v14H1z" />
      <path fill="#6fc354" d="M2 2h4v4H2zM9 1h4v3H9zM3 11h3v3H3z" />
      <path fill="#17351a" d="M3 4h4v4H3zM10 4h4v4h-4zM6 8h5v3H6zM4 10h9v4H4z" />
    </svg>
  );
}

function CreeperMascot() {
  const [selectedMob, setSelectedMob] = useState('creeper');
  const [selectedSkin, setSelectedSkin] = useState('steve');
  const [isManualControl, setIsManualControl] = useState(false);
  const [isSteveMoving, setIsSteveMoving] = useState(true);
  const [status, setStatus] = useState('walking');
  const [steveDirection, setSteveDirection] = useState('right');
  const [creeperDirection, setCreeperDirection] = useState('right');
  const [isSkeletonShooting, setIsSkeletonShooting] = useState(false);
  const [isEndermanTeleporting, setIsEndermanTeleporting] = useState(false);
  const [isEndermanWalking, setIsEndermanWalking] = useState(false);
  const [arrowShot, setArrowShot] = useState(null);
  const mascotRef = useRef(null);
  const explosionTimerRef = useRef(0);
  const skeletonScheduleRef = useRef(0);
  const skeletonAimRef = useRef(0);
  const skeletonFinishRef = useRef(0);
  const arrowCleanupRef = useRef(0);
  const endermanScheduleRef = useRef(0);
  const endermanMoveRef = useRef(0);
  const endermanFinishRef = useRef(0);
  const endermanWalkStartRef = useRef(0);
  const endermanWalkFinishRef = useRef(0);
  const statusRef = useRef('walking');
  const cursorNearCreeperRef = useRef(false);
  const skeletonShootingRef = useRef(false);
  const endermanTeleportingRef = useRef(false);
  const endermanWalkingRef = useRef(false);
  const stevePositionRef = useRef(Math.max(64, window.innerWidth - 64));
  const steveVerticalPositionRef = useRef(0);
  const steveDirectionRef = useRef(steveDirection);
  const manualControlRef = useRef(false);
  const pressedKeysRef = useRef(new Set());
  const steveMovingRef = useRef(true);
  const creeperPositionRef = useRef(12);
  const creeperDirectionRef = useRef(creeperDirection);
  const lastDirectionChangeRef = useRef(0);

  useEffect(() => {
    const updateStatus = (nextStatus) => {
      statusRef.current = nextStatus;
      setStatus(nextStatus);
    };

    const startCharging = () => {
      window.clearTimeout(explosionTimerRef.current);
      updateStatus('charging');
      explosionTimerRef.current = window.setTimeout(() => updateStatus('exploded'), EXPLOSION_DELAY);
    };

    const cancelExplosion = () => {
      window.clearTimeout(explosionTimerRef.current);
      updateStatus('walking');
    };

    let animationFrame = 0;
    let lastUpdate = 0;

    const followSteve = (time) => {
      if (!lastUpdate) lastUpdate = time;
      const elapsed = Math.min((time - lastUpdate) / 1000, 0.05);

      if (elapsed >= 0.016) {
        lastUpdate = time;
        const steveX = stevePositionRef.current;
        const currentCreeperX = creeperPositionRef.current;
        const creeperRight = currentCreeperX + CREEPER_WIDTH;
        const steveRight = steveX + STEVE_WIDTH;
        const horizontalGap = currentCreeperX <= steveX
          ? Math.max(0, steveX - creeperRight)
          : Math.max(0, currentCreeperX - steveRight);
        const gap = Math.hypot(horizontalGap, steveVerticalPositionRef.current);

        if (selectedMob === 'creeper') {
          const shouldCharge = gap <= EXPLOSION_RANGE || cursorNearCreeperRef.current;
          if (shouldCharge && statusRef.current === 'walking') startCharging();
          if (!shouldCharge && statusRef.current !== 'walking') cancelExplosion();
        } else if (statusRef.current !== 'walking') {
          cancelExplosion();
        }

        if (!manualControlRef.current && selectedMob !== 'enderman' && gap <= STEVE_DANGER_RANGE && time - lastDirectionChangeRef.current >= DIRECTION_LOCK_TIME) {
          const creeperCenter = currentCreeperX + (CREEPER_WIDTH / 2);
          const steveCenter = steveX + (STEVE_WIDTH / 2);
          const escapeDirection = steveCenter >= creeperCenter ? 'right' : 'left';

          if (escapeDirection !== steveDirectionRef.current) {
            steveDirectionRef.current = escapeDirection;
            lastDirectionChangeRef.current = time;
            setSteveDirection(escapeDirection);
          }
        }

        let nextSteveX = steveX;

        if (manualControlRef.current) {
          const horizontalInput = (pressedKeysRef.current.has('d') ? 1 : 0)
            - (pressedKeysRef.current.has('a') ? 1 : 0);
          const verticalInput = (pressedKeysRef.current.has('w') ? 1 : 0)
            - (pressedKeysRef.current.has('s') ? 1 : 0);
          const isMoving = horizontalInput !== 0 || verticalInput !== 0;
          const diagonalScale = horizontalInput !== 0 && verticalInput !== 0 ? Math.SQRT1_2 : 1;

          if (isMoving !== steveMovingRef.current) {
            steveMovingRef.current = isMoving;
            setIsSteveMoving(isMoving);
          }

          if (horizontalInput !== 0) {
            const nextDirection = horizontalInput > 0 ? 'right' : 'left';
            if (nextDirection !== steveDirectionRef.current) {
              steveDirectionRef.current = nextDirection;
              setSteveDirection(nextDirection);
            }
          }

          nextSteveX += horizontalInput * STEVE_MANUAL_SPEED * diagonalScale * elapsed;
          const maxVerticalPosition = Math.max(0, window.innerHeight - 118);
          steveVerticalPositionRef.current = Math.max(
            0,
            Math.min(
              maxVerticalPosition,
              steveVerticalPositionRef.current + verticalInput * STEVE_MANUAL_SPEED * diagonalScale * elapsed,
            ),
          );
        } else {
          const steveSpeed = statusRef.current === 'walking' ? STEVE_SPEED : STEVE_ESCAPE_SPEED;
          nextSteveX += (steveDirectionRef.current === 'right' ? 1 : -1) * steveSpeed * elapsed;
        }

        if (nextSteveX > window.innerWidth) nextSteveX = -STEVE_WIDTH;
        if (nextSteveX < -STEVE_WIDTH) nextSteveX = window.innerWidth;

        stevePositionRef.current = nextSteveX;

        if (selectedMob === 'enderman' && endermanWalkingRef.current && !endermanTeleportingRef.current) {
          const directionMultiplier = creeperDirectionRef.current === 'right' ? 1 : -1;
          let nextEndermanX = currentCreeperX + directionMultiplier * ENDERMAN_WALK_SPEED * elapsed;
          let nextEndermanDirection = creeperDirectionRef.current;

          if (nextEndermanX >= window.innerWidth - CREEPER_WIDTH) {
            nextEndermanX = window.innerWidth - CREEPER_WIDTH;
            nextEndermanDirection = 'left';
          } else if (nextEndermanX <= 0) {
            nextEndermanX = 0;
            nextEndermanDirection = 'right';
          }

          if (nextEndermanDirection !== creeperDirectionRef.current) {
            creeperDirectionRef.current = nextEndermanDirection;
            setCreeperDirection(nextEndermanDirection);
          }

          creeperPositionRef.current = nextEndermanX;
        } else if (selectedMob !== 'enderman' && statusRef.current === 'walking' && !skeletonShootingRef.current && !endermanTeleportingRef.current) {
          const target = currentCreeperX <= steveX
            ? steveX - CREEPER_WIDTH - EXPLOSION_RANGE
            : steveX + STEVE_WIDTH + EXPLOSION_RANGE;
          const boundedTarget = Math.max(0, Math.min(window.innerWidth - CREEPER_WIDTH, target));
          const distance = boundedTarget - currentCreeperX;
          const movement = Math.sign(distance) * Math.min(Math.abs(distance), CREEPER_SPEED * elapsed);
          const nextCreeperX = currentCreeperX + movement;

          if (Math.abs(distance) > 0.5) {
            const nextCreeperDirection = distance > 0 ? 'right' : 'left';
            if (nextCreeperDirection !== creeperDirectionRef.current) {
              creeperDirectionRef.current = nextCreeperDirection;
              setCreeperDirection(nextCreeperDirection);
            }
          }

          creeperPositionRef.current = nextCreeperX;
        }

        mascotRef.current?.style.setProperty('--steve-x', `${Math.round(stevePositionRef.current)}px`);
        mascotRef.current?.style.setProperty('--steve-y', `${Math.round(-steveVerticalPositionRef.current)}px`);
        mascotRef.current?.style.setProperty('--creeper-x', `${Math.round(creeperPositionRef.current)}px`);
      }

      animationFrame = window.requestAnimationFrame(followSteve);
    };

    animationFrame = window.requestAnimationFrame(followSteve);

    const supportsCursorInteraction = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const handlePointerMove = (event) => {
      if (!supportsCursorInteraction || selectedMob !== 'creeper') return;

      const walker = mascotRef.current?.querySelector('.creeper-mascot__walker');
      if (!walker) return;

      const rect = walker.getBoundingClientRect();
      const distanceX = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
      const distanceY = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
      const isNear = Math.hypot(distanceX, distanceY) <= CURSOR_EXPLOSION_RANGE;

      if (isNear === cursorNearCreeperRef.current) return;
      cursorNearCreeperRef.current = isNear;

      if (isNear && statusRef.current === 'walking') startCharging();
    };

    const handlePointerExit = (event) => {
      if (event?.relatedTarget) return;
      cursorNearCreeperRef.current = false;
    };

    if (supportsCursorInteraction) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerout', handlePointerExit);
      window.addEventListener('blur', handlePointerExit);
    }

    return () => {
      window.clearTimeout(explosionTimerRef.current);
      window.cancelAnimationFrame(animationFrame);
      cursorNearCreeperRef.current = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerExit);
      window.removeEventListener('blur', handlePointerExit);
    };
  }, [selectedMob]);

  useEffect(() => {
    const interactiveTags = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

    const handleKeyDown = (event) => {
      if (!manualControlRef.current || event.repeat) return;
      if (interactiveTags.has(event.target.tagName) || event.target.isContentEditable) return;

      const key = event.key.toLowerCase();
      if (!['w', 'a', 's', 'd'].includes(key)) return;

      event.preventDefault();
      pressedKeysRef.current.add(key);
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (!['w', 'a', 's', 'd'].includes(key)) return;
      pressedKeysRef.current.delete(key);
    };

    const releaseKeys = () => pressedKeysRef.current.clear();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', releaseKeys);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', releaseKeys);
    };
  }, []);

  useEffect(() => {
    window.clearTimeout(endermanScheduleRef.current);
    window.clearTimeout(endermanMoveRef.current);
    window.clearTimeout(endermanFinishRef.current);
    window.clearTimeout(endermanWalkStartRef.current);
    window.clearTimeout(endermanWalkFinishRef.current);
    endermanTeleportingRef.current = false;
    endermanWalkingRef.current = false;
    setIsEndermanTeleporting(false);
    setIsEndermanWalking(false);

    if (selectedMob !== 'enderman') return undefined;

    const startIdleWalk = () => {
      if (endermanTeleportingRef.current) {
        endermanWalkStartRef.current = window.setTimeout(startIdleWalk, ENDERMAN_TELEPORT_DURATION);
        return;
      }

      const nextDirection = Math.random() >= 0.5 ? 'right' : 'left';
      creeperDirectionRef.current = nextDirection;
      setCreeperDirection(nextDirection);
      endermanWalkingRef.current = true;
      setIsEndermanWalking(true);

      endermanWalkFinishRef.current = window.setTimeout(() => {
        endermanWalkingRef.current = false;
        setIsEndermanWalking(false);
        scheduleIdleWalk();
      }, ENDERMAN_WALK_DURATION);
    };

    const scheduleIdleWalk = () => {
      const delay = ENDERMAN_MIN_WALK_INTERVAL
        + Math.random() * (ENDERMAN_MAX_WALK_INTERVAL - ENDERMAN_MIN_WALK_INTERVAL);

      endermanWalkStartRef.current = window.setTimeout(() => {
        startIdleWalk();
      }, delay);
    };

    const scheduleNextTeleport = () => {
      const interval = ENDERMAN_MIN_TELEPORT_INTERVAL
        + Math.random() * (ENDERMAN_MAX_TELEPORT_INTERVAL - ENDERMAN_MIN_TELEPORT_INTERVAL);

      endermanScheduleRef.current = window.setTimeout(() => {
        const interruptedWalk = endermanWalkingRef.current;
        window.clearTimeout(endermanWalkFinishRef.current);
        endermanWalkingRef.current = false;
        setIsEndermanWalking(false);
        if (interruptedWalk) scheduleIdleWalk();
        endermanTeleportingRef.current = true;
        setIsEndermanTeleporting(true);

        endermanMoveRef.current = window.setTimeout(() => {
          const maxX = Math.max(0, window.innerWidth - CREEPER_WIDTH);
          const currentX = creeperPositionRef.current;
          let nextX = Math.random() * maxX;

          if (maxX > 320 && Math.abs(nextX - currentX) < 160) {
            nextX = (nextX + (maxX / 2)) % maxX;
          }

          creeperPositionRef.current = nextX;
          mascotRef.current?.style.setProperty('--creeper-x', `${Math.round(nextX)}px`);

          const nextDirection = stevePositionRef.current + (STEVE_WIDTH / 2)
            >= nextX + (CREEPER_WIDTH / 2) ? 'right' : 'left';

          if (nextDirection !== creeperDirectionRef.current) {
            creeperDirectionRef.current = nextDirection;
            setCreeperDirection(nextDirection);
          }
        }, ENDERMAN_TELEPORT_MOVE_TIME);

        endermanFinishRef.current = window.setTimeout(() => {
          endermanTeleportingRef.current = false;
          setIsEndermanTeleporting(false);
          scheduleNextTeleport();
        }, ENDERMAN_TELEPORT_DURATION);
      }, interval);
    };

    scheduleNextTeleport();
    scheduleIdleWalk();

    return () => {
      window.clearTimeout(endermanScheduleRef.current);
      window.clearTimeout(endermanMoveRef.current);
      window.clearTimeout(endermanFinishRef.current);
      window.clearTimeout(endermanWalkStartRef.current);
      window.clearTimeout(endermanWalkFinishRef.current);
      endermanTeleportingRef.current = false;
      endermanWalkingRef.current = false;
    };
  }, [selectedMob]);

  useEffect(() => {
    window.clearTimeout(skeletonScheduleRef.current);
    window.clearTimeout(skeletonAimRef.current);
    window.clearTimeout(skeletonFinishRef.current);
    window.clearTimeout(arrowCleanupRef.current);
    skeletonShootingRef.current = false;
    setIsSkeletonShooting(false);
    setArrowShot(null);

    const isSkeletonMob = selectedMob === 'skeleton' || selectedMob === 'spiderJockey';

    if (!isSkeletonMob) return undefined;

    const scheduleNextShot = () => {
      const interval = SKELETON_MIN_SHOT_INTERVAL
        + Math.random() * (SKELETON_MAX_SHOT_INTERVAL - SKELETON_MIN_SHOT_INTERVAL);

      skeletonScheduleRef.current = window.setTimeout(() => {
        const aimDirection = stevePositionRef.current + (STEVE_WIDTH / 2)
          >= creeperPositionRef.current + (CREEPER_WIDTH / 2) ? 'right' : 'left';

        creeperDirectionRef.current = aimDirection;
        setCreeperDirection(aimDirection);
        skeletonShootingRef.current = true;
        setIsSkeletonShooting(true);

        skeletonAimRef.current = window.setTimeout(() => {
          const skeletonX = creeperPositionRef.current;
          const steveCenter = stevePositionRef.current + (STEVE_WIDTH / 2);
          const direction = steveCenter >= skeletonX + (CREEPER_WIDTH / 2) ? 'right' : 'left';
          const startX = skeletonX + (direction === 'right' ? 54 : 10);
          const travel = steveCenter - startX;
          const duration = Math.max(280, Math.min(850, Math.abs(travel) * 0.82));

          if (direction !== creeperDirectionRef.current) {
            creeperDirectionRef.current = direction;
            setCreeperDirection(direction);
          }

          setArrowShot({
            id: Date.now(),
            startX,
            travel,
            duration,
            direction,
            mounted: selectedMob === 'spiderJockey',
          });
          arrowCleanupRef.current = window.setTimeout(() => setArrowShot(null), duration + 80);
        }, SKELETON_AIM_TIME);

        skeletonFinishRef.current = window.setTimeout(() => {
          skeletonShootingRef.current = false;
          setIsSkeletonShooting(false);
          scheduleNextShot();
        }, SKELETON_SHOT_TIME);
      }, interval);
    };

    scheduleNextShot();

    return () => {
      window.clearTimeout(skeletonScheduleRef.current);
      window.clearTimeout(skeletonAimRef.current);
      window.clearTimeout(skeletonFinishRef.current);
      window.clearTimeout(arrowCleanupRef.current);
      skeletonShootingRef.current = false;
    };
  }, [selectedMob]);

  const selectMob = (mob) => {
    window.clearTimeout(explosionTimerRef.current);
    window.clearTimeout(skeletonScheduleRef.current);
    window.clearTimeout(skeletonAimRef.current);
    window.clearTimeout(skeletonFinishRef.current);
    window.clearTimeout(arrowCleanupRef.current);
    window.clearTimeout(endermanScheduleRef.current);
    window.clearTimeout(endermanMoveRef.current);
    window.clearTimeout(endermanFinishRef.current);
    window.clearTimeout(endermanWalkStartRef.current);
    window.clearTimeout(endermanWalkFinishRef.current);
    skeletonShootingRef.current = false;
    endermanTeleportingRef.current = false;
    endermanWalkingRef.current = false;
    statusRef.current = 'walking';
    setStatus('walking');
    setIsSkeletonShooting(false);
    setIsEndermanTeleporting(false);
    setIsEndermanWalking(false);
    setArrowShot(null);
    setSelectedMob(mob);
  };

  const toggleCharacterControl = () => {
    const nextManualControl = !manualControlRef.current;
    manualControlRef.current = nextManualControl;
    pressedKeysRef.current.clear();
    steveMovingRef.current = !nextManualControl;
    setIsSteveMoving(!nextManualControl);

    if (!nextManualControl) {
      steveVerticalPositionRef.current = 0;
      mascotRef.current?.style.setProperty('--steve-y', '0px');
    }

    setIsManualControl(nextManualControl);
  };

  return (
    <div
      ref={mascotRef}
      className={`creeper-mascot creeper-mascot--${status} creeper-mascot--mob-${selectedMob} creeper-mascot--facing-${creeperDirection} creeper-mascot--steve-${steveDirection}${isSkeletonShooting ? ' creeper-mascot--skeleton-shooting' : ''}${isEndermanTeleporting ? ' creeper-mascot--enderman-teleporting' : ''}${isEndermanWalking ? ' creeper-mascot--enderman-walking' : ''}${isManualControl ? ' creeper-mascot--manual' : ''}${isSteveMoving ? ' creeper-mascot--steve-moving' : ''}`}
      style={{ '--creeper-x': '12px', '--steve-x': `${Math.max(64, window.innerWidth - 64)}px`, '--steve-y': '0px' }}
    >
      <button
        className="character-control"
        type="button"
        aria-pressed={isManualControl}
        onClick={toggleCharacterControl}
      >
        <span className="character-control__keys" aria-hidden="true">WASD</span>
        <span>{isManualControl ? 'Parar de controlar personagem' : 'Controlar personagem'}</span>
      </button>
      <nav className="mob-dock skin-dock" aria-label="Escolher skin do personagem">
        <span className="mob-dock__label" aria-hidden="true">SKINS</span>
        {SKINS.map((skin) => (
          <button
            key={skin.id}
            className="mob-dock__button"
            type="button"
            aria-label={`Selecionar ${skin.label}`}
            aria-pressed={selectedSkin === skin.id}
            data-skin={skin.id}
            onClick={() => setSelectedSkin(skin.id)}
          >
            <SkinDockIcon skin={skin.id} />
            <span>{skin.label}</span>
          </button>
        ))}
      </nav>
      <nav className="mob-dock" aria-label="Escolher mob perseguidor">
        <span className="mob-dock__label" aria-hidden="true">MOBS</span>
        {MOBS.map((mob) => (
          <button
            key={mob.id}
            className="mob-dock__button"
            type="button"
            aria-label={`Selecionar ${mob.label}`}
            aria-pressed={selectedMob === mob.id}
            data-mob={mob.id}
            onClick={() => selectMob(mob.id)}
          >
            <MobDockIcon mob={mob.id} />
            <span>{mob.label}</span>
          </button>
        ))}
      </nav>
      <div className="creeper-mascot__steve-runner" aria-hidden="true">
        <div className="creeper-mascot__steve">
          <CharacterSkin skin={selectedSkin} />
          <span className="creeper-mascot__steve-shadow" />
        </div>
      </div>
      <div className="creeper-mascot__walker" aria-hidden="true">
        {selectedMob === 'creeper' && <svg className="creeper-mascot__sprite" viewBox="0 0 64 96" role="presentation" shapeRendering="crispEdges">
          <g className="creeper-mascot__body">
            <path fill="#49a93c" d="M4 0h56v54H4zM18 54h28v26H18z" />
            <path fill="#6bc653" d="M4 0h8v54H4zM18 54h7v26h-7zM12 8h12v8H12zM40 2h12v8H40zM30 42h12v12H30z" />
            <path fill="#30852e" d="M52 0h8v54h-8zM39 54h7v26h-7zM8 34h10v12H8zM44 20h12v10H44zM24 58h8v12h-8z" />
            <path fill="#17351a" d="M12 16h14v14H12zM38 16h14v14H38zM25 30h14v10H25zM19 38h26v12H19zM24 48h16v6H24z" />
            <path fill="#255f27" d="M4 8h8v8H4zM28 4h8v8h-8zM48 38h12v8H48zM18 68h8v8h-8zM38 60h8v8h-8z" />
          </g>
          <g className="creeper-mascot__leg creeper-mascot__leg--back">
            <path fill="#2f842d" d="M34 76h18v20H34z" />
            <path fill="#1f6124" d="M44 76h8v20h-8z" />
          </g>
          <g className="creeper-mascot__leg creeper-mascot__leg--front">
            <path fill="#49a93c" d="M12 76h18v20H12z" />
            <path fill="#2c762b" d="M12 88h18v8H12z" />
          </g>
        </svg>}
        {selectedMob === 'skeleton' && (
          <svg className="creeper-mascot__sprite creeper-mascot__sprite--skeleton" viewBox="0 0 64 96" role="presentation" shapeRendering="crispEdges">
            <g className="mob-sprite__limb mob-sprite__limb--back-arm">
              <path fill="#a1a59e" d="M8 36h10v34H8z" />
            </g>
            <g className="mob-sprite__limb mob-sprite__limb--back-leg">
              <path fill="#c1c4bc" d="M35 70h10v26H35z" />
              <path fill="#7c807a" d="M35 90h10v6H35z" />
            </g>
            <g className="mob-sprite__body">
              <path fill="#bfc2ba" d="M13 0h38v34H13z" />
              <path fill="#e4e4dc" d="M16 3h29v24H16z" />
              <path fill="#60645f" d="M18 11h10v9H18zM37 11h10v9H37zM28 20h8v7H28zM21 28h7v5H21zM37 28h7v5H37z" />
              <path fill="#a9ada6" d="M23 34h18v37H23z" />
              <path fill="#e0e1d9" d="M26 36h12v5H26zM20 44h24v4H20zM20 53h24v4H20zM20 62h24v4H20z" />
              <path fill="#777b75" d="M29 34h6v37h-6z" />
            </g>
            <g className="mob-sprite__limb mob-sprite__limb--front-arm">
              <path fill="#c7cac2" d="M46 36h10v34H46z" />
              <path fill="#86623b" d="M54 31h4v48h-4zM49 34h5v4h-5zM46 38h5v5h-5zM44 43h4v24h-4zM46 67h5v5h-5zM49 72h5v4h-5z" />
            </g>
            <g className="mob-sprite__limb mob-sprite__limb--front-leg">
              <path fill="#d5d7cf" d="M23 70h10v26H23z" />
              <path fill="#8d918b" d="M23 90h10v6H23z" />
            </g>
          </svg>
        )}
        {selectedMob === 'zombie' && (
          <svg className="creeper-mascot__sprite creeper-mascot__sprite--zombie" viewBox="0 0 64 96" role="presentation" shapeRendering="crispEdges">
            <g className="mob-sprite__limb mob-sprite__limb--back-arm">
              <path fill="#47763e" d="M49 39h12v33H49z" />
            </g>
            <g className="mob-sprite__limb mob-sprite__limb--back-leg">
              <path fill="#402b63" d="M35 78h15v18H35z" />
              <path fill="#202038" d="M35 90h15v6H35z" />
            </g>
            <g className="mob-sprite__body">
              <path fill="#47783c" d="M9 0h46v38H9z" />
              <path fill="#6c9a52" d="M13 3h35v29H13z" />
              <path fill="#315d34" d="M9 4h8v18H9zM47 0h8v24h-8zM20 28h30v10H20z" />
              <path fill="#182d20" d="M17 12h11v8H17zM38 12h11v8H38z" />
              <path fill="#8ea55e" d="M20 13h5v4h-5zM41 13h5v4h-5z" />
              <path fill="#2b4329" d="M25 25h19v6H25z" />
              <path fill="#258b8d" d="M14 38h36v31H14z" />
              <path fill="#35aaa5" d="M18 40h18v25H18z" />
              <path fill="#1c656e" d="M43 38h7v31h-7z" />
              <path fill="#76508f" d="M15 68h35v12H15z" />
            </g>
            <g className="mob-sprite__limb mob-sprite__limb--front-arm mob-sprite__limb--sword-arm">
              <path fill="#173b4b" d="M10 48h7v-7h7v-7h7v-7h7v-7h11v11h-7v7h-7v7h-7v7H17v7h-7z" />
              <path fill="#35d6d2" d="M15 47h5v-7h7v-7h7v-7h9v5h-6v7h-7v7h-7v7h-8z" />
              <path fill="#a6fff4" d="M38 24h5v5h-5zM29 33h5v5h-5zM20 42h5v5h-5z" />
              <path fill="#24343d" d="M5 51h24v6H5z" />
              <path fill="#b78b48" d="M8 52h18v3H8z" />
              <path fill="#6f4a2b" d="M13 56h7v15h-7z" />
              <path fill="#3c2a21" d="M10 68h13v5H10z" />
              <path fill="#5d8d4a" d="M3 39h12v33H3z" />
            </g>
            <g className="mob-sprite__limb mob-sprite__limb--front-leg">
              <path fill="#4c3371" d="M17 78h15v18H17z" />
              <path fill="#282641" d="M17 90h15v6H17z" />
            </g>
          </svg>
        )}
        {selectedMob === 'pigman' && (
          <svg className="creeper-mascot__sprite creeper-mascot__sprite--pigman" viewBox="0 0 64 96" role="presentation" shapeRendering="crispEdges">
            <g className="mob-sprite__limb mob-sprite__limb--back-arm">
              <path fill="#b86e67" d="M49 38h12v34H49z" />
              <path fill="#6c774c" d="M49 52h12v13H49z" />
              <path fill="#d88b7e" d="M52 40h9v12h-9z" />
            </g>
            <g className="mob-sprite__limb mob-sprite__limb--back-leg">
              <path fill="#b96f68" d="M35 72h15v24H35z" />
              <path fill="#6a7549" d="M35 77h15v10H35z" />
              <path fill="#66423d" d="M35 90h15v6H35z" />
            </g>
            <g className="mob-sprite__body">
              <path fill="#c57a70" d="M9 0h46v38H9z" />
              <path fill="#e69a8e" d="M13 3h34v28H13z" />
              <path fill="#f1b0a3" d="M16 5h21v20H16z" />
              <path fill="#745d43" d="M43 0h12v24H43zM9 4h8v17H9zM34 29h21v9H34z" />
              <path fill="#68784b" d="M45 4h10v13H45zM10 23h13v15H10zM36 30h10v8H36z" />
              <path fill="#352525" d="M17 11h10v8H17zM39 11h10v8H39z" />
              <path fill="#cf746e" d="M22 20h25v14H22z" />
              <path fill="#e39087" d="M25 22h17v9H25z" />
              <path fill="#633c3a" d="M25 25h5v6h-5zM37 25h5v6h-5z" />
              <path fill="#c87b71" d="M14 38h36v35H14z" />
              <path fill="#e49a8c" d="M18 40h18v28H18z" />
              <path fill="#6c784c" d="M39 38h11v24H39zM14 57h13v16H14z" />
              <path fill="#8d5a43" d="M14 68h36v10H14z" />
              <path fill="#b7b6a8" d="M42 43h8v12H42z" />
              <path fill="#6d6c64" d="M45 43h5v12h-5z" />
            </g>
            <g className="mob-sprite__limb mob-sprite__limb--front-arm mob-sprite__limb--sword-arm">
              <path fill="#aa7c20" d="M11 47h7v-7h7v-7h7v-7h7v-7h11v11h-7v7h-7v7h-7v7H18v7h-7z" />
              <path fill="#f0c83f" d="M16 46h5v-7h7v-7h7v-7h9v5h-6v7h-7v7h-7v7h-8z" />
              <path fill="#fff08b" d="M39 23h5v5h-5zM30 32h5v5h-5zM21 41h5v5h-5z" />
              <path fill="#8b6630" d="M6 50h24v6H6z" />
              <path fill="#d4a23b" d="M9 51h18v3H9z" />
              <path fill="#674226" d="M14 55h7v16h-7z" />
              <path fill="#3c2a21" d="M11 68h13v5H11z" />
              <path fill="#db8e82" d="M3 38h12v34H3z" />
              <path fill="#68784b" d="M3 55h12v13H3z" />
            </g>
            <g className="mob-sprite__limb mob-sprite__limb--front-leg">
              <path fill="#dc8c81" d="M17 72h15v24H17z" />
              <path fill="#efaaa0" d="M20 73h12v15H20z" />
              <path fill="#704844" d="M17 90h15v6H17z" />
            </g>
          </svg>
        )}
        {selectedMob === 'enderman' && (
          <svg className="creeper-mascot__sprite creeper-mascot__sprite--enderman" viewBox="0 0 64 96" role="presentation" shapeRendering="crispEdges">
            <g className="mob-sprite__limb mob-sprite__limb--back-arm enderman__limb">
              <path fill="#0b0c0d" d="M49 31h9v31h-7v7H40v-9h9z" />
              <path fill="#202023" d="M52 33h6v26h-6z" />
              <path fill="#08090a" d="M40 60h12v9H40z" />
            </g>
            <g className="mob-sprite__limb mob-sprite__limb--back-leg enderman__limb">
              <path fill="#0a0b0c" d="M35 59h11v37H35z" />
              <path fill="#1d1c20" d="M39 61h7v29h-7z" />
              <path fill="#060708" d="M35 91h14v5H35z" />
            </g>
            <g className="mob-sprite__body enderman__body">
              <path fill="#0a0b0c" d="M10 0h44v30H10z" />
              <path fill="#19191c" d="M14 3h35v23H14z" />
              <path fill="#262329" d="M18 5h27v18H18z" />
              <path fill="#0d0e10" d="M10 0h8v30h-8zM47 0h7v30h-7zM18 24h29v6H18z" />
              <g className="enderman__eyes">
                <path fill="#bb22ee" d="M16 11h13v5H16zM36 11h13v5H36z" />
                <path fill="#f09cff" d="M22 11h7v3h-7zM42 11h7v3h-7z" />
                <path fill="#7811a4" d="M16 15h13v2H16zM36 15h13v2H36z" />
              </g>
              <path fill="#08090a" d="M22 30h20v32H22z" />
              <path fill="#1b1a1e" d="M26 32h12v26H26z" />
              <path fill="#26242a" d="M29 34h9v18h-9z" />
              <path fill="#070809" d="M22 57h20v6H22z" />
            </g>
            <g className="mob-sprite__limb mob-sprite__limb--front-arm enderman__limb">
              <path fill="#0d0e10" d="M6 31h9v29h9v9H12v-7H6z" />
              <path fill="#262329" d="M9 33h6v25H9z" />
              <path fill="#08090a" d="M12 60h12v9H12z" />
            </g>
            <g className="mob-sprite__limb mob-sprite__limb--front-leg enderman__limb">
              <path fill="#0c0d0e" d="M20 59h11v37H20z" />
              <path fill="#252329" d="M23 61h8v29h-8z" />
              <path fill="#060708" d="M17 91h14v5H17z" />
            </g>
            <g className="enderman__grass-block">
              <path fill="#281b12" d="M20 56h24v25H20z" />
              <path fill="#79502f" d="M22 58h20v21H22z" />
              <path fill="#9a6840" d="M24 65h7v5h-7zM35 61h7v8h-7zM31 72h8v7h-8zM22 75h6v4h-6z" />
              <path fill="#4c8f35" d="M20 56h24v9H20z" />
              <path fill="#72b84b" d="M22 56h8v4h-8zM34 57h8v3h-8z" />
              <path fill="#326d2d" d="M20 61h6v6h-6zM29 60h6v6h-6zM40 60h4v7h-4z" />
              <path fill="#b18255" d="M26 69h4v3h-4zM36 70h6v3h-6zM29 77h5v2h-5z" />
            </g>
          </svg>
        )}
        {selectedMob === 'enderman' && (
          <span className="enderman-particles">
            {Array.from({ length: 14 }, (_, index) => (
              <i
                key={index}
                style={{
                  '--particle-x': `${((index * 29) % 92) - 8}%`,
                  '--particle-y': `${(index * 17) % 90}px`,
                  '--particle-delay': `${-(index * 137) % 1600}ms`,
                  '--particle-drift': `${index % 2 ? -11 : 11}px`,
                  '--particle-duration': `${1100 + (index % 4) * 180}ms`,
                }}
              />
            ))}
          </span>
        )}
        {selectedMob === 'jockey' && (
          <svg className="creeper-mascot__sprite creeper-mascot__sprite--jockey" viewBox="0 0 64 96" role="presentation" shapeRendering="crispEdges">
            <g className="jockey-chicken__wing jockey-chicken__wing--back">
              <path fill="#c9c8bb" d="M9 61h19v19H9z" />
              <path fill="#aead9f" d="M9 73h15v9H9z" />
            </g>
            <g className="mob-sprite__limb jockey-chicken__leg jockey-chicken__leg--back mob-sprite__limb--back-leg">
              <path fill="#b27b2c" d="M37 80h5v14h-5zM34 92h12v4H34z" />
            </g>
            <g className="jockey-chicken__body">
              <path fill="#e6e2d2" d="M8 55h45v29H8z" />
              <path fill="#fffdf0" d="M12 57h30v20H12z" />
              <path fill="#c7c4b6" d="M8 76h45v9H8z" />
              <path fill="#f2eee0" d="M40 43h19v27H40z" />
              <path fill="#fffdf2" d="M43 45h14v17H43z" />
              <path fill="#20251f" d="M44 50h4v4h-4zM53 50h4v4h-4z" />
              <path fill="#e1a02b" d="M58 55h6v7h-6z" />
              <path fill="#cf3d31" d="M45 62h10v9H45z" />
              <path fill="#d84a38" d="M48 40h8v5h-8z" />
            </g>
            <g className="jockey-chicken__wing jockey-chicken__wing--front">
              <path fill="#f4f0e2" d="M17 61h23v20H17z" />
              <path fill="#d7d4c7" d="M22 73h18v10H22z" />
            </g>
            <g className="mob-sprite__limb jockey-chicken__leg jockey-chicken__leg--front mob-sprite__limb--front-leg">
              <path fill="#d79b38" d="M22 80h5v14h-5zM18 92h13v4H18z" />
            </g>
            <g className="jockey-rider">
            <g className="jockey-rider__leg jockey-rider__leg--back">
              <path fill="#4a326c" d="M34 43h10v18H34z" />
            </g>
            <g className="jockey-rider__body">
              <path fill="#287f82" d="M20 24h25v23H20z" />
              <path fill="#3ca9a5" d="M23 25h14v19H23z" />
              <path fill="#4c3371" d="M20 43h24v9H20z" />
              <path fill="#4f7e42" d="M16 0h32v25H16z" />
              <path fill="#6d9b54" d="M19 3h24v18H19z" />
              <path fill="#315c34" d="M16 4h6v13h-6zM42 0h6v18h-6z" />
              <path fill="#172a1e" d="M22 9h7v6H22zM36 9h7v6h-7z" />
              <path fill="#91a760" d="M24 10h3v3h-3zM38 10h3v3h-3z" />
              <path fill="#2c432b" d="M27 18h13v4H27z" />
            </g>
            <g className="jockey-rider__arm jockey-rider__arm--back">
              <path fill="#48763f" d="M44 26h9v24h-9z" />
            </g>
            <g className="jockey-rider__arm jockey-rider__arm--front">
              <path fill="#5f8e49" d="M12 26h9v24h-9z" />
            </g>
            <g className="jockey-rider__leg jockey-rider__leg--front">
              <path fill="#5a3c7b" d="M21 43h10v18H21z" />
            </g>
            </g>
          </svg>
        )}
        {selectedMob === 'spider' && (
          <svg className="creeper-mascot__sprite creeper-mascot__sprite--spider" viewBox="0 0 64 96" role="presentation" shapeRendering="crispEdges">
            <g className="spider-leg spider-leg--a spider-leg--left-1">
              <path fill="#282321" d="M24 51H12v-8H3v6h5v9h16z" />
            </g>
            <g className="spider-leg spider-leg--b spider-leg--left-2">
              <path fill="#332c29" d="M23 57H9v-5H0v7h7v6h16z" />
            </g>
            <g className="spider-leg spider-leg--a spider-leg--left-3">
              <path fill="#211d1b" d="M23 64H8v6H0v7h12v-6h11z" />
            </g>
            <g className="spider-leg spider-leg--b spider-leg--left-4">
              <path fill="#3b332e" d="M25 69H13v10H5v9h7v-4h7V75h6z" />
            </g>
            <g className="spider-leg spider-leg--b spider-leg--right-1">
              <path fill="#211d1b" d="M40 51h12v-8h9v6h-5v9H40z" />
            </g>
            <g className="spider-leg spider-leg--a spider-leg--right-2">
              <path fill="#37302c" d="M41 57h14v-5h9v7h-7v6H41z" />
            </g>
            <g className="spider-leg spider-leg--b spider-leg--right-3">
              <path fill="#292320" d="M41 64h15v6h8v7H52v-6H41z" />
            </g>
            <g className="spider-leg spider-leg--a spider-leg--right-4">
              <path fill="#403732" d="M39 69h12v10h8v9h-7v-4h-7V75h-6z" />
            </g>
            <g className="spider-body">
              <path fill="#2b2623" d="M7 44h35v31H7z" />
              <path fill="#493e38" d="M11 47h25v23H11z" />
              <path fill="#5a4a41" d="M14 49h13v10H14z" />
              <path fill="#211d1b" d="M35 51h27v25H35z" />
              <path fill="#3a312d" d="M39 54h19v18H39z" />
              <path fill="#a62324" d="M40 58h6v5h-6zM49 57h6v6h-6zM57 59h5v5h-5z" />
              <path fill="#f04a3f" d="M42 58h3v2h-3zM51 57h3v3h-3z" />
              <path fill="#171413" d="M10 67h26v9H10zM39 69h20v8H39z" />
            </g>
          </svg>
        )}
        {selectedMob === 'spiderJockey' && (
          <svg className="creeper-mascot__sprite creeper-mascot__sprite--spider-jockey" viewBox="0 0 64 96" role="presentation" shapeRendering="crispEdges">
            <g className="spider-leg spider-leg--a spider-leg--left-1">
              <path fill="#282321" d="M24 64H12v-7H3v6h5v8h16z" />
            </g>
            <g className="spider-leg spider-leg--b spider-leg--left-2">
              <path fill="#332c29" d="M23 70H9v-4H0v7h7v5h16z" />
            </g>
            <g className="spider-leg spider-leg--a spider-leg--left-3">
              <path fill="#211d1b" d="M23 76H8v5H0v7h12v-5h11z" />
            </g>
            <g className="spider-leg spider-leg--b spider-leg--left-4">
              <path fill="#3b332e" d="M25 80H13v8H5v8h7v-3h7v-7h6z" />
            </g>
            <g className="spider-leg spider-leg--b spider-leg--right-1">
              <path fill="#211d1b" d="M40 64h12v-7h9v6h-5v8H40z" />
            </g>
            <g className="spider-leg spider-leg--a spider-leg--right-2">
              <path fill="#37302c" d="M41 70h14v-4h9v7h-7v5H41z" />
            </g>
            <g className="spider-leg spider-leg--b spider-leg--right-3">
              <path fill="#292320" d="M41 76h15v5h8v7H52v-5H41z" />
            </g>
            <g className="spider-leg spider-leg--a spider-leg--right-4">
              <path fill="#403732" d="M39 80h12v8h8v8h-7v-3h-7v-7h-6z" />
            </g>
            <g className="spider-body">
              <path fill="#2b2623" d="M7 55h35v27H7z" />
              <path fill="#493e38" d="M11 58h25v20H11z" />
              <path fill="#5a4a41" d="M14 60h13v9H14z" />
              <path fill="#211d1b" d="M35 62h27v22H35z" />
              <path fill="#3a312d" d="M39 65h19v15H39z" />
              <path fill="#a62324" d="M40 68h6v5h-6zM49 67h6v6h-6zM57 69h5v5h-5z" />
              <path fill="#f04a3f" d="M42 68h3v2h-3zM51 67h3v3h-3z" />
              <path fill="#171413" d="M10 75h26v8H10zM39 77h20v8H39z" />
            </g>
            <g className="spider-jockey__rider">
              <g className="mob-sprite__limb mob-sprite__limb--back-leg spider-jockey__rider-leg">
                <path fill="#9da3a0" d="M35 48h8v18h-8z" />
                <path fill="#747b78" d="M35 61h12v5H35z" />
              </g>
              <g className="mob-sprite__limb mob-sprite__limb--back-arm">
                <path fill="#aeb4b0" d="M9 29h8v28H9z" />
                <path fill="#858c88" d="M9 49h12v8H9z" />
              </g>
              <g className="spider-jockey__body">
                <path fill="#c8ceca" d="M24 27h17v28H24z" />
                <path fill="#848b87" d="M27 31h11v4H27zM27 39h11v3H27zM27 47h11v3H27z" />
                <path fill="#6c7470" d="M31 28h4v27h-4z" />
                <path fill="#d2d7d3" d="M16 0h32v27H16z" />
                <path fill="#aeb4b0" d="M20 4h24v19H20z" />
                <path fill="#747b78" d="M16 0h7v6h-7zM41 0h7v8h-7zM19 21h27v6H19z" />
                <path fill="#242725" d="M21 9h7v7h-7zM36 9h7v7h-7zM27 19h11v5H27z" />
              </g>
              <g className="mob-sprite__limb mob-sprite__limb--front-arm">
                <path fill="#c2c8c4" d="M42 29h8v28h-8z" />
                <path fill="#916337" d="M50 25h4v35h-4zM47 25h7v4h-7zM47 56h7v4h-7z" />
                <path fill="none" stroke="#d2b07b" strokeWidth="2" d="M53 27l7 15-7 16" />
              </g>
              <g className="mob-sprite__limb mob-sprite__limb--front-leg spider-jockey__rider-leg">
                <path fill="#b8bebb" d="M22 48h8v18h-8z" />
                <path fill="#858c88" d="M18 61h12v5H18z" />
              </g>
            </g>
          </svg>
        )}
        <span className="creeper-mascot__shadow" />
        <span className="creeper-mascot__burst">
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
        </span>
      </div>
      {arrowShot && (
        <span
          key={arrowShot.id}
          className={`skeleton-arrow skeleton-arrow--${arrowShot.direction}${arrowShot.mounted ? ' skeleton-arrow--mounted' : ''}`}
          style={{
            '--arrow-start-x': `${Math.round(arrowShot.startX)}px`,
            '--arrow-travel': `${Math.round(arrowShot.travel)}px`,
            '--arrow-duration': `${Math.round(arrowShot.duration)}ms`,
          }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 40 12" shapeRendering="crispEdges">
            <path fill="#d9d9ce" d="M0 4h29v4H0z" />
            <path fill="#f5f4e8" d="M27 2h7v8h-7zM34 0h6v12h-6z" />
            <path fill="#765736" d="M0 1h4v10H0zM4 3h5v6H4z" />
          </svg>
        </span>
      )}
    </div>
  );
}

export default CreeperMascot;
