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

function App() {
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = useState(false);
  const [themeTransition, setThemeTransition] = useState(null);
  const transitionTimeoutRef = useRef(0);
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

  useEffect(() => () => window.clearTimeout(transitionTimeoutRef.current), []);

  const openCoffeeModal = useCallback(() => {
    setIsCoffeeModalOpen(true);
  }, []);

  const closeCoffeeModal = useCallback(() => {
    setIsCoffeeModalOpen(false);
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    window.clearTimeout(transitionTimeoutRef.current);
    setThemeTransition({ kind: nextTheme === 'light' ? 'sun' : 'moon', id: Date.now() });
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
