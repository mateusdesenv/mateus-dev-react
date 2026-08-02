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
const STEVE_MANUAL_SPRINT_SPEED = 310;
const STEVE_JUMP_VELOCITY = 430;
const STEVE_JUMP_GRAVITY = 1150;
const DIAMOND_SIZE = 32;
const DIAMOND_MIN_DISTANCE = 150;
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
const ENDER_DRAGON_MIN_INTERVAL = 5000;
const ENDER_DRAGON_MAX_INTERVAL = 10000;
const ENDER_DRAGON_MIN_DURATION = 4200;
const ENDER_DRAGON_MAX_DURATION = 5800;
const BONUS_MOB_INTERVAL = 5;
const BONUS_MOB_WIDTH = 56;
const BONUS_MOB_HEIGHT = 72;
const BONUS_ARROW_SPEED = 430;
const HOSTILE_MOBS = ['creeper', 'skeleton', 'zombie', 'jockey', 'spider', 'spiderJockey', 'slime'];
const PASSIVE_MOBS = new Set(['pigman', 'enderman']);
const RANGED_MOBS = new Set(['skeleton', 'spiderJockey']);
const MELEE_MOBS = new Set(['zombie', 'jockey', 'spider', 'slime']);
const MOB_ATTACK_DELAY = {
  zombie: 320,
  jockey: 260,
  spider: 180,
  slime: 220,
};
const MOB_SPEED = {
  creeper: 88,
  skeleton: 74,
  zombie: 82,
  jockey: 106,
  spider: 118,
  spiderJockey: 92,
  slime: 78,
};
const MOBS = [
  { id: 'creeper', label: 'Creeper' },
  { id: 'skeleton', label: 'Esqueleto' },
  { id: 'zombie', label: 'Zumbi' },
  { id: 'jockey', label: 'Baby Zumbi' },
  { id: 'spider', label: 'Aranha' },
  { id: 'spiderJockey', label: 'Spider Jockey' },
  { id: 'pigman', label: 'Zombie Pigman' },
  { id: 'slime', label: 'Slime' },
  { id: 'enderman', label: 'Enderman' },
];

const SKINS = [
  { id: 'steve', label: 'Steve' },
  { id: 'technoblade', label: 'Technoblade' },
  { id: 'viniccius13', label: 'Viniccius 13' },
  { id: 'monark', label: 'Monark' },
  { id: 'feromonas', label: 'Feromonas' },
  { id: 'daviGamer', label: 'Davi Gamer' },
];

const SKIN_COLORS = {
  steve: { skin: '#b96f50', skinLight: '#d9966b', hair: '#39251d', shirt: '#188f91', shirtLight: '#35b8b1', shirtDark: '#0c6269', pants: '#263b9b', boots: '#151c4b' },
  technoblade: { skin: '#ef9c91', skinLight: '#ffc0b3', hair: '#d86673', shirt: '#a71f32', shirtLight: '#d43743', shirtDark: '#681522', pants: '#26252e', boots: '#111117' },
  viniccius13: { skin: '#d19a68', skinLight: '#edb77d', hair: '#111213', shirt: '#d90d15', shirtLight: '#f21a20', shirtDark: '#7d080d', pants: '#11131d', boots: '#49171b' },
  monark: { skin: '#dc8d5e', skinLight: '#f1a875', hair: '#092414', shirt: '#0d0e0f', shirtLight: '#1a1b1c', shirtDark: '#050606', pants: '#08090a', boots: '#020303' },
  feromonas: { skin: '#d08b60', skinLight: '#e9a371', hair: '#101011', shirt: '#111015', shirtLight: '#242126', shirtDark: '#08070a', pants: '#32150f', boots: '#09090b' },
  daviGamer: { skin: '#e5a77d', skinLight: '#f4c099', hair: '#783914', shirt: '#f1f2f0', shirtLight: '#ffffff', shirtDark: '#151619', pants: '#111217', boots: '#292b31' },
};

const DEATH_MESSAGES = {
  creeper: 'Você foi explodido por um Creeper',
  skeleton: 'Você foi atingido por uma flecha de Esqueleto',
  spiderJockey: 'Você foi atingido por uma flecha de Spider Jockey',
  zombie: 'Você levou uma espadada de Zumbi',
  jockey: 'Você foi atacado por um Baby Zumbi',
  spider: 'Você foi atacado por uma Aranha',
  slime: 'Você foi esmagado por um Slime',
};

function getEntityGap(mobX, mobY, mobWidth, mobHeight, steveX, steveY, steveHeight) {
  const horizontalGap = mobX <= steveX
    ? Math.max(0, steveX - (mobX + mobWidth))
    : Math.max(0, mobX - (steveX + STEVE_WIDTH));
  const verticalGap = mobY <= steveY
    ? Math.max(0, steveY - (mobY + mobHeight))
    : Math.max(0, mobY - (steveY + steveHeight));

  return Math.hypot(horizontalGap, verticalGap);
}

function createRandomDiamond(steveX, steveY) {
  const sidePadding = window.innerWidth <= 560 ? 56 : 88;
  const minX = Math.min(sidePadding, Math.max(8, window.innerWidth - DIAMOND_SIZE));
  const maxX = Math.max(minX, window.innerWidth - sidePadding - DIAMOND_SIZE);
  const minY = 54;
  const maxY = Math.max(minY, window.innerHeight - 150 - DIAMOND_SIZE);
  const steveCenterX = steveX + (STEVE_WIDTH / 2);
  const steveCenterY = steveY + (window.innerWidth <= 560 ? 35 : 44);
  let nextDiamond;

  for (let attempt = 0; attempt < 16; attempt += 1) {
    nextDiamond = {
      id: `${Date.now()}-${Math.random()}`,
      x: minX + Math.random() * (maxX - minX),
      y: minY + Math.random() * (maxY - minY),
    };

    const distance = Math.hypot(
      nextDiamond.x + (DIAMOND_SIZE / 2) - steveCenterX,
      nextDiamond.y + (DIAMOND_SIZE / 2) - steveCenterY,
    );

    if (distance >= DIAMOND_MIN_DISTANCE) break;
  }

  return nextDiamond;
}

function DiamondIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <path fill="#143d4b" d="M8 2h16v3h4v7h-3v4h-3v4h-3v4h-6v-4h-3v-4H7v-4H4V5h4z" />
      <path fill="#72ffff" d="M9 5h14v3h3v4h-4v4h-3v4h-6v-4h-3v-4H7V8h2z" />
      <path fill="#dcffff" d="M10 5h8v3h-5v4H8V8h2z" />
      <path fill="#32d7df" d="M18 8h8v4h-4v4h-3v4h-3v-8z" />
      <path fill="#1996ae" d="M7 12h6v4h3v4h3v4h-6v-4h-3v-4H7z" />
      <path fill="#0c6c82" d="M4 8h3v4h3v4h3v4h3v4h-3v-4h-3v-4H7v-4H4z" />
      <path fill="#baffff" d="M13 8h5v4h-5z" />
    </svg>
  );
}

