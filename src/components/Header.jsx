import { useEffect, useState } from 'react';
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

function Header({ onOpenCoffeeModal, theme, onToggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [isMenuOpen]);

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
        <button
          className="theme-toggle"
          type="button"
          aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
          onClick={onToggleTheme}
        >
          <Icon name={theme === 'light' ? 'moon' : 'sun'} size={19} />
          <span>{theme === 'light' ? 'Escuro' : 'Claro'}</span>
        </button>
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
