import { useCallback, useEffect, useRef, useState } from 'react';
import About from './components/About';
import CoffeeModal from './components/CoffeeModal';
import Contact from './components/Contact';
import CreeperMascot from './components/CreeperMascot';
import Education from './components/Education';
import Experience from './components/Experience';
import Header from './components/Header';
import Hero from './components/Hero';
import InteractiveGrid from './components/InteractiveGrid';
import Icon from './components/Icon';
import Projects from './components/Projects';
import Skills from './components/Skills';

const THEMES = ['light', 'dark', 'nether', 'end'];

function MinecraftBat() {
  return (
    <svg viewBox="0 0 48 30" role="presentation" shapeRendering="crispEdges">
      <g className="bat-swarm__wing bat-swarm__wing--left">
        <path fill="#171219" d="M20 8h-6V5H5v3H1v14h5v-4h7v5h7z" />
        <path fill="#3b2a35" d="M17 10h-5V8H7v3H4v7h4v-3h5v4h4z" />
        <path fill="#55404d" d="M14 11h-4v3H7v2h6v3h2z" />
      </g>
      <g className="bat-swarm__wing bat-swarm__wing--right">
        <path fill="#171219" d="M28 8h6V5h9v3h4v14h-5v-4h-7v5h-7z" />
        <path fill="#3b2a35" d="M31 10h5V8h5v3h3v7h-4v-3h-5v4h-4z" />
        <path fill="#55404d" d="M34 11h4v3h3v2h-6v3h-2z" />
      </g>
      <path fill="#171219" d="M17 5h4V1h4v4h3V1h4v6h3v15h-5v6H18v-6h-5V7h4z" />
      <path fill="#4a3440" d="M18 7h12v15H18z" />
      <path fill="#684a55" d="M20 8h8v8h-8z" />
      <path fill="#e94855" d="M20 10h3v2h-3zM26 10h3v2h-3z" />
      <path fill="#21171d" d="M22 15h5v3h-5zM18 22h4v6h-4zM27 22h4v6h-4z" />
    </svg>
  );
}

function MinecraftParrot({ variant = 0 }) {
  const palettes = [
    {
      crown: '#00a93a', crownLight: '#00d358', crest: '#087a28', crestTip: '#06617f',
      body: '#b18a00', bodyLight: '#d8ad00', wing: '#087493', wingLight: '#0fbcea',
      wingDark: '#07586f', tail: '#087590', tailTip: '#084b61', cheek: '#aeb7b6',
    },
    {
      crown: '#e3c620', crownLight: '#ffe342', crest: '#8f8020', crestTip: '#9f8700',
      body: '#55575a', bodyLight: '#747679', wing: '#626467', wingLight: '#939598',
      wingDark: '#3c3e40', tail: '#55575a', tailTip: '#333538', cheek: '#a5a6a4',
    },
    {
      crown: '#d40707', crownLight: '#f10b09', crest: '#9c0000', crestTip: '#8a0000',
      body: '#a90608', bodyLight: '#ce1010', wing: '#cf0a0a', wingLight: '#f51212',
      wingDark: '#821004', tail: '#2457a6', tailTip: '#083a8a', cheek: '#b99b91', accent: '#aba300',
    },
    {
      crown: '#1526bf', crownLight: '#1e37e2', crest: '#112284', crestTip: '#0b195d',
      body: '#101f8e', bodyLight: '#182fb8', wing: '#132694', wingLight: '#203dc2',
      wingDark: '#0a175e', tail: '#132276', tailTip: '#09144e', cheek: '#aaa99f', accent: '#9c9b00',
    },
    {
      crown: '#68ad00', crownLight: '#85dc00', crest: '#3e7000', crestTip: '#315d00',
      body: '#426d00', bodyLight: '#568c00', wing: '#477600', wingLight: '#639e00',
      wingDark: '#315500', tail: '#3e6700', tailTip: '#294900', cheek: '#aeafa6',
    },
  ];
  const palette = palettes[variant % palettes.length];

  return (
    <svg viewBox="0 0 64 52" role="presentation" shapeRendering="crispEdges">
      <g className="minecraft-parrot__crest">
        <path fill={palette.crest} d="M17 1h5v10h-3v8h-5v-8h3z" />
        <path fill={palette.crestTip} d="M17 1h5v7h-5z" />
        <path fill={palette.crest} d="M27 0h5v10h-3v8h-5v-8h3z" />
        <path fill={palette.crestTip} d="M27 0h5v7h-5z" />
      </g>
      <g className="bat-swarm__wing bat-swarm__wing--left">
        <path fill={palette.wingDark} d="M27 22h12v4h7v5h5v8h-7v-4h-8v-5h-9z" />
        <path fill={palette.wing} d="M29 22h9v4h7v5h4v4h-6v-3h-8v-5h-6z" />
      </g>
      <path fill={palette.tailTip} d="M42 35h11v3h9v6h-11v-3H40z" />
      <path fill={palette.tail} d="M41 33h12v4h8v4h-10v-2H40z" />
      {palette.accent && <path fill={palette.accent} d="M45 34h7v4h7v3h-8v-2h-8z" />}
      <path fill={palette.body} d="M17 22h22v4h7v8h5v7h-7v5h-8v4H24v-5h-5v-8h-4V27h2z" />
      <path fill={palette.bodyLight} d="M17 24h11v4h5v6h5v10h-5v4h-8v-5h-5v-8h-3z" />
      <path fill={palette.crown} d="M8 12h29v15H8z" />
      <path fill={palette.crownLight} d="M8 12h20v5H8z" />
      <path fill={palette.wingDark} d="M32 12h5v15h-5z" />
      <path fill="#090b0c" d="M10 17h13v12H10z" />
      <path fill={palette.cheek} d="M23 17h9v12h-9z" />
      <path fill="#f2f1e9" d="M24 18h7v6h-7z" />
      <path fill="#111315" d="M27 18h4v5h-4z" />
      <path fill="#e4bb08" d="M5 24h7v3h6v5h-8v-3H6z" />
      <path fill="#76510b" d="M9 29h8v4h-6v-2H9z" />
      <g className="bat-swarm__wing bat-swarm__wing--right">
        <path fill={palette.wingDark} d="M29 23h14v4h5v12h-5v7h-8v-4h-6z" />
        <path fill={palette.wing} d="M30 22h12v5h5v11h-5v6h-6v-4h-6z" />
        <path fill={palette.wingLight} d="M30 22h5v15h-5zM35 25h5v14h-5z" />
        {palette.accent && <path fill={palette.accent} d="M40 28h6v8h-6z" />}
      </g>
    </svg>
  );
}

