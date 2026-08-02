import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile';
import Icon from './Icon';

const navItems = [
  ['Início', '#inicio'],
  ['Sobre mim', '#sobre'],
  ['Experiência', '#experiencia'],
  ['Projetos', '#projetos'],
  ['Skills', '#skills'],
  ['Formação', '#formacao'],
  ['Contato', '#contato'],
];

const themeOptions = [
  { id: 'light', label: 'Claro', icon: 'sun' },
  { id: 'dark', label: 'Escuro', icon: 'moon' },
  { id: 'nether', label: 'Nether', icon: 'flame' },
  { id: 'end', label: 'The End', icon: 'end' },
];

function Header({ onOpenCoffeeModal, theme, onThemeChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeSelectorRef = useRef(null);
  const activeTheme = themeOptions.find((option) => option.id === theme) || themeOptions[0];

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isThemeMenuOpen) return undefined;

    const closeThemeMenu = (event) => {
      if (event.type === 'keydown' && event.key !== 'Escape') return;
      if (event.type === 'pointerdown' && themeSelectorRef.current?.contains(event.target)) return;
      setIsThemeMenuOpen(false);
    };

    window.addEventListener('pointerdown', closeThemeMenu);
    window.addEventListener('keydown', closeThemeMenu);
    return () => {
      window.removeEventListener('pointerdown', closeThemeMenu);
      window.removeEventListener('keydown', closeThemeMenu);
    };
  }, [isThemeMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Ir para o início" onClick={closeMenu}>
        <span className="brand-mark">M</span>
        <span>
          <strong>Mateus Camargo</strong>
          <small>Full Stack Developer</small>
        </span>
      </a>

      <nav className={`site-nav ${isMenuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
        <div className="mobile-menu-intro" aria-hidden="true">
          <span>MENU PRINCIPAL</span>
          <strong>Onde você quer ir?</strong>
        </div>
        {navItems.map(([label, href], index) => (
          <a key={href} href={href} onClick={closeMenu}>
            <span className="nav-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span>{label}</span>
            <Icon name="arrow" size={18} className="nav-arrow" />
          </a>
        ))}
        <button type="button" onClick={() => { closeMenu(); onOpenCoffeeModal(); }}>
          <span className="nav-index" aria-hidden="true">08</span>
          <span>Me pague um café</span>
          <Icon name="arrow" size={18} className="nav-arrow" />
        </button>
      </nav>

      <div className="header-actions">
        <div className="theme-selector" ref={themeSelectorRef}>
          <button
            className="theme-toggle"
            type="button"
            aria-label={`Tema atual: ${activeTheme.label}. Escolher tema`}
            aria-haspopup="true"
            aria-expanded={isThemeMenuOpen}
            onClick={() => setIsThemeMenuOpen((value) => !value)}
          >
            <Icon name={activeTheme.icon} size={19} />
            <span>{activeTheme.label}</span>
            <Icon name="chevronDown" size={14} className="theme-toggle__chevron" />
          </button>
          {isThemeMenuOpen && (
            <div className="theme-menu" role="group" aria-label="Escolher tema do site">
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={theme === option.id}
                  onClick={() => {
                    onThemeChange(option.id);
                    setIsThemeMenuOpen(false);
                  }}
                >
                  <Icon name={option.icon} size={18} />
                  <span>{option.label}</span>
                  <span className="theme-menu__check" aria-hidden="true">{theme === option.id ? '■' : ''}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <a className="header-cta" href={`mailto:${profile.contact.email}`}>
          Vamos conversar
          <Icon name="arrow" size={17} />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          <Icon name={isMenuOpen ? 'close' : 'menu'} />
        </button>
      </div>
    </header>
  );
}

export default Header;
