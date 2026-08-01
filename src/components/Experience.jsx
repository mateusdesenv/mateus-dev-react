import { experiences } from '../data/profile';
import Icon from './Icon';

function Experience() {
  return (
    <section className="section-block" id="experiencia">
      <div className="section-heading section-heading--row">
        <div>
          <span className="section-kicker">02 · TRAJETÓRIA</span>
          <h2>Experiência que conecta código, pessoas e resultados.</h2>
        </div>
        <p>Mais de sete anos construindo produtos digitais em ambientes de alta responsabilidade.</p>
      </div>

      <div className="experience-grid">
        {experiences.map((experience) => (
          <article
            className={`experience-card experience-card--${experience.variant}`}
            key={experience.company}
          >
            <div className={`company-mark company-mark--${experience.variant}`} aria-hidden="true">
              {experience.variant === 'codexa' ? (
                <img
                  src="/brand/logo_codexa-official_horizontal_20260716_reversed.png"
                  alt=""
                  width="149"
                  height="40"
                />
              ) : experience.variant === 'alelo' ? 'alelo' : 'Panvel'}
            </div>
            <div className="experience-copy">
              <div className="experience-head">
                <div>
                  <span className="experience-company">{experience.company}</span>
                  <h3>{experience.role}</h3>
                </div>
                <span>{experience.period}</span>
              </div>
              <p>{experience.description}</p>
              <div className="tag-list">
                {experience.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Experience;
