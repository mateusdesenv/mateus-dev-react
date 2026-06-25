import { experiences } from '../data/profile';
import Icon from './Icon';

function Experience() {
  return (
    <section className="panel section-block" id="experiencia">
      <div className="section-title">
        <Icon name="briefcase" />
        <h2>Experiência profissional</h2>
      </div>

      <div className="experience-grid">
        {experiences.map((experience) => (
          <article className="experience-card" key={experience.company}>
            <div className={`company-mark company-mark--${experience.variant}`}>
              {experience.variant === 'codexa' ? 'C' : experience.variant === 'alelo' ? 'alelo' : 'Panvel'}
            </div>
            <div className="experience-copy">
              <div className="experience-head">
                <div>
                  <h3>{experience.company}</h3>
                  <strong>{experience.role}</strong>
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
