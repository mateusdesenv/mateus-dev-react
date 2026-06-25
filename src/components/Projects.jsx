import { useEffect, useRef, useState } from 'react';
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
      <img src={project.imageUrl} alt={project.altText} loading="lazy" onError={() => setHasError(true)} />
    </picture>
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const scrollerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        setStatus('loading');
        const items = await fetchFeaturedProjects({ signal: controller.signal });
        setProjects(items);
        setStatus(items.length ? 'success' : 'empty');
      } catch (error) {
        if (error.name === 'AbortError') return;
        setErrorMessage(error.message || 'Não foi possível carregar os projetos.');
        setStatus('error');
      }
    }

    loadProjects();
    return () => controller.abort();
  }, []);

  function scrollProjects(direction) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const amount = Math.round(scroller.clientWidth * 0.82);
    scroller.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }

  return (
    <section className="projects-section section-block" id="projetos">
      <div className="projects-head">
        <div className="section-title">
          <Icon name="code" />
          <h2>Projetos em destaque</h2>
        </div>
        <div className="project-controls" aria-label="Controles do carrossel de projetos">
          <button type="button" onClick={() => scrollProjects(-1)} aria-label="Voltar projetos">
            <Icon name="chevronLeft" size={20} />
          </button>
          <button type="button" onClick={() => scrollProjects(1)} aria-label="Avançar projetos">
            <Icon name="chevronRight" size={20} />
          </button>
        </div>
      </div>

      {status === 'loading' ? (
        <div className="portfolio-state panel">
          <span />
          <strong>Carregando projetos</strong>
          <p>Buscando os projetos publicados na API da Codexa.</p>
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="portfolio-state panel portfolio-state--error">
          <span />
          <strong>Não foi possível carregar os projetos</strong>
          <p>{errorMessage}</p>
        </div>
      ) : null}

      {status === 'empty' ? (
        <div className="portfolio-state panel">
          <span />
          <strong>Nenhum projeto publicado</strong>
          <p>Cadastre projetos com status publicado e exibição na home para que eles apareçam aqui.</p>
        </div>
      ) : null}

      {status === 'success' ? (
        <div className="projects-scroller" ref={scrollerRef}>
          {projects.map((project) => (
            <article className="project-card panel" key={project.id}>
              <a className="project-media" href={project.projectUrl} target="_blank" rel="noreferrer" aria-label={`Abrir projeto ${project.title}`}>
                <ProjectImage project={project} />
              </a>
              <div className="project-content">
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
