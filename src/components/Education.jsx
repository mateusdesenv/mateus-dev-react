import Icon from './Icon';

function Education() {
  return (
    <section className="education-contact-grid section" id="formacao">
      <article className="panel education-card">
        <div className="section-title compact">
          <Icon name="graduation" />
          <h2>Formação acadêmica</h2>
        </div>
        <div className="education-item">
          <div className="education-icon">
            <Icon name="graduation" />
          </div>
          <div>
            <h3>Faculdade & Escola Técnica</h3>
            <p>Formação técnica e graduação em áreas voltadas à tecnologia e desenvolvimento de sistemas. Base sólida em lógica de programação, estruturas de dados e desenvolvimento de software.</p>
          </div>
          <span>2015 - 2017</span>
        </div>
      </article>
    </section>
  );
}

export default Education;
