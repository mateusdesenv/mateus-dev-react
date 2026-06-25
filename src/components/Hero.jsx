import { metrics, profile, technologies } from '../data/profile';
import Icon from './Icon';

function Hero() {
  return (
    <section className="hero section" id="inicio">
      <div className="hero-photo-card panel">
        <div className="hero-photo-glow" />
        <img src={profile.photo} alt="Mateus Camargo Rodrigues trabalhando no notebook" />
        <div className="availability-badge">
          <span />
          {profile.availability}
        </div>
      </div>

      <div className="hero-content">
        <p className="eyebrow">{profile.eyebrow}</p>
        <h1>{profile.name}</h1>
        <p className="hero-description">{profile.heroText}</p>
        <div className="tech-cloud" aria-label="Tecnologias principais">
          {technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric) => (
          <article className="metric-card panel" key={metric.value}>
            <Icon name={metric.icon} />
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
