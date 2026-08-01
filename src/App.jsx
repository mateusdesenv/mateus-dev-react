import { useCallback, useEffect, useState } from 'react';
import About from './components/About';
import CoffeeModal from './components/CoffeeModal';
import Contact from './components/Contact';
import Education from './components/Education';
import Experience from './components/Experience';
import Header from './components/Header';
import Hero from './components/Hero';
import InteractiveGrid from './components/InteractiveGrid';
import Projects from './components/Projects';
import Skills from './components/Skills';

function App() {
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = useState(false);
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

  const openCoffeeModal = useCallback(() => {
    setIsCoffeeModalOpen(true);
  }, []);

  const closeCoffeeModal = useCallback(() => {
    setIsCoffeeModalOpen(false);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <>
      <InteractiveGrid />
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
      <CoffeeModal isOpen={isCoffeeModalOpen} onClose={closeCoffeeModal} />
    </>
  );
}

export default App;