const clampFlightValue = (value, min = 7, max = 90) => Math.max(min, Math.min(max, value));

function createFlightRoute(kind) {
  const movingRight = Math.random() >= 0.5;
  const startY = 14 + Math.random() * 66;
  const endY = clampFlightValue(startY + (Math.random() - 0.5) * (kind === 'bat' ? 42 : 28));
  const deviation = kind === 'bat' ? 19 : 10;
  const progressX = [
    -12,
    14 + Math.random() * 9,
    40 + Math.random() * 18,
    71 + Math.random() * 13,
    112,
  ];
  const x = movingRight ? progressX : progressX.map((position) => 100 - position);
  const y = [
    startY,
    clampFlightValue(startY + (endY - startY) * 0.22 + (Math.random() - 0.5) * deviation),
    clampFlightValue(startY + (endY - startY) * 0.5 + (Math.random() - 0.5) * deviation),
    clampFlightValue(startY + (endY - startY) * 0.78 + (Math.random() - 0.5) * deviation),
    endY,
  ];
  const rotationScale = kind === 'bat' ? 0.62 : 0.38;
  const rotationLimit = kind === 'bat' ? 14 : 8;
  const rotations = y.map((position, index) => {
    const nextPosition = y[Math.min(index + 1, y.length - 1)];
    return Math.max(-rotationLimit, Math.min(rotationLimit, (nextPosition - position) * rotationScale));
  });

  return {
    routeX: x,
    routeY: y,
    rotations,
    facing: movingRight ? -1 : 1,
  };
}

