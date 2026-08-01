import { skillGroups } from '../data/profile';
import Icon from './Icon';

function Skills() {
  return (
    <section className="section-block" id="skills">
      <div className="section-heading section-heading--row">
        <div>
          <span className="section-kicker">04 · STACK</span>
          <h2>Ferramentas certas para cada desafio.</h2>
        </div>
        <p>Da interface à infraestrutura, uma stack completa para entregar com autonomia e qualidade.</p>
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