function SkinDockIcon({ skin }) {
  const colors = SKIN_COLORS[skin];
  const isTechno = skin === 'technoblade';

  if (skin === 'monark') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="#0a2012" d="M2 1h12v6H2z" />
        <path fill="#12371f" d="M1 2h11v3H1zM2 5h3v5H2z" />
        <path fill="#e39765" d="M4 5h10v8H4z" />
        <path fill="#f2ad79" d="M6 6h8v5H6z" />
        <path fill="#151515" d="M7 7h2v2H7zM12 7h2v2h-2z" />
        <path fill="#090a0b" d="M2 12h12v4H2z" />
        <path fill="#b18d42" d="M6 12h5v3H6z" />
        <path fill="#e3ddbd" d="M7 13h3v2H7z" />
      </svg>
    );
  }

  if (skin === 'feromonas') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="#771d1d" d="M2 1h12v5H2z" />
        <path fill="#f0e2c6" d="M3 2h3v2H3zM10 1h3v3h-3zM7 3h2v2H7z" />
        <path fill="#111012" d="M2 5h12v5H2z" />
        <path fill="#df996b" d="M8 5h6v7H8z" />
        <path fill="#101013" d="M10 7h2v2h-2zM2 11h12v5H2z" />
        <path fill="#9a8a47" d="M5 12h2v4H5zM9 12h2v4H9z" />
        <path fill="#e9e5d3" d="M7 11h3v2H7z" />
        <path fill="#dc1f29" d="M2 12h2v3H2zM12 12h2v3h-2z" />
      </svg>
    );
  }

  if (skin === 'daviGamer') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="#713713" d="M2 1h12v6H2z" />
        <path fill="#a95622" d="M3 1h8v3H3zM2 4h4v4H2z" />
        <path fill="#efb98f" d="M5 5h9v7H5z" />
        <path fill="#101115" d="M7 7h2v2H7zM12 7h2v2h-2z" />
        <path fill="#ffffff" d="M8 10h5v2H8zM5 12h7v4H5z" />
        <path fill="#e3382f" d="M10 10h3v2h-3z" />
        <path fill="#15161a" d="M2 11h4v5H2zM12 11h2v5h-2z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      <path fill={isTechno ? '#ef9c91' : colors.hair} d="M2 1h12v14H2z" />
      <path fill={colors.skinLight} d="M3 4h10v9H3z" />
      {!isTechno && <path fill={colors.hair} d="M3 2h10v4H3zM3 5h2v4H3zM11 5h2v4h-2z" />}
      {isTechno && <path fill="#efc43b" d="M2 0h3v3h3V0h3v3h3V0h1v5H2z" />}
      <path fill="#f5f2e9" d="M4 7h3v2H4zM10 7h3v2h-3z" />
      <path fill="#2f5363" d="M6 7h1v2H6zM10 7h1v2h-1z" />
      {isTechno && <path fill="#9d4e51" d="M6 10h5v3H6zM5 11h1v2H5zM11 11h1v2h-1z" />}
      {skin === 'steve' && <path fill="#5a3629" d="M3 9h2v4h2v2h5v-2h2V9h-2v2h-2v2H7v-2H5V9z" />}
      {skin === 'viniccius13' && <path fill="#f5f3eb" d="M5 9h7v4H5z" />}
      {skin === 'viniccius13' && <path fill="#111217" d="M2 4h2v8H2zM13 4h2v8h-2zM12 10h4v2h-4zM7 13h4v2H7z" />}
      {skin === 'viniccius13' && <path fill="#e7131b" d="M2 13h12v2H2z" />}
    </svg>
  );
}

function ReferenceCharacterSkin({ skin }) {
  const colors = SKIN_COLORS[skin];
  const isMonark = skin === 'monark';
  const isFeromonas = skin === 'feromonas';

  return (
    <svg className="creeper-mascot__steve-sprite" data-skin={skin} viewBox="0 0 48 88" role="presentation" shapeRendering="crispEdges">
      <g className="creeper-mascot__steve-head">
        {isMonark && (
          <>
            <path fill="#081d10" d="M7 1h34v14H7z" />
            <path fill="#0c2b17" d="M5 4h31v11H5zM7 12h7v15H7z" />
            <path fill="#174a29" d="M10 12h8v15h-8z" />
            <path fill={colors.skin} d="M14 12h27v20H14z" />
            <path fill={colors.skinLight} d="M20 14h21v14H20z" />
            <path fill="#f3b07c" d="M20 14h6v9h-6z" />
            <path fill="#121313" d="M26 15h6v6h-6zM37 14h4v7h-4z" />
            <path fill="#e59a69" d="M28 23h12v5H28z" />
            <path fill="#c97850" d="M14 27h10v5H14z" />
          </>
        )}
        {isFeromonas && (
          <>
            <path fill="#6f1719" d="M7 0h34v11H7z" />
            <path fill="#922322" d="M9 2h30v8H9z" />
            <path fill="#f1e3c8" d="M10 2h6v5h-6zM30 1h8v6h-8zM21 5h6v5h-6z" />
            <path fill="#8a1f1e" d="M13 3h3v3h-3zM33 2h3v4h-3zM23 6h3v3h-3z" />
            <path fill="#101012" d="M7 10h34v18H7z" />
            <path fill={colors.skin} d="M20 11h21v21H20z" />
            <path fill={colors.skinLight} d="M25 13h16v15H25z" />
            <path fill="#111114" d="M31 15h6v6h-6zM18 11h8v18h-8z" />
            <path fill="#66311f" d="M30 25h11v7H30z" />
            <path fill="#0b0b0d" d="M36 25h5v7h-5z" />
          </>
        )}
        {!isMonark && !isFeromonas && (
          <>
            <path fill="#783914" d="M7 0h34v17H7z" />
            <path fill="#a95422" d="M10 1h25v8H10zM7 7h12v14H7z" />
            <path fill="#c36a31" d="M13 2h15v5H13z" />
            <path fill={colors.skin} d="M14 10h27v22H14z" />
            <path fill={colors.skinLight} d="M19 12h22v17H19z" />
            <path fill="#f8f5ec" d="M20 15h7v5h-7zM33 15h7v5h-7z" />
            <path fill="#111216" d="M24 15h3v5h-3zM33 15h3v5h-3z" />
            <path fill="#151518" d="M27 22h12v8H27z" />
            <path fill="#f4f2e9" d="M28 22h7v3h-7z" />
            <path fill="#e52f2b" d="M31 25h8v5h-8z" />
          </>
        )}
      </g>

      <path fill={colors.shirtDark} d="M11 33h26v28H11z" />
      <path fill={colors.shirt} d="M14 34h20v25H14z" />

      {isMonark && (
        <>
          <path fill="#171819" d="M14 34h20v25H14z" />
          <path fill="#b38b3c" d="M19 38h12v5H19zM17 44h16v8H17z" />
          <path fill="#d8d1ae" d="M19 45h5v6h-5zM27 45h5v6h-5z" />
          <path fill="#2c2720" d="M23 44h6v8h-6z" />
          <path fill="#a79661" d="M20 52h11v5H20z" />
        </>
      )}

      {isFeromonas && (
        <>
          <path fill="#151419" d="M14 34h20v26H14z" />
          <path fill="#eee9dc" d="M20 34h9v8h-9zM22 41h6v5h-6z" />
          <path fill="#93843b" d="M16 35h4v23h-4zM29 35h4v23h-4zM20 38h9v3h-9zM20 47h9v3h-9zM20 55h9v3h-9z" />
          <path fill="#333025" d="M23 42h4v4h-4zM23 51h4v4h-4z" />
          <path fill="#5b2117" d="M14 57h20v4H14z" />
        </>
      )}

      {!isMonark && !isFeromonas && (
        <>
          <path fill="#15161a" d="M11 33h10v28H11zM29 33h9v28h-9z" />
          <path fill="#f4f5f2" d="M20 34h10v25H20z" />
          <path fill="#d7d9d8" d="M20 34h4v25h-4z" />
          <path fill="#313339" d="M18 55h14v6H18z" />
        </>
      )}

      <g className="creeper-mascot__steve-arm creeper-mascot__steve-arm--back">
        <path fill={colors.shirtDark} d="M35 35h10v29H35z" />
        <path fill={isFeromonas ? '#19171c' : '#111214'} d="M35 36h8v17H35z" />
        {isFeromonas && <path fill="#e3222b" d="M39 43h5v8h-5z" />}
        <path fill={colors.skin} d="M35 53h10v12H35z" />
      </g>
      <g className="creeper-mascot__steve-arm creeper-mascot__steve-arm--front">
        <path fill={colors.shirtDark} d="M3 35h10v29H3z" />
        <path fill={isFeromonas ? '#242126' : '#191a1c'} d="M6 36h7v17H6z" />
        {isFeromonas && <path fill="#e3222b" d="M3 43h5v8H3z" />}
        <path fill={colors.skinLight} d="M3 53h10v12H3z" />
      </g>
      <g className="creeper-mascot__steve-leg creeper-mascot__steve-leg--back">
        <path fill={colors.pants} d="M25 59h12v25H25z" />
        {isFeromonas && <path fill="#541d14" d="M25 59h12v9H25z" />}
        <path fill={colors.boots} d="M25 81h12v7H25z" />
        {!isMonark && <path fill="#494b50" d="M29 82h8v3h-8z" />}
      </g>
      <g className="creeper-mascot__steve-leg creeper-mascot__steve-leg--front">
        <path fill={colors.pants} d="M11 59h12v25H11z" />
        {isFeromonas && <path fill="#3e1712" d="M11 59h12v9H11z" />}
        <path fill={colors.boots} d="M11 81h12v7H11z" />
        {!isMonark && <path fill="#62646a" d="M11 82h8v3h-8z" />}
      </g>
    </svg>
  );
}

