import { useCallback, useEffect, useState } from 'react';
import { fetchFeaturedProjects } from '../services/portfolioService';
import Icon from './Icon';

function ProjectImage({ project }) {
  const [hasError, setHasError] = useState(false);

  if (!project.imageUrl || hasError) {
    return (
      <div className="project-image-fallback" role="img" aria-label={`Imagem não cadastrada para ${project.title}`}>
        <span>{project.title}</span>
      </div>
    );
  }

  return (
    <picture>
      {project.mobileImageUrl ? <source media="(max-width: 768px)" srcSet={project.mobileImageUrl} /> : null}
      <img
        src={project.imageUrl}
        alt={project.altText}
        loading="lazy"
        width="960"
        height="600"
        onError={() => setHasError(true)}
      />
    </picture>
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const loadProjects = useCallback(async (signal) => {
    try {
      setStatus('loading');
      setErrorMessage('');
      const items = await fetchFeaturedProjects({ signal });
      setProjects(items);
      setStatus(items.length ? 'success' : 'empty');
    } catch (error) {
      if (error.name === 'AbortError') return;
      setErrorMessage(error.message || 'Não foi possível carregar os projetos.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadProjects(controller.signal);
    return () => controller.abort();
  }, [loadProjects]);

  return (
    <section className="projects-section section-block" id="projetos">
      <div className="section-heading section-heading--row">
        <div>
          <span className="section-kicker">03 · PROJETOS SELECIONADOS</span>
          <h2>Produtos digitais feitos para funcionar no mundo real.</h2>
        </div>
        <p>Uma seleção carregada diretamente da API da Codexa, com foco em experiência, performance e conversão.</p>
      </div>

      {status === 'loading' ? (
        <div className="projects-grid" aria-label="Carregando projetos" aria-busy="true">
          {[0, 1, 2].map((item) => <div className="project-skeleton" key={item} />)}
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="portfolio-state portfolio-state--error" role="alert">
          <strong>Não foi possível carregar os projetos</strong>
          <p>{errorMessage}</p>
          <button className="secondary-button" type="button" onClick={() => loadProjects()}>
            Tentar novamente
          </button>
        </div>
      ) : null}

      {status === 'empty' ? (
        <div className="portfolio-state">
          <strong>Nenhum projeto publicado</strong>
          <p>Os novos cases aparecerão aqui assim que forem publicados.</p>
        </div>
      ) : null}

      {status === 'success' ? (
        <div className="projects-grid">
          {projects.slice(0, 6).map((project, index) => (
            <article className={`project-card ${index === 0 ? 'project-card--featured' : ''}`} key={project.id}>
              <a className="project-media" href={project.projectUrl} target="_blank" rel="noreferrer" aria-label={`Abrir projeto ${project.title}`}>
                <ProjectImage project={project} />
              </a>
              <div className="project-content">
                <span className="project-number">0{index + 1}</span>
                <div className="tag-list project-tags">
                  <span className="tag-highlight">{project.category}</span>
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <h3>{project.title}</h3>
                <p>{project.shortDescription}</p>
                <a className="text-link" href={project.projectUrl} target="_blank" rel="noreferrer">
                  Ver projeto <Icon name="arrow" size={17} />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default Projects;
