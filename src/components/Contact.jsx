import { profile } from '../data/profile';
import Icon from './Icon';

function SocialLinks() {
  return (
    <div className="social-links" aria-label="Links sociais">
      <a href={profile.contact.github} target="_blank" rel="noreferrer" aria-label="GitHub">
        <Icon name="github" />
      </a>
      <a href={profile.contact.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
        <Icon name="linkedin" />
      </a>
      <a href={`mailto:${profile.contact.email}`} aria-label="E-mail">
        <Icon name="mail" />
      </a>
      <a href={profile.contact.whatsapp} aria-label="WhatsApp">
        <Icon name="whatsapp" />
      </a>
    </div>
  );
}

function Contact() {
  return (
    <section className="contact-section section" id="contato">
      <div className="panel contact-strip">
        <div>
          <h2>Vamos transformar sua ideia em um projeto incrível?</h2>
          <p>Tenho as ferramentas e a experiência para tirar seu projeto do papel e gerar resultados reais para o seu negócio.</p>
        </div>
        <div className="contact-actions">
          <a className="primary-button" href={`mailto:${profile.contact.email}`}>
            <Icon name="send" size={18} />
            Fale comigo
          </a>
          <a className="secondary-button" href={profile.contact.cv}>
            <Icon name="download" size={18} />
            Baixar CV
          </a>
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}

export default Contact;