function CharacterSkin({ skin }) {
  if (skin === 'monark' || skin === 'feromonas' || skin === 'daviGamer') {
    return <ReferenceCharacterSkin skin={skin} />;
  }

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
            <path fill="#3c7187" d="M19 14h3v5h-3zM27 14h3v5h-3z" />
            <path fill="#744331" d="M20 24h10v3H20z" />
            {skin === 'steve' && <path fill="#5a3629" d="M10 20h4v8h5v4h15v-4h4v-8h-4v5h-5v3H20v-3h-6v-5z" />}
            {skin === 'steve' && <path fill={colors.skin} d="M22 19h6v6h-6z" />}
            {skin === 'viniccius13' && <path fill="#eeeee9" d="M16 19h18v11H16z" />}
            {skin === 'viniccius13' && <path fill="#101116" d="M19 14h3v5h-3zM27 14h3v5h-3zM21 29h10v4H21z" />}
            {skin === 'viniccius13' && <path fill="#f1f0eb" d="M8 4h4V1h25v3h4v20h-3V7h-3V4H14v3h-3v17H8z" />}
            {skin === 'viniccius13' && <path fill="#111217" d="M10 7h3v16h-3zM37 7h3v16h-3zM34 20h11v4H34zM42 23h3v4h-3z" />}
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
  if (mob === 'slime') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="#286b31" d="M1 2h14v13H1z" />
        <path fill="#59b858" d="M2 3h12v11H2z" />
        <path fill="#83d675" d="M3 4h8v3H3z" />
        <path fill="#b4ed9d" d="M3 4h4v2H3z" />
        <path fill="#173c20" d="M4 7h3v3H4zM10 7h3v3h-3zM6 11h5v2H6z" />
      </svg>
    );
  }

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

function EnderDragon() {
  return (
    <svg viewBox="0 0 192 96" role="presentation" shapeRendering="crispEdges">
      <g className="ender-dragon__wing ender-dragon__wing--back">
        <path fill="#100d13" d="M96 47V18H80V8H59V0H39v12h13v17H35v18z" />
        <path fill="#392540" d="M88 42V23H76V15H59v18H48v9z" />
        <path fill="#5a3565" d="M76 23h8v15h-8zM59 15h9v18h-9z" />
      </g>
      <g className="ender-dragon__wing ender-dragon__wing--front">
        <path fill="#17121b" d="M106 47V14h16V5h24V0h17v13h-12v16h17v18z" />
        <path fill="#432a4b" d="M114 42V20h12v-8h18v21h11v9z" />
        <path fill="#684078" d="M122 20h8v18h-8zM136 12h8v21h-8z" />
      </g>
      <g className="ender-dragon__tail">
        <path fill="#0b0a0d" d="M8 48h18v-7h19v5h21v17H43v7H23v-7H8z" />
        <path fill="#28202d" d="M0 46h14v12H0zM21 45h18v17H21zM42 49h20v14H42z" />
        <path fill="#8c36a7" d="M6 47h8v4H6zM28 46h8v5h-8zM48 50h9v4h-9z" />
      </g>
      <g className="ender-dragon__body">
        <path fill="#0b090d" d="M57 38h85v31H57z" />
        <path fill="#221a26" d="M65 42h69v22H65z" />
        <path fill="#39263f" d="M75 46h48v12H75z" />
        <path fill="#8d35a8" d="M68 61h58v5H68zM82 41h12v5H82zM110 39h10v6h-10z" />
        <path fill="#0b090d" d="M126 30h18v34h-18z" />
        <path fill="#211825" d="M132 32h12v27h-12z" />
      </g>
      <g className="ender-dragon__head">
        <path fill="#0a090c" d="M139 25h41v34h-41zM174 34h18v25h-18z" />
        <path fill="#251b29" d="M145 29h29v25h-29zM174 39h14v15h-14z" />
        <path fill="#3d2945" d="M151 31h18v12h-18z" />
        <path fill="#d848ff" d="M158 36h10v5h-10z" />
        <path fill="#f4aeff" d="M164 36h4v3h-4z" />
        <path fill="#100c13" d="M142 18h8v12h-8zM168 17h8v14h-8zM181 45h7v5h-7z" />
        <path fill="#8c36a7" d="M176 52h12v4h-12z" />
      </g>
      <g className="ender-dragon__leg ender-dragon__leg--back">
        <path fill="#121016" d="M108 65h13v19h-7v8h-14v-7h8z" />
        <path fill="#3a2841" d="M111 67h7v16h-7z" />
      </g>
      <g className="ender-dragon__leg ender-dragon__leg--front">
        <path fill="#0e0c11" d="M76 65h13v18h-7v9H68v-7h8z" />
        <path fill="#432d4b" d="M79 67h7v15h-7z" />
      </g>
    </svg>
  );
}

