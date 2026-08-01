import { focusAreas } from '../data/profile';
import Icon from './Icon';

function About() {
  return (
    <section className="about-grid section section-block" id="sobre">
      <div className="section-heading">
        <span className="section-kicker">01 · SOBRE</span>
        <h2>Tecnologia com visão de produto e impacto no negócio.</h2>
      </div>

      <article className="content-card">
        <div className="section-title compact">
          <Icon name="user" />
          <h3>Como eu trabalho</h3>
        </div>
        <p>Sou desenvolvedor Full Stack com mais de 7 anos de experiência na criação de aplicações web escaláveis e de alta performance.</p>
        <p>Atuo no desenvolvimento de sistemas completos, painéis administrativos, e-commerces e integrações robustas com APIs.</p>
        <p>Uno arquitetura limpa, atenção à experiência e entendimento de negócio para construir soluções que continuam boas depois do lançamento.</p>
      </article>

      <article className="content-card focus-card">
        <div className="section-title compact">
          <Icon name="star" />
          <h3>Áreas de foco</h3>
        </div>
        <ul className="check-list">
          {focusAreas.map((item) => (
            <li key={item}>
              <Icon name="check" size={17} />
              {item}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

export default About;
