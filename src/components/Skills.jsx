import { skillGroups } from '../data/profile';
import Icon from './Icon';

function Skills() {
  return (
    <section className="panel section-block" id="skills">
      <div className="section-title">
        <Icon name="server" />
        <h2>Skills & Ferramentas</h2>
      </div>

      <div className="skills-grid">
        {skillGroups.map((group) => (
          <article className="skill-card" key={group.title}>
            <Icon name={group.icon} />
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Skills;