function BonusMobSprite({ mob }) {
  if (mob === 'creeper') {
    return (
      <svg viewBox="0 0 56 72" shapeRendering="crispEdges" aria-hidden="true">
        <path fill="#327b31" d="M12 2h32v30h6v28H36v10H25V60H8V32h4z" />
        <path fill="#62b64d" d="M15 5h25v27H15zM12 34h32v22H12z" />
        <path fill="#8bd064" d="M16 6h10v7H16zM33 16h7v11h-7zM17 38h8v8h-8z" />
        <path fill="#17351a" d="M17 15h8v9h-8zM32 15h8v9h-8zM24 27h9v7h-9zM19 33h20v12H19z" />
        <path fill="#245b28" d="M12 56h12v14H12zM35 56h11v14H35z" />
      </svg>
    );
  }

  if (mob === 'slime') {
    return (
      <svg viewBox="0 0 56 72" shapeRendering="crispEdges" aria-hidden="true">
        <path fill="#245c2c" d="M5 17h46v47H5z" />
        <path fill="#5eb653" d="M8 20h40v40H8z" />
        <path fill="#9bdd7d" d="M10 22h25v10H10z" />
        <path fill="#17381d" d="M14 34h9v11h-9zM35 34h9v11h-9zM20 49h20v7H20z" />
      </svg>
    );
  }

  if (mob === 'spider' || mob === 'spiderJockey') {
    return (
      <svg viewBox="0 0 56 72" shapeRendering="crispEdges" aria-hidden="true">
        {mob === 'spiderJockey' && (
          <g className="bonus-mob__rider">
            <path fill="#d8d9d2" d="M19 0h20v24H19zM24 22h11v19H24z" />
            <path fill="#525854" d="M22 7h5v6h-5zM32 7h5v6h-5zM27 15h6v4h-6z" />
            <path fill="#8d6338" d="M38 18h3v24h-3zM36 18h7v3h-7z" />
          </g>
        )}
        <path fill="#211c1c" d="M13 39h32v23H13z" />
        <path fill="#443735" d="M18 35h24v23H18z" />
        <path fill="#a62b27" d="M22 42h6v5h-6zM34 42h6v5h-6z" />
        <g className="bonus-mob__spider-legs" fill="#1b1717">
          <path d="M13 41H4v-7H0v11h13zM13 48H2v4h11zM13 55H5v8H0v5h10l7-11z" />
          <path d="M43 41h9v-7h4v11H43zM43 48h11v4H43zM43 55h8v8h5v5H46l-7-11z" />
        </g>
      </svg>
    );
  }

  if (mob === 'skeleton') {
    return (
      <svg viewBox="0 0 56 72" shapeRendering="crispEdges" aria-hidden="true">
        <path fill="#d7dad3" d="M14 2h29v25H14zM23 27h12v30H23zM13 54h12v16H13zM34 54h11v16H34z" />
        <path fill="#f0f1e9" d="M17 5h22v18H17z" />
        <path fill="#4e5551" d="M20 10h6v7h-6zM32 10h6v7h-6zM26 19h7v5h-7z" />
        <path fill="#916637" d="M43 22h4v40h-4zM40 22h7v4h-7zM40 58h7v4h-7z" />
        <path fill="none" stroke="#d3ad72" strokeWidth="2" d="M46 24l8 17-8 19" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 56 72" shapeRendering="crispEdges" aria-hidden="true">
      <path fill="#4f8344" d="M14 2h29v26H14z" />
      <path fill="#72a45b" d="M17 5h22v19H17z" />
      <path fill="#243725" d="M20 11h6v6h-6zM33 11h6v6h-6zM25 21h13v4H25z" />
      <path fill="#168e91" d="M12 28h33v27H12z" />
      <path fill="#263b91" d="M16 54h13v17H16zM32 54h13v17H32z" />
      <g className="bonus-mob__sword-arm">
        <path fill="#5f9551" d="M42 30h9v27h-9z" />
        <path fill="#2aaeb7" d="M46 5h7v32h-7zM40 10h19v7H40z" />
        <path fill="#c9f7f4" d="M48 7h3v24h-3z" />
        <path fill="#6a4b29" d="M46 36h7v17h-7z" />
      </g>
      {mob === 'jockey' && <path fill="#f2ead2" d="M8 60h42v10H8z" />}
    </svg>
  );
}

function CreeperMascot() {
  const [selectedMob, setSelectedMob] = useState('creeper');
  const [selectedSkin, setSelectedSkin] = useState('steve');
  const [isManualControl, setIsManualControl] = useState(false);
  const [isSteveMoving, setIsSteveMoving] = useState(true);
  const [isSteveSprinting, setIsSteveSprinting] = useState(false);
  const [isSteveJumping, setIsSteveJumping] = useState(false);
  const [diamond, setDiamond] = useState(null);
  const [diamondCount, setDiamondCount] = useState(0);
  const [status, setStatus] = useState('walking');
  const [steveDirection, setSteveDirection] = useState('right');
  const [creeperDirection, setCreeperDirection] = useState('right');
  const [isSkeletonShooting, setIsSkeletonShooting] = useState(false);
  const [isEndermanTeleporting, setIsEndermanTeleporting] = useState(false);
  const [isEndermanWalking, setIsEndermanWalking] = useState(false);
  const [enderDragonFlight, setEnderDragonFlight] = useState(null);
  const [arrowShot, setArrowShot] = useState(null);
  const [bonusMobs, setBonusMobs] = useState([]);
  const [bonusArrows, setBonusArrows] = useState([]);
  const [deathMessage, setDeathMessage] = useState(DEATH_MESSAGES.creeper);
  const [mobAnnouncement, setMobAnnouncement] = useState('');
  const [isMainMobAttacking, setIsMainMobAttacking] = useState(false);
  const mascotRef = useRef(null);
  const respawnButtonRef = useRef(null);
  const explosionTimerRef = useRef(0);
  const skeletonScheduleRef = useRef(0);
  const skeletonAimRef = useRef(0);
  const skeletonFinishRef = useRef(0);
  const arrowCleanupRef = useRef(0);
  const arrowHitRef = useRef(0);
  const mainMeleeAttackRef = useRef(0);
  const endermanScheduleRef = useRef(0);
  const endermanMoveRef = useRef(0);
  const endermanFinishRef = useRef(0);
  const endermanWalkStartRef = useRef(0);
  const endermanWalkFinishRef = useRef(0);
  const enderDragonScheduleRef = useRef(0);
  const enderDragonCleanupRef = useRef(0);
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
  const steveSprintingRef = useRef(false);
  const steveJumpingRef = useRef(false);
  const steveJumpVelocityRef = useRef(0);
  const steveJumpBaseYRef = useRef(0);
  const diamondRef = useRef(null);
  const diamondCountRef = useRef(0);
  const creeperPositionRef = useRef(12);
  const creeperVerticalPositionRef = useRef(0);
  const creeperDirectionRef = useRef(creeperDirection);
  const lastDirectionChangeRef = useRef(0);
  const bonusMobsRef = useRef([]);
  const bonusArrowsRef = useRef([]);
  const mainMeleeAttackingRef = useRef(false);

  const triggerGameOver = (message) => {
    if (statusRef.current === 'exploded') return;
    window.clearTimeout(explosionTimerRef.current);
    window.clearTimeout(mainMeleeAttackRef.current);
    window.clearTimeout(skeletonScheduleRef.current);
    window.clearTimeout(skeletonAimRef.current);
    window.clearTimeout(skeletonFinishRef.current);
    window.clearTimeout(arrowCleanupRef.current);
    window.clearTimeout(arrowHitRef.current);
    statusRef.current = 'exploded';
    mainMeleeAttackingRef.current = false;
    skeletonShootingRef.current = false;
    bonusArrowsRef.current = [];
    setIsMainMobAttacking(false);
    setIsSkeletonShooting(false);
    setArrowShot(null);
    setBonusArrows([]);
    setDeathMessage(message);
    setStatus('exploded');
  };

  const clearBonusThreats = () => {
    bonusMobsRef.current = [];
    bonusArrowsRef.current = [];
    setBonusMobs([]);
    setBonusArrows([]);
    setMobAnnouncement('');
  };

  const spawnBonusMob = (tier) => {
    const mob = HOSTILE_MOBS[Math.floor(Math.random() * HOSTILE_MOBS.length)];
    const entersFromRight = Math.random() >= 0.5;
    const maxY = Math.max(0, window.innerHeight - BONUS_MOB_HEIGHT - 8);
    const nextMob = {
      id: `${Date.now()}-${tier}-${Math.random()}`,
      mob,
      x: entersFromRight ? window.innerWidth + BONUS_MOB_WIDTH : -BONUS_MOB_WIDTH,
      y: Math.random() * maxY,
      direction: entersFromRight ? 'left' : 'right',
      status: 'walking',
      actionStartedAt: 0,
      nextAttackAt: performance.now() + 2200 + Math.random() * 2200,
    };

    bonusMobsRef.current = [...bonusMobsRef.current, nextMob];
    setBonusMobs([...bonusMobsRef.current]);
    setMobAnnouncement(`${MOBS.find((item) => item.id === mob)?.label || mob} entrou na perseguição`);
  };

  useEffect(() => {
    const updateStatus = (nextStatus) => {
      statusRef.current = nextStatus;
      setStatus(nextStatus);
    };

    const startCharging = () => {
      window.clearTimeout(explosionTimerRef.current);
      updateStatus('charging');
      explosionTimerRef.current = window.setTimeout(() => {
        triggerGameOver(DEATH_MESSAGES.creeper);
      }, EXPLOSION_DELAY);
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
        const steveY = steveVerticalPositionRef.current;
        const currentCreeperX = creeperPositionRef.current;
        const currentCreeperY = creeperVerticalPositionRef.current;
        const mobHeight = window.innerWidth <= 560 ? 72 : 96;
        const steveHeight = window.innerWidth <= 560 ? 70 : 88;
        const gap = getEntityGap(
          currentCreeperX,
          currentCreeperY,
          CREEPER_WIDTH,
          mobHeight,
          steveX,
          steveY,
          steveHeight,
        );

        if (statusRef.current === 'exploded') {
          animationFrame = window.requestAnimationFrame(followSteve);
          return;
        }

        if (selectedMob === 'creeper') {
          const shouldCharge = gap <= EXPLOSION_RANGE || cursorNearCreeperRef.current;
          if (shouldCharge && statusRef.current === 'walking') startCharging();
          if (!shouldCharge && statusRef.current === 'charging') cancelExplosion();
        } else if (statusRef.current === 'charging') {
          cancelExplosion();
        }

        if (MELEE_MOBS.has(selectedMob) && gap <= 8 && !mainMeleeAttackingRef.current) {
          mainMeleeAttackingRef.current = true;
          setIsMainMobAttacking(true);
          mainMeleeAttackRef.current = window.setTimeout(() => {
            const currentGap = getEntityGap(
              creeperPositionRef.current,
              creeperVerticalPositionRef.current,
              CREEPER_WIDTH,
              window.innerWidth <= 560 ? 72 : 96,
              stevePositionRef.current,
              steveVerticalPositionRef.current,
              window.innerWidth <= 560 ? 70 : 88,
            );

            if (currentGap <= 24) triggerGameOver(DEATH_MESSAGES[selectedMob]);
            mainMeleeAttackingRef.current = false;
            setIsMainMobAttacking(false);
          }, MOB_ATTACK_DELAY[selectedMob]);
        } else if (MELEE_MOBS.has(selectedMob) && gap > 34 && mainMeleeAttackingRef.current) {
          window.clearTimeout(mainMeleeAttackRef.current);
          mainMeleeAttackingRef.current = false;
          setIsMainMobAttacking(false);
        }

        if (!manualControlRef.current && !PASSIVE_MOBS.has(selectedMob) && gap <= STEVE_DANGER_RANGE && time - lastDirectionChangeRef.current >= DIRECTION_LOCK_TIME) {
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
          const isJumping = steveJumpingRef.current;
          const effectiveVerticalInput = isJumping ? 0 : verticalInput;
          const hasDirectionalInput = horizontalInput !== 0 || effectiveVerticalInput !== 0;
          const isMoving = hasDirectionalInput || isJumping;
          const isSprinting = hasDirectionalInput && pressedKeysRef.current.has('control');
          const diagonalScale = horizontalInput !== 0 && effectiveVerticalInput !== 0 ? Math.SQRT1_2 : 1;
          const manualSpeed = isSprinting ? STEVE_MANUAL_SPRINT_SPEED : STEVE_MANUAL_SPEED;

          if (isMoving !== steveMovingRef.current) {
            steveMovingRef.current = isMoving;
            setIsSteveMoving(isMoving);
          }

          if (isSprinting !== steveSprintingRef.current) {
            steveSprintingRef.current = isSprinting;
            setIsSteveSprinting(isSprinting);
          }

          if (horizontalInput !== 0) {
            const nextDirection = horizontalInput > 0 ? 'right' : 'left';
            if (nextDirection !== steveDirectionRef.current) {
              steveDirectionRef.current = nextDirection;
              setSteveDirection(nextDirection);
            }
          }

          nextSteveX += horizontalInput * manualSpeed * diagonalScale * elapsed;
          const maxVerticalPosition = Math.max(0, window.innerHeight - 118);

          if (isJumping) {
            steveJumpVelocityRef.current -= STEVE_JUMP_GRAVITY * elapsed;
            const nextVerticalPosition = steveVerticalPositionRef.current
              + steveJumpVelocityRef.current * elapsed;

            if (nextVerticalPosition >= maxVerticalPosition) {
              steveVerticalPositionRef.current = maxVerticalPosition;
              steveJumpVelocityRef.current = Math.min(0, steveJumpVelocityRef.current);
            } else if (
              steveJumpVelocityRef.current <= 0
              && nextVerticalPosition <= steveJumpBaseYRef.current
            ) {
              steveVerticalPositionRef.current = steveJumpBaseYRef.current;
              steveJumpVelocityRef.current = 0;
              steveJumpingRef.current = false;
              setIsSteveJumping(false);
            } else {
              steveVerticalPositionRef.current = Math.max(0, nextVerticalPosition);
            }
          } else {
            steveVerticalPositionRef.current = Math.max(
              0,
              Math.min(
                maxVerticalPosition,
                steveVerticalPositionRef.current + effectiveVerticalInput * manualSpeed * diagonalScale * elapsed,
              ),
            );
          }
        } else {
          const steveSpeed = statusRef.current === 'walking' ? STEVE_SPEED : STEVE_ESCAPE_SPEED;
          nextSteveX += (steveDirectionRef.current === 'right' ? 1 : -1) * steveSpeed * elapsed;
        }

        if (nextSteveX > window.innerWidth) nextSteveX = -STEVE_WIDTH;
        if (nextSteveX < -STEVE_WIDTH) nextSteveX = window.innerWidth;

        stevePositionRef.current = nextSteveX;

        const currentDiamond = diamondRef.current;
        if (manualControlRef.current && currentDiamond) {
          const diamondRight = currentDiamond.x + DIAMOND_SIZE;
          const diamondTop = currentDiamond.y + DIAMOND_SIZE;
          const overlapsDiamond = stevePositionRef.current < diamondRight
            && stevePositionRef.current + STEVE_WIDTH > currentDiamond.x
            && steveVerticalPositionRef.current < diamondTop
            && steveVerticalPositionRef.current + steveHeight > currentDiamond.y;

          if (overlapsDiamond) {
            const nextCount = diamondCountRef.current + 1;
            const nextDiamond = createRandomDiamond(
              stevePositionRef.current,
              steveVerticalPositionRef.current,
            );

            diamondCountRef.current = nextCount;
            diamondRef.current = nextDiamond;
            setDiamondCount(nextCount);
            setDiamond(nextDiamond);

            if (nextCount % BONUS_MOB_INTERVAL === 0) {
              spawnBonusMob(nextCount / BONUS_MOB_INTERVAL);
            }
          }
        }

        if (selectedMob === 'enderman' && endermanWalkingRef.current && !endermanTeleportingRef.current) {
          const targetX = stevePositionRef.current + (STEVE_WIDTH / 2);
          const targetY = steveVerticalPositionRef.current + (steveHeight / 2);
          const currentX = currentCreeperX + (CREEPER_WIDTH / 2);
          const currentY = currentCreeperY + (mobHeight / 2);
          const deltaX = targetX - currentX;
          const deltaY = targetY - currentY;
          const distance = Math.hypot(deltaX, deltaY);
          const movement = Math.min(distance, ENDERMAN_WALK_SPEED * elapsed);
          const maxMobY = Math.max(0, window.innerHeight - mobHeight);

          if (distance > 0.5) {
            const nextEndermanX = Math.max(0, Math.min(
              window.innerWidth - CREEPER_WIDTH,
              currentCreeperX + (deltaX / distance) * movement,
            ));
            const nextEndermanY = Math.max(0, Math.min(
              maxMobY,
              currentCreeperY + (deltaY / distance) * movement,
            ));
            const nextEndermanDirection = deltaX >= 0 ? 'right' : 'left';

            if (nextEndermanDirection !== creeperDirectionRef.current) {
              creeperDirectionRef.current = nextEndermanDirection;
              setCreeperDirection(nextEndermanDirection);
            }

            creeperPositionRef.current = nextEndermanX;
            creeperVerticalPositionRef.current = nextEndermanY;
          }
        } else if (!PASSIVE_MOBS.has(selectedMob) && statusRef.current === 'walking' && !skeletonShootingRef.current && !mainMeleeAttackingRef.current && !endermanTeleportingRef.current) {
          const targetX = stevePositionRef.current + (STEVE_WIDTH / 2);
          const targetY = steveVerticalPositionRef.current + (steveHeight / 2);
          const currentX = currentCreeperX + (CREEPER_WIDTH / 2);
          const currentY = currentCreeperY + (mobHeight / 2);
          const deltaX = targetX - currentX;
          const deltaY = targetY - currentY;
          const distance = Math.hypot(deltaX, deltaY);
          const movement = Math.min(distance, CREEPER_SPEED * elapsed);
          const maxMobY = Math.max(0, window.innerHeight - mobHeight);
          const stopGap = selectedMob === 'creeper' || RANGED_MOBS.has(selectedMob)
            ? EXPLOSION_RANGE
            : 0;

          if (gap > stopGap && distance > 0.5) {
            const nextCreeperX = Math.max(0, Math.min(
              window.innerWidth - CREEPER_WIDTH,
              currentCreeperX + (deltaX / distance) * movement,
            ));
            const nextCreeperY = Math.max(0, Math.min(
              maxMobY,
              currentCreeperY + (deltaY / distance) * movement,
            ));
            const nextCreeperDirection = deltaX >= 0 ? 'right' : 'left';

            if (nextCreeperDirection !== creeperDirectionRef.current) {
              creeperDirectionRef.current = nextCreeperDirection;
              setCreeperDirection(nextCreeperDirection);
            }

            creeperPositionRef.current = nextCreeperX;
            creeperVerticalPositionRef.current = nextCreeperY;
          }
        }

        let bonusStateChanged = false;
        const maxBonusY = Math.max(0, window.innerHeight - BONUS_MOB_HEIGHT - 4);

        bonusMobsRef.current.forEach((mob) => {
          const targetX = stevePositionRef.current + (STEVE_WIDTH / 2);
          const targetY = steveVerticalPositionRef.current + (steveHeight / 2);
          const mobCenterX = mob.x + (BONUS_MOB_WIDTH / 2);
          const mobCenterY = mob.y + (BONUS_MOB_HEIGHT / 2);
          const deltaX = targetX - mobCenterX;
          const deltaY = targetY - mobCenterY;
          const distance = Math.max(0.001, Math.hypot(deltaX, deltaY));
          const mobGap = getEntityGap(
            mob.x,
            mob.y,
            BONUS_MOB_WIDTH,
            BONUS_MOB_HEIGHT,
            stevePositionRef.current,
            steveVerticalPositionRef.current,
            steveHeight,
          );
          const nextDirection = deltaX >= 0 ? 'right' : 'left';

          if (nextDirection !== mob.direction) {
            mob.direction = nextDirection;
            bonusStateChanged = true;
          }

          if (mob.mob === 'creeper') {
            if (mobGap <= EXPLOSION_RANGE && mob.status === 'walking') {
              mob.status = 'charging';
              mob.actionStartedAt = time;
              bonusStateChanged = true;
            } else if (mobGap > 34 && mob.status === 'charging') {
              mob.status = 'walking';
              mob.actionStartedAt = 0;
              bonusStateChanged = true;
            } else if (mob.status === 'charging' && time - mob.actionStartedAt >= EXPLOSION_DELAY) {
              triggerGameOver(DEATH_MESSAGES.creeper);
            }
          } else if (RANGED_MOBS.has(mob.mob)) {
            if (mob.status === 'walking' && time >= mob.nextAttackAt) {
              mob.status = 'aiming';
              mob.actionStartedAt = time;
              bonusStateChanged = true;
            } else if (mob.status === 'aiming' && time - mob.actionStartedAt >= SKELETON_AIM_TIME) {
              const arrowStartX = mob.x + (mob.direction === 'right' ? 48 : 8);
              const arrowStartY = mob.y + (mob.mob === 'spiderJockey' ? 54 : 43);
              const arrowDeltaX = targetX - arrowStartX;
              const arrowDeltaY = targetY - arrowStartY;
              const arrowDistance = Math.max(1, Math.hypot(arrowDeltaX, arrowDeltaY));
              const nextArrow = {
                id: `${mob.id}-${Date.now()}`,
                mob: mob.mob,
                x: arrowStartX,
                y: arrowStartY,
                velocityX: (arrowDeltaX / arrowDistance) * BONUS_ARROW_SPEED,
                velocityY: (arrowDeltaY / arrowDistance) * BONUS_ARROW_SPEED,
                angle: Math.atan2(-arrowDeltaY, arrowDeltaX) * (180 / Math.PI),
              };

              bonusArrowsRef.current = [...bonusArrowsRef.current, nextArrow];
              setBonusArrows([...bonusArrowsRef.current]);
              mob.status = 'recovering';
              mob.actionStartedAt = time;
              bonusStateChanged = true;
            } else if (mob.status === 'recovering' && time - mob.actionStartedAt >= 620) {
              mob.status = 'walking';
              mob.nextAttackAt = time + 2600 + Math.random() * 2600;
              bonusStateChanged = true;
            }
          } else if (MELEE_MOBS.has(mob.mob)) {
            if (mobGap <= 8 && mob.status === 'walking') {
              mob.status = 'attacking';
              mob.actionStartedAt = time;
              bonusStateChanged = true;
            } else if (mob.status === 'attacking' && mobGap > 34) {
              mob.status = 'walking';
              bonusStateChanged = true;
            } else if (mob.status === 'attacking' && time - mob.actionStartedAt >= MOB_ATTACK_DELAY[mob.mob]) {
              triggerGameOver(DEATH_MESSAGES[mob.mob]);
            }
          }

          if (mob.status === 'walking' && statusRef.current !== 'exploded') {
            const movement = Math.min(distance, (MOB_SPEED[mob.mob] || 84) * elapsed);
            mob.x = Math.max(0, Math.min(
              window.innerWidth - BONUS_MOB_WIDTH,
              mob.x + (deltaX / distance) * movement,
            ));
            mob.y = Math.max(0, Math.min(
              maxBonusY,
              mob.y + (deltaY / distance) * movement,
            ));
          }

          const mobElement = mascotRef.current?.querySelector(`[data-bonus-id="${mob.id}"]`);
          mobElement?.style.setProperty('--bonus-mob-x', `${Math.round(mob.x)}px`);
          mobElement?.style.setProperty('--bonus-mob-y', `${Math.round(-mob.y)}px`);
        });

        if (bonusStateChanged) setBonusMobs([...bonusMobsRef.current]);

        let arrowsChanged = false;
        bonusArrowsRef.current = bonusArrowsRef.current.filter((arrow) => {
          arrow.x += arrow.velocityX * elapsed;
          arrow.y += arrow.velocityY * elapsed;

          const hitSteve = arrow.x >= stevePositionRef.current - 6
            && arrow.x <= stevePositionRef.current + STEVE_WIDTH + 6
            && arrow.y >= steveVerticalPositionRef.current - 6
            && arrow.y <= steveVerticalPositionRef.current + steveHeight + 6;
          const isOutside = arrow.x < -48
            || arrow.x > window.innerWidth + 48
            || arrow.y < -48
            || arrow.y > window.innerHeight + 48;

          if (hitSteve) {
            triggerGameOver(DEATH_MESSAGES[arrow.mob]);
            arrowsChanged = true;
            return false;
          }

          if (isOutside) {
            arrowsChanged = true;
            return false;
          }

          const arrowElement = mascotRef.current?.querySelector(`[data-bonus-arrow-id="${arrow.id}"]`);
          arrowElement?.style.setProperty('--bonus-arrow-x', `${Math.round(arrow.x)}px`);
          arrowElement?.style.setProperty('--bonus-arrow-y', `${Math.round(-arrow.y)}px`);
          return true;
        });

        if (arrowsChanged) setBonusArrows([...bonusArrowsRef.current]);

        mascotRef.current?.style.setProperty('--steve-x', `${Math.round(stevePositionRef.current)}px`);
        mascotRef.current?.style.setProperty('--steve-y', `${Math.round(-steveVerticalPositionRef.current)}px`);
        mascotRef.current?.style.setProperty('--creeper-x', `${Math.round(creeperPositionRef.current)}px`);
        mascotRef.current?.style.setProperty('--creeper-y', `${Math.round(-creeperVerticalPositionRef.current)}px`);
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
      window.clearTimeout(mainMeleeAttackRef.current);
      window.cancelAnimationFrame(animationFrame);
      cursorNearCreeperRef.current = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerExit);
      window.removeEventListener('blur', handlePointerExit);
    };
  }, [selectedMob]);

  useEffect(() => {
    if (status !== 'exploded') return undefined;

    pressedKeysRef.current.clear();
    mainMeleeAttackingRef.current = false;
    setIsMainMobAttacking(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => respawnButtonRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
    };
  }, [status]);

  useEffect(() => {
    window.clearTimeout(enderDragonScheduleRef.current);
    window.clearTimeout(enderDragonCleanupRef.current);
    setEnderDragonFlight(null);

    if (selectedMob !== 'enderman' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const scheduleNextFlight = () => {
      const interval = ENDER_DRAGON_MIN_INTERVAL
        + Math.random() * (ENDER_DRAGON_MAX_INTERVAL - ENDER_DRAGON_MIN_INTERVAL);

      enderDragonScheduleRef.current = window.setTimeout(() => {
        const duration = ENDER_DRAGON_MIN_DURATION
          + Math.random() * (ENDER_DRAGON_MAX_DURATION - ENDER_DRAGON_MIN_DURATION);

        setEnderDragonFlight({
          id: Date.now(),
          direction: Math.random() >= 0.5 ? 'right' : 'left',
          duration,
          top: 92 + Math.random() * 96,
        });

        enderDragonCleanupRef.current = window.setTimeout(() => {
          setEnderDragonFlight(null);
          scheduleNextFlight();
        }, duration + 120);
      }, interval);
    };

    scheduleNextFlight();

    return () => {
      window.clearTimeout(enderDragonScheduleRef.current);
      window.clearTimeout(enderDragonCleanupRef.current);
    };
  }, [selectedMob]);

  useEffect(() => {
    const interactiveTags = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

    const handleKeyDown = (event) => {
      if (!manualControlRef.current || event.repeat) return;
      if (interactiveTags.has(event.target.tagName) || event.target.isContentEditable) return;

      const key = event.code === 'Space' ? 'space' : event.key.toLowerCase();
      if (!['w', 'a', 's', 'd', 'control', 'space'].includes(key)) return;

      event.preventDefault();
      if (key === 'space') {
        if (!steveJumpingRef.current) {
          steveJumpBaseYRef.current = steveVerticalPositionRef.current;
          steveJumpVelocityRef.current = STEVE_JUMP_VELOCITY;
          steveJumpingRef.current = true;
          setIsSteveJumping(true);
        }
        return;
      }

      pressedKeysRef.current.add(key);
    };

    const handleKeyUp = (event) => {
      const key = event.code === 'Space' ? 'space' : event.key.toLowerCase();
      if (!['w', 'a', 's', 'd', 'control', 'space'].includes(key)) return;
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

      const nextDirection = stevePositionRef.current + (STEVE_WIDTH / 2)
        >= creeperPositionRef.current + (CREEPER_WIDTH / 2) ? 'right' : 'left';
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
          const mobHeight = window.innerWidth <= 560 ? 72 : 96;
          const maxY = Math.max(0, window.innerHeight - mobHeight);
          const currentX = creeperPositionRef.current;
          let nextX = Math.random() * maxX;
          const nextY = Math.random() * maxY;

          if (maxX > 320 && Math.abs(nextX - currentX) < 160) {
            nextX = (nextX + (maxX / 2)) % maxX;
          }

          creeperPositionRef.current = nextX;
          creeperVerticalPositionRef.current = nextY;
          mascotRef.current?.style.setProperty('--creeper-x', `${Math.round(nextX)}px`);
          mascotRef.current?.style.setProperty('--creeper-y', `${Math.round(-nextY)}px`);

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
    window.clearTimeout(arrowHitRef.current);
    window.clearTimeout(mainMeleeAttackRef.current);
    skeletonShootingRef.current = false;
    mainMeleeAttackingRef.current = false;
    setIsSkeletonShooting(false);
    setIsMainMobAttacking(false);
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
          const skeletonY = creeperVerticalPositionRef.current;
          const steveCenter = stevePositionRef.current + (STEVE_WIDTH / 2);
          const steveCenterY = steveVerticalPositionRef.current + (window.innerWidth <= 560 ? 35 : 44);
          const direction = steveCenter >= skeletonX + (CREEPER_WIDTH / 2) ? 'right' : 'left';
          const startX = skeletonX + (direction === 'right' ? 54 : 10);
          const travel = steveCenter - startX;
          const mounted = selectedMob === 'spiderJockey';
          const arrowBaseHeight = window.innerWidth <= 560
            ? (mounted ? 51 : 37)
            : (mounted ? 66 : 49);
          const startY = skeletonY + arrowBaseHeight;
          const travelY = startY - steveCenterY;
          const duration = Math.max(280, Math.min(850, Math.hypot(travel, travelY) * 0.82));

          if (direction !== creeperDirectionRef.current) {
            creeperDirectionRef.current = direction;
            setCreeperDirection(direction);
          }

          setArrowShot({
            id: Date.now(),
            startX,
            startY,
            travel,
            travelY,
            duration,
            direction,
            mounted,
          });
          arrowHitRef.current = window.setTimeout(() => {
            const currentSteveCenter = stevePositionRef.current + (STEVE_WIDTH / 2);
            const currentSteveCenterY = steveVerticalPositionRef.current
              + (window.innerWidth <= 560 ? 35 : 44);

            if (Math.hypot(currentSteveCenter - steveCenter, currentSteveCenterY - steveCenterY) <= 42) {
              triggerGameOver(DEATH_MESSAGES[selectedMob]);
            }
          }, duration);
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
      window.clearTimeout(arrowHitRef.current);
      skeletonShootingRef.current = false;
    };
  }, [selectedMob]);

  const selectMob = (mob) => {
    window.clearTimeout(explosionTimerRef.current);
    window.clearTimeout(skeletonScheduleRef.current);
    window.clearTimeout(skeletonAimRef.current);
    window.clearTimeout(skeletonFinishRef.current);
    window.clearTimeout(arrowCleanupRef.current);
    window.clearTimeout(arrowHitRef.current);
    window.clearTimeout(mainMeleeAttackRef.current);
    window.clearTimeout(endermanScheduleRef.current);
    window.clearTimeout(endermanMoveRef.current);
    window.clearTimeout(endermanFinishRef.current);
    window.clearTimeout(endermanWalkStartRef.current);
    window.clearTimeout(endermanWalkFinishRef.current);
    window.clearTimeout(enderDragonScheduleRef.current);
    window.clearTimeout(enderDragonCleanupRef.current);
    skeletonShootingRef.current = false;
    mainMeleeAttackingRef.current = false;
    endermanTeleportingRef.current = false;
    endermanWalkingRef.current = false;
    statusRef.current = 'walking';
    setStatus('walking');
    setIsSkeletonShooting(false);
    setIsMainMobAttacking(false);
    setIsEndermanTeleporting(false);
    setIsEndermanWalking(false);
    setEnderDragonFlight(null);
    setArrowShot(null);
    setDeathMessage(DEATH_MESSAGES.creeper);
    setSelectedMob(mob);
  };

  const toggleCharacterControl = () => {
    const nextManualControl = !manualControlRef.current;
    manualControlRef.current = nextManualControl;
    pressedKeysRef.current.clear();
    steveMovingRef.current = !nextManualControl;
    steveSprintingRef.current = false;
    steveJumpingRef.current = false;
    steveJumpVelocityRef.current = 0;
    steveJumpBaseYRef.current = steveVerticalPositionRef.current;
    setIsSteveMoving(!nextManualControl);
    setIsSteveSprinting(false);
    setIsSteveJumping(false);
    clearBonusThreats();
    setDeathMessage(DEATH_MESSAGES.creeper);

    if (nextManualControl) {
      const nextDiamond = createRandomDiamond(
        stevePositionRef.current,
        steveVerticalPositionRef.current,
      );
      diamondCountRef.current = 0;
      diamondRef.current = nextDiamond;
      setDiamondCount(0);
      setDiamond(nextDiamond);
    } else {
      diamondRef.current = null;
      setDiamond(null);
      steveVerticalPositionRef.current = 0;
      mascotRef.current?.style.setProperty('--steve-y', '0px');
    }

    setIsManualControl(nextManualControl);
  };

  const respawnCharacter = () => {
    window.clearTimeout(explosionTimerRef.current);
    window.clearTimeout(mainMeleeAttackRef.current);
    window.clearTimeout(arrowHitRef.current);
    pressedKeysRef.current.clear();
    cursorNearCreeperRef.current = false;

    const initialSteveX = Math.max(64, window.innerWidth - 64);
    stevePositionRef.current = initialSteveX;
    steveVerticalPositionRef.current = 0;
    creeperPositionRef.current = 12;
    creeperVerticalPositionRef.current = 0;
    steveDirectionRef.current = 'right';
    creeperDirectionRef.current = 'right';
    lastDirectionChangeRef.current = 0;
    statusRef.current = 'walking';
    steveJumpingRef.current = false;
    steveJumpVelocityRef.current = 0;
    steveJumpBaseYRef.current = 0;
    mainMeleeAttackingRef.current = false;
    clearBonusThreats();
    setDeathMessage(DEATH_MESSAGES.creeper);

    diamondCountRef.current = 0;
    setDiamondCount(0);
    if (manualControlRef.current) {
      const nextDiamond = createRandomDiamond(initialSteveX, 0);
      diamondRef.current = nextDiamond;
      setDiamond(nextDiamond);
    } else {
      diamondRef.current = null;
      setDiamond(null);
    }

    const shouldMoveAutomatically = !manualControlRef.current;
    steveMovingRef.current = shouldMoveAutomatically;
    steveSprintingRef.current = false;
    setIsSteveMoving(shouldMoveAutomatically);
    setIsSteveSprinting(false);
    setIsSteveJumping(false);
    setIsMainMobAttacking(false);
    setSteveDirection('right');
    setCreeperDirection('right');
    setStatus('walking');

    mascotRef.current?.style.setProperty('--steve-x', `${Math.round(initialSteveX)}px`);
    mascotRef.current?.style.setProperty('--steve-y', '0px');
    mascotRef.current?.style.setProperty('--creeper-x', '12px');
    mascotRef.current?.style.setProperty('--creeper-y', '0px');
  };

  return (
    <div
      ref={mascotRef}
      className={`creeper-mascot creeper-mascot--${status} creeper-mascot--mob-${selectedMob} creeper-mascot--facing-${creeperDirection} creeper-mascot--steve-${steveDirection}${isSkeletonShooting ? ' creeper-mascot--skeleton-shooting' : ''}${isMainMobAttacking ? ' creeper-mascot--main-attacking' : ''}${isEndermanTeleporting ? ' creeper-mascot--enderman-teleporting' : ''}${isEndermanWalking ? ' creeper-mascot--enderman-walking' : ''}${isManualControl ? ' creeper-mascot--manual' : ''}${isSteveMoving ? ' creeper-mascot--steve-moving' : ''}${isSteveSprinting ? ' creeper-mascot--steve-sprinting' : ''}${isSteveJumping ? ' creeper-mascot--steve-jumping' : ''}`}
      style={{ '--creeper-x': '12px', '--creeper-y': '0px', '--steve-x': `${Math.max(64, window.innerWidth - 64)}px`, '--steve-y': '0px' }}
    >
      {status === 'exploded' && (
        <section
          className="minecraft-game-over"
          role="dialog"
          aria-modal="true"
          aria-labelledby="game-over-title"
          aria-describedby="game-over-message"
        >
          <div className="minecraft-game-over__content">
            <h2 id="game-over-title">Game Over!</h2>
            <p className="minecraft-game-over__score">Diamantes: <strong>{diamondCount}</strong></p>
            <span className="minecraft-game-over__crosshair" aria-hidden="true">+</span>
            <p id="game-over-message" className="minecraft-game-over__message">
              {deathMessage}
            </p>
            <button
              ref={respawnButtonRef}
              className="minecraft-game-over__respawn"
              type="button"
              onClick={respawnCharacter}
            >
              Renascer
            </button>
          </div>
        </section>
      )}
      {enderDragonFlight && (
        <span
          className={`ender-dragon-flight ender-dragon-flight--${enderDragonFlight.direction}`}
          key={enderDragonFlight.id}
          style={{
            '--ender-dragon-duration': `${Math.round(enderDragonFlight.duration)}ms`,
            '--ender-dragon-top': `${Math.round(enderDragonFlight.top)}px`,
            '--ender-dragon-facing': enderDragonFlight.direction === 'right' ? 1 : -1,
          }}
          aria-hidden="true"
        >
          <span className="ender-dragon-flight__dragon">
            <EnderDragon />
          </span>
        </span>
      )}
      {isManualControl && diamond && (
        <>
          <output className="diamond-counter" aria-live="polite" aria-label={`${diamondCount} diamantes coletados e ${bonusMobs.length} ameaças adicionais`}>
            <DiamondIcon className="diamond-counter__icon" />
            <span aria-hidden="true">×</span>
            <strong aria-hidden="true">{diamondCount}</strong>
            <span className="diamond-counter__threats" aria-hidden="true">MOBS {bonusMobs.length}</span>
          </output>
          <span className="sr-only" role="status" aria-live="assertive">{mobAnnouncement}</span>
          <span
            key={diamond.id}
            className="minecraft-diamond"
            style={{
              '--diamond-x': `${Math.round(diamond.x)}px`,
              '--diamond-y': `${Math.round(diamond.y)}px`,
            }}
            aria-hidden="true"
          >
            <DiamondIcon />
          </span>
        </>
      )}
      <button
        className="character-control"
        type="button"
        aria-pressed={isManualControl}
        onClick={toggleCharacterControl}
      >
        <span className="character-control__keys" aria-hidden="true">WASD · CTRL · ESPAÇO</span>
        <span>{isManualControl ? 'Parar de controlar personagem' : 'Jogar'}</span>
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
        {selectedMob === 'slime' && (
          <svg className="creeper-mascot__sprite creeper-mascot__sprite--slime" viewBox="0 0 64 96" role="presentation" shapeRendering="crispEdges">
            <g className="slime-sprite__body">
              <path fill="#1d5728" d="M4 30h56v59H4z" />
              <path fill="#397f3e" d="M7 33h50v53H7z" />
              <path fill="#58ad50" d="M10 35h44v48H10z" />
              <path fill="#75c866" d="M12 37h36v39H12z" />
              <path fill="#94de7a" d="M13 38h25v11H13z" />
              <path fill="#b8ee9c" d="M14 39h13v6H14z" />
              <path fill="#4b9847" d="M48 35h6v48h-6zM10 76h44v7H10z" />
              <path fill="#32773a" d="M16 46h12v13H16zM38 46h12v13H38z" opacity=".72" />
              <path fill="#14371c" d="M18 48h10v12H18zM39 48h10v12H39z" />
              <path fill="#0d2514" d="M25 64h20v8H25zM20 61h8v7h-8z" />
              <path fill="#2b6b34" d="M28 64h14v4H28z" />
              <path fill="#82d36f" d="M11 55h5v17h-5zM46 65h7v10h-7zM31 38h7v5h-7z" opacity=".78" />
            </g>
          </svg>
        )}
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
      {bonusMobs.map((mob) => (
        <span
          key={mob.id}
          data-bonus-id={mob.id}
          className={`bonus-mob bonus-mob--${mob.mob} bonus-mob--${mob.status} bonus-mob--facing-${mob.direction}`}
          style={{
            '--bonus-mob-x': `${Math.round(mob.x)}px`,
            '--bonus-mob-y': `${Math.round(-mob.y)}px`,
          }}
          aria-hidden="true"
        >
          <span className="bonus-mob__sprite">
            <BonusMobSprite mob={mob.mob} />
          </span>
          <span className="bonus-mob__shadow" />
          {mob.mob === 'creeper' && mob.status === 'charging' && <span className="bonus-mob__fuse">!</span>}
        </span>
      ))}
      {bonusArrows.map((arrow) => (
        <span
          key={arrow.id}
          data-bonus-arrow-id={arrow.id}
          className="bonus-arrow"
          style={{
            '--bonus-arrow-x': `${Math.round(arrow.x)}px`,
            '--bonus-arrow-y': `${Math.round(-arrow.y)}px`,
            '--bonus-arrow-angle': `${arrow.angle}deg`,
          }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 40 12" shapeRendering="crispEdges">
            <path fill="#d9d9ce" d="M0 4h29v4H0z" />
            <path fill="#f5f4e8" d="M27 2h7v8h-7zM34 0h6v12h-6z" />
            <path fill="#765736" d="M0 1h4v10H0zM4 3h5v6H4z" />
          </svg>
        </span>
      ))}
      {arrowShot && (
        <span
          key={arrowShot.id}
          className={`skeleton-arrow skeleton-arrow--${arrowShot.direction}${arrowShot.mounted ? ' skeleton-arrow--mounted' : ''}`}
          style={{
            '--arrow-start-x': `${Math.round(arrowShot.startX)}px`,
            '--arrow-start-y': `${Math.round(arrowShot.startY)}px`,
            '--arrow-travel': `${Math.round(arrowShot.travel)}px`,
            '--arrow-travel-y': `${Math.round(arrowShot.travelY)}px`,
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
