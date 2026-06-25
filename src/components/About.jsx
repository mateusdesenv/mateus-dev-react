import { focusAreas } from '../data/profile';
import Icon from './Icon';

function About() {
  return (
    <section className="about-grid section" id="sobre">
      <article className="panel content-card">
        <div className="section-title compact">
          <Icon name="user" />
          <h2>Sobre mim</h2>
        </div>
        <p>
          Sou desenvolvedor Full Stack com mais de 7 anos de experiência na criação de aplicações web escaláveis e de alta performance.
        </p>
        <p>
          Atuo no desenvolvimento de sistemas completos, painéis administrativos, e-commerces e integrações robustas com APIs.
        </p>
        <p>
          Tenho forte atuação com Angular, React, Node.js, Java e Spring Boot, aplicando boas práticas de arquitetura, código limpo e foco em resultados para o negócio.
        </p>
      </article>

      <article className="panel content-card focus-card">
        <div className="section-title compact">
          <Icon name="star" />
          <h2>Áreas de foco</h2>
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
