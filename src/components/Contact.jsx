import { profile } from '../data/profile';
import Icon from './Icon';

function SocialLinks() {
  const links = [
    { href: profile.contact.github, label: 'GitHub', icon: 'github', external: true },
    { href: profile.contact.linkedin, label: 'LinkedIn', icon: 'linkedin', external: true },
    { href: `mailto:${profile.contact.email}`, label: 'E-mail', icon: 'mail' },
    { href: profile.contact.whatsapp, label: 'WhatsApp', icon: 'whatsapp', external: true },
  ].filter((link) => link.href && link.href !== '#');

  return (
    <div className="social-links" aria-label="Links sociais">
      {links.map((link) => (
        <a
          href={link.href}
          key={link.label}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noreferrer' : undefined}
          aria-label={link.label}
        >
          <Icon name={link.icon} />
        </a>
      ))}
    </div>
  );
}

function Contact() {
  return (
    <section className="contact-section section" id="contato">
      <div className="contact-strip">
        <div>
          <span className="section-kicker">TEM UM PROJETO EM MENTE?</span>
          <h2>Vamos construir algo relevante juntos.</h2>
          <p>Conte o que você precisa. Eu respondo com clareza sobre possibilidades, próximos passos e a melhor rota técnica.</p>
        </div>
        <div className="contact-actions">
          <a className="primary-button" href={`mailto:${profile.contact.email}`}>
            <Icon name="send" size={18} />
            Fale comigo
          </a>
          {profile.contact.cv && profile.contact.cv !== '#' ? (
            <a className="secondary-button" href={profile.contact.cv}>
              <Icon name="download" size={18} />
              Baixar CV
            </a>
          ) : null}
          <SocialLinks />
        </div>
      </div>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Mateus Camargo Rodrigues</span>
        <span>Desenvolvido com estratégia, design e código.</span>
      </footer>
    </section>
  );
}

export default Contact;
