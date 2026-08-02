import { useEffect, useRef, useState } from 'react';

const EXPLOSION_DELAY = 500;
const EXPLOSION_RANGE = 20;
const CREEPER_WIDTH = 76;
const STEVE_WIDTH = 48;
const CREEPER_SPEED = 105;
const STEVE_SPEED = 82;
const STEVE_ESCAPE_SPEED = 148;
const STEVE_DANGER_RANGE = 180;
const DIRECTION_LOCK_TIME = 550;
const SKELETON_MIN_SHOT_INTERVAL = 5000;
const SKELETON_MAX_SHOT_INTERVAL = 10000;
const SKELETON_AIM_TIME = 480;
const SKELETON_SHOT_TIME = 1050;
const MOBS = [
  { id: 'creeper', label: 'Creeper' },
  { id: 'skeleton', label: 'Esqueleto' },
  { id: 'zombie', label: 'Zumbi' },
];

function MobDockIcon({ mob }) {
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
  const [status, setStatus] = useState('walking');
  const [steveDirection, setSteveDirection] = useState('right');
  const [creeperDirection, setCreeperDirection] = useState('right');
  const [isSkeletonShooting, setIsSkeletonShooting] = useState(false);
  const [arrowShot, setArrowShot] = useState(null);
  const mascotRef = useRef(null);
  const explosionTimerRef = useRef(0);
  const skeletonScheduleRef = useRef(0);
  const skeletonAimRef = useRef(0);
  const skeletonFinishRef = useRef(0);
  const arrowCleanupRef = useRef(0);
  const statusRef = useRef('walking');
  const skeletonShootingRef = useRef(false);
  const stevePositionRef = useRef(Math.max(64, window.innerWidth - 64));
  const steveDirectionRef = useRef(steveDirection);
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
        const gap = currentCreeperX <= steveX
          ? Math.max(0, steveX - creeperRight)
          : Math.max(0, currentCreeperX - steveRight);

        if (selectedMob === 'creeper') {
          if (gap <= EXPLOSION_RANGE && statusRef.current === 'walking') startCharging();
          if (gap > EXPLOSION_RANGE && statusRef.current !== 'walking') cancelExplosion();
        } else if (statusRef.current !== 'walking') {
          cancelExplosion();
        }

        if (gap <= STEVE_DANGER_RANGE && time - lastDirectionChangeRef.current >= DIRECTION_LOCK_TIME) {
          const creeperCenter = currentCreeperX + (CREEPER_WIDTH / 2);
          const steveCenter = steveX + (STEVE_WIDTH / 2);
          const escapeDirection = steveCenter >= creeperCenter ? 'right' : 'left';

          if (escapeDirection !== steveDirectionRef.current) {
            steveDirectionRef.current = escapeDirection;
            lastDirectionChangeRef.current = time;
            setSteveDirection(escapeDirection);
          }
        }

        const steveSpeed = statusRef.current === 'walking' ? STEVE_SPEED : STEVE_ESCAPE_SPEED;
        let nextSteveX = steveX + (steveDirectionRef.current === 'right' ? 1 : -1) * steveSpeed * elapsed;

        if (nextSteveX > window.innerWidth) nextSteveX = -STEVE_WIDTH;
        if (nextSteveX < -STEVE_WIDTH) nextSteveX = window.innerWidth;

        stevePositionRef.current = nextSteveX;

        if (statusRef.current === 'walking' && !skeletonShootingRef.current) {
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
        mascotRef.current?.style.setProperty('--creeper-x', `${Math.round(creeperPositionRef.current)}px`);
      }

      animationFrame = window.requestAnimationFrame(followSteve);
    };

    animationFrame = window.requestAnimationFrame(followSteve);

    return () => {
      window.clearTimeout(explosionTimerRef.current);
      window.cancelAnimationFrame(animationFrame);
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

    if (selectedMob !== 'skeleton') return undefined;

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

          setArrowShot({ id: Date.now(), startX, travel, duration, direction });
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
    skeletonShootingRef.current = false;
    statusRef.current = 'walking';
    setStatus('walking');
    setIsSkeletonShooting(false);
    setArrowShot(null);
    setSelectedMob(mob);
  };

  return (
    <div
      ref={mascotRef}
      className={`creeper-mascot creeper-mascot--${status} creeper-mascot--mob-${selectedMob} creeper-mascot--facing-${creeperDirection} creeper-mascot--steve-${steveDirection}${isSkeletonShooting ? ' creeper-mascot--skeleton-shooting' : ''}`}
      style={{ '--creeper-x': '12px', '--steve-x': `${Math.max(64, window.innerWidth - 64)}px` }}
    >
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
          <svg className="creeper-mascot__steve-sprite" viewBox="0 0 48 88" role="presentation" shapeRendering="crispEdges">
            <g className="creeper-mascot__steve-head">
              <path fill="#473025" d="M7 0h34v33H7z" />
              <path fill="#704637" d="M10 4h28v26H10z" />
              <path fill="#c27c5c" d="M13 9h22v18H13z" />
              <path fill="#e0a078" d="M15 10h18v14H15z" />
              <path fill="#5a392c" d="M10 4h28v7H10zM10 11h5v11h-5zM33 11h5v11h-5z" />
              <path fill="#fff4e8" d="M15 14h7v5h-7zM27 14h6v5h-6z" />
              <path fill="#4da4cc" d="M19 14h3v5h-3zM27 14h3v5h-3z" />
              <path fill="#754535" d="M19 23h11v4H19zM22 20h5v3h-5z" />
              <path fill="#9a5e48" d="M13 20h4v7h-4zM31 20h4v7h-4z" />
            </g>
            <path fill="#236f7a" d="M11 33h26v28H11z" />
            <path fill="#35b5b6" d="M14 34h20v25H14z" />
            <path fill="#58c9c4" d="M14 34h7v25h-7z" />
            <path fill="#1b5966" d="M31 34h3v25h-3zM14 56h20v3H14z" />
            <g className="creeper-mascot__steve-arm creeper-mascot__steve-arm--back">
              <path fill="#8c573f" d="M35 35h10v29H35z" />
              <path fill="#c17d5d" d="M35 36h7v24h-7z" />
              <path fill="#754535" d="M35 60h10v5H35z" />
            </g>
            <g className="creeper-mascot__steve-arm creeper-mascot__steve-arm--front">
              <path fill="#8c573f" d="M3 35h10v29H3z" />
              <path fill="#d08a66" d="M6 36h7v24H6z" />
              <path fill="#754535" d="M3 60h10v5H3z" />
            </g>
            <g className="creeper-mascot__steve-leg creeper-mascot__steve-leg--back">
              <path fill="#233578" d="M25 59h12v25H25z" />
              <path fill="#3550ae" d="M25 60h8v21h-8z" />
              <path fill="#17204a" d="M25 81h12v7H25z" />
            </g>
            <g className="creeper-mascot__steve-leg creeper-mascot__steve-leg--front">
              <path fill="#233578" d="M11 59h12v25H11z" />
              <path fill="#4767c2" d="M14 60h8v21h-8z" />
              <path fill="#17204a" d="M11 81h12v7H11z" />
            </g>
          </svg>
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
        <span className="creeper-mascot__shadow" />
        <span className="creeper-mascot__burst">
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
        </span>
      </div>
      {arrowShot && (
        <span
          key={arrowShot.id}
          className={`skeleton-arrow skeleton-arrow--${arrowShot.direction}`}
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
