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

function Header({ onOpenCoffeeModal }) {
  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Ir para o início">
        <span className="brand-mark">M</span>
        <span>
          <strong>{profile.name}</strong>
          <small>{profile.role}</small>
        </span>
      </a>

      <nav className="site-nav" aria-label="Navegação principal">
        {navItems.map(([label, href]) => (
          <a key={href} href={href}>{label}</a>
        ))}
        <button type="button" onClick={onOpenCoffeeModal}>
          Me pague um café
        </button>
      </nav>

      <div className="header-actions">
        <button className="header-coffee" type="button" onClick={onOpenCoffeeModal}>
          Café
        </button>
        <a className="header-cta" href={`mailto:${profile.contact.email}`}>
          <Icon name="send" size={18} />
          Fale comigo
        </a>
      </div>
    </header>
  );
}

export default Header;