function App() {
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = useState(false);
  const [themeTransition, setThemeTransition] = useState(null);
  const [batSwarm, setBatSwarm] = useState(null);
  const transitionTimeoutRef = useRef(0);
  const batTimeoutRef = useRef(0);
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('mateus-dev-theme');
    if (THEMES.includes(savedTheme)) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark';
    window.localStorage.setItem('mateus-dev-theme', theme);
  }, [theme]);

  useEffect(() => () => {
    window.clearTimeout(transitionTimeoutRef.current);
    window.clearTimeout(batTimeoutRef.current);
  }, []);

  const openCoffeeModal = useCallback(() => {
    setIsCoffeeModalOpen(true);
  }, []);

  const closeCoffeeModal = useCallback(() => {
    setIsCoffeeModalOpen(false);
  }, []);

  const changeTheme = useCallback((nextTheme) => {
    if (!THEMES.includes(nextTheme) || nextTheme === theme) return;

    window.clearTimeout(transitionTimeoutRef.current);
    window.clearTimeout(batTimeoutRef.current);
    setThemeTransition({
      kind: nextTheme === 'light' ? 'sun' : nextTheme === 'dark' ? 'moon' : nextTheme,
      id: Date.now(),
    });

    const flockKind = nextTheme === 'light' ? 'parrot' : nextTheme === 'dark' ? 'bat' : null;
    const flyers = flockKind ? Array.from({ length: 9 }, (_, index) => ({
        id: `${Date.now()}-${index}`,
        ...createFlightRoute(flockKind),
        size: flockKind === 'parrot' ? 48 + Math.random() * 34 : 34 + Math.random() * 28,
        delay: Math.random() * 680,
        duration: flockKind === 'parrot'
          ? 4200 + Math.random() * 1800
          : 3000 + Math.random() * 2400,
        flapSpeed: flockKind === 'parrot'
          ? 210 + Math.random() * 100
          : 180 + Math.random() * 80,
        variant: index % 5,
    })) : [];

    if (flockKind) {
      const swarmId = Date.now();
      setBatSwarm({ id: swarmId, kind: flockKind, bats: flyers });
      const swarmLifetime = Math.max(...flyers.map((flyer) => flyer.delay + flyer.duration)) + 120;
      batTimeoutRef.current = window.setTimeout(() => setBatSwarm(null), swarmLifetime);
    } else {
      setBatSwarm(null);
    }

    setTheme(nextTheme);
    transitionTimeoutRef.current = window.setTimeout(() => setThemeTransition(null), 1300);
  }, [theme]);

  return (
    <>
      <InteractiveGrid theme={theme} />
      {themeTransition && (
        <div className={`theme-rise theme-rise--${themeTransition.kind}`} key={themeTransition.id} aria-hidden="true">
          <div className="theme-rise__orb">
            <Icon name={themeTransition.kind === 'nether' ? 'flame' : themeTransition.kind} size={76} />
          </div>
        </div>
      )}
      {batSwarm && (
        <div className={`bat-swarm bat-swarm--${batSwarm.kind}`} key={batSwarm.id} aria-hidden="true">
          {batSwarm.bats.map((bat) => (
            <span
              className="bat-swarm__flyer"
              key={bat.id}
              style={{
                '--flight-x-0': `${bat.routeX[0]}vw`,
                '--flight-x-1': `${bat.routeX[1]}vw`,
                '--flight-x-2': `${bat.routeX[2]}vw`,
                '--flight-x-3': `${bat.routeX[3]}vw`,
                '--flight-x-4': `${bat.routeX[4]}vw`,
                '--flight-y-0': `${bat.routeY[0]}vh`,
                '--flight-y-1': `${bat.routeY[1]}vh`,
                '--flight-y-2': `${bat.routeY[2]}vh`,
                '--flight-y-3': `${bat.routeY[3]}vh`,
                '--flight-y-4': `${bat.routeY[4]}vh`,
                '--flight-rotate-0': `${bat.rotations[0]}deg`,
                '--flight-rotate-1': `${bat.rotations[1]}deg`,
                '--flight-rotate-2': `${bat.rotations[2]}deg`,
                '--flight-rotate-3': `${bat.rotations[3]}deg`,
                '--flight-rotate-4': `${bat.rotations[4]}deg`,
                '--bat-size': `${bat.size}px`,
                '--bat-delay': `${bat.delay}ms`,
                '--bat-duration': `${bat.duration}ms`,
                '--bat-facing': bat.facing,
                '--bat-flap-speed': `${bat.flapSpeed}ms`,
              }}
            >
              <span className={`bat-swarm__bat bat-swarm__bat--${batSwarm.kind}`}>
                {batSwarm.kind === 'bat'
                  ? <MinecraftBat />
                  : <MinecraftParrot variant={bat.variant} />}
              </span>
            </span>
          ))}
        </div>
      )}
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header onOpenCoffeeModal={openCoffeeModal} theme={theme} onThemeChange={changeTheme} />
      <main className="page-shell" id="conteudo">
        <Hero onOpenCoffeeModal={openCoffeeModal} />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <CreeperMascot />
      <CoffeeModal isOpen={isCoffeeModalOpen} onClose={closeCoffeeModal} />
    </>
  );
}

export default App;
