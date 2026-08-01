import { metrics, profile, technologies } from '../data/profile';
import Icon from './Icon';

function Hero({ onOpenCoffeeModal }) {
  return (
    <section className="hero section" id="inicio">
      <div className="hero-content">
        <div className="availability-badge">
          <span aria-hidden="true" />
          {profile.availability}
        </div>
        <p className="eyebrow">{profile.eyebrow}</p>
        <h1>Transformo ideias complexas em <em>produtos digitais</em> simples.</h1>
        <p className="hero-description">{profile.heroText}</p>
        <div className="hero-actions">
          <a className="primary-button" href="#projetos">
            Ver projetos
            <Icon name="arrow" size={18} />
          </a>
          <a className="secondary-button" href={`mailto:${profile.contact.email}`}>
            Fale comigo
          </a>
          <button className="text-button" type="button" onClick={onOpenCoffeeModal}>
            Me pague um café
          </button>
        </div>
        <div className="tech-cloud" aria-label="Tecnologias principais">
          {technologies.slice(0, 7).map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-photo-card">
          <div className="hero-photo-glow" />
          <img
            src={profile.photo}
            alt="Mateus Camargo Rodrigues trabalhando no notebook"
            width="720"
            height="900"
          />
        </div>
        <div className="hero-code-card" aria-hidden="true">
          <span>mateus.dev</span>
          <strong>buildProducts()</strong>
          <small>strategy · design · code</small>
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <article className="metric-card" key={metric.value}>
            <span className="metric-index">0{index + 1}</span>
            <div>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Hero;
