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
    { body: '#d93636', light: '#f15a47', wing: '#2765bd', wingLight: '#52a8dd', tail: '#21549b' },
    { body: '#258f45', light: '#47bd62', wing: '#e5c12d', wingLight: '#fff06a', tail: '#176f3a' },
    { body: '#2469b2', light: '#43a2df', wing: '#e24439', wingLight: '#ff7660', tail: '#1d4b91' },
  ];
  const palette = palettes[variant % palettes.length];

  return (
    <svg viewBox="0 0 48 38" role="presentation" shapeRendering="crispEdges">
      <g className="bat-swarm__wing bat-swarm__wing--left">
        <path fill="#152b3a" d="M19 11h-6V7H5v4H1v14h5v-4h7v5h6z" />
        <path fill={palette.wing} d="M16 12h-5V10H7v3H4v8h4v-3h5v4h3z" />
        <path fill={palette.wingLight} d="M13 13H9v3H6v2h7v3h2z" />
      </g>
      <g className="bat-swarm__wing bat-swarm__wing--right">
        <path fill="#152b3a" d="M29 11h6V7h8v4h4v14h-5v-4h-7v5h-6z" />
        <path fill={palette.wing} d="M32 12h5V10h4v3h3v8h-4v-3h-5v4h-3z" />
        <path fill={palette.wingLight} d="M35 13h4v3h3v2h-7v3h-2z" />
      </g>
      <path fill="#152b3a" d="M17 4h14v5h4v16h-6v7h-3v6h-5v-6h-3v-7h-5V9h4z" />
      <path fill={palette.body} d="M18 7h12v18H18z" />
      <path fill={palette.light} d="M20 8h8v10h-8z" />
      <path fill="#f7f3df" d="M20 9h4v4h-4zM27 9h3v4h-3z" />
      <path fill="#20252a" d="M22 10h2v3h-2zM27 10h2v3h-2z" />
      <path fill="#f2c63e" d="M21 14h9v4h-9z" />
      <path fill="#5b3520" d="M24 18h5v3h-5z" />
      <path fill={palette.tail} d="M18 24h5v9h-5zM23 25h5v13h-5zM28 24h4v9h-4z" />
    </svg>
  );
}

function App() {
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = useState(false);
  const [themeTransition, setThemeTransition] = useState(null);
  const [batSwarm, setBatSwarm] = useState(null);
  const transitionTimeoutRef = useRef(0);
  const batTimeoutRef = useRef(0);
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('mateus-dev-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
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

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    window.clearTimeout(transitionTimeoutRef.current);
    window.clearTimeout(batTimeoutRef.current);
    setThemeTransition({ kind: nextTheme === 'light' ? 'sun' : 'moon', id: Date.now() });

    const flockKind = nextTheme === 'dark' ? 'bat' : 'parrot';
    const bats = Array.from({ length: 9 }, (_, index) => ({
        id: `${Date.now()}-${index}`,
        startX: 4 + Math.random() * 88,
        middleX: 4 + Math.random() * 88,
        endX: -8 + Math.random() * 116,
        size: 34 + Math.random() * 28,
        delay: Math.random() * 480,
        duration: 3000 + Math.random() * 3000,
        facing: Math.random() > 0.5 ? 1 : -1,
        flapSpeed: 180 + Math.random() * 80,
        variant: index % 3,
    }));

    const swarmId = Date.now();
    setBatSwarm({ id: swarmId, kind: flockKind, bats });
    const swarmLifetime = Math.max(...bats.map((bat) => bat.delay + bat.duration)) + 120;
    batTimeoutRef.current = window.setTimeout(() => setBatSwarm(null), swarmLifetime);

    setTheme(nextTheme);
    transitionTimeoutRef.current = window.setTimeout(() => setThemeTransition(null), 1300);
  }, [theme]);

  return (
    <>
      <InteractiveGrid />
      {themeTransition && (
        <div className={`theme-rise theme-rise--${themeTransition.kind}`} key={themeTransition.id} aria-hidden="true">
          <div className="theme-rise__orb">
            <Icon name={themeTransition.kind} size={76} />
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
                '--bat-start-x': `${bat.startX}vw`,
                '--bat-middle-x': `${bat.middleX}vw`,
                '--bat-end-x': `${bat.endX}vw`,
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
      <Header onOpenCoffeeModal={openCoffeeModal} theme={theme} onToggleTheme={toggleTheme} />
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
