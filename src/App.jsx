import { useCallback, useState } from 'react';
import About from './components/About';
import CoffeeModal from './components/CoffeeModal';
import Contact from './components/Contact';
import Education from './components/Education';
import Experience from './components/Experience';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';

function App() {
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = useState(false);

  const openCoffeeModal = useCallback(() => {
    setIsCoffeeModalOpen(true);
  }, []);

  const closeCoffeeModal = useCallback(() => {
    setIsCoffeeModalOpen(false);
  }, []);

  return (
    <>
      <Header onOpenCoffeeModal={openCoffeeModal} />
      <main className="page-shell">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>
      <CoffeeModal isOpen={isCoffeeModalOpen} onClose={closeCoffeeModal} />
    </>
  );
}

export default App;
