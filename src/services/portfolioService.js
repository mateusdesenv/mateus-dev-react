const API_BASE_URL = 'https://codexa-portifolio-api.vercel.app';
const PORTFOLIO_PATH = '/api/v1/portfolio-items';

function normalizeBaseUrl(url = '') {
  return String(url).replace(/\/+$/, '');
}

export function resolvePortfolioImageUrl(value = '') {
  const image = String(value || '').trim();
  if (!image) return '';
  if (/^(?:https?:|data:|blob:)/i.test(image)) return image;

  try {
    return new URL(image, `${normalizeBaseUrl(API_BASE_URL)}/`).toString();
  } catch (_error) {
    return '';
  }
}

function buildPortfolioUrl() {
  const url = new URL(`${API_BASE_URL}${PORTFOLIO_PATH}`);
  url.searchParams.set('status', 'published');
  return url.toString();
}

function normalizeStringList(value) {
  if (!value) return [];
  const list = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
  return list.map((item) => String(item).trim()).filter(Boolean);
}

export async function fetchFeaturedProjects({ signal } = {}) {
  const response = await fetch(buildPortfolioUrl(), { signal });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result?.error?.message || `A API retornou status ${response.status}.`);
  }

  const projects = Array.isArray(result?.data) ? result.data : [];

  return projects
    .filter((project) => project?.status === 'published')
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .map((project, index) => {
      const title = project.title || project.featuredTitle || `Projeto ${index + 1}`;
      return {
        id: project.id || project.slug || title,
        title,
        shortDescription:
          project.shortDescription || project.featuredDescription || 'Projeto desenvolvido com foco em presença digital, performance e conversão.',
        projectUrl: project.projectUrl || project.primaryCtaUrl || '#',
        imageUrl: resolvePortfolioImageUrl(project.desktopImageUrl || project.featuredImage || project.mobileImageUrl),
        mobileImageUrl: resolvePortfolioImageUrl(project.mobileImageUrl || project.desktopImageUrl || project.featuredImage),
        altText: project.altText || project.featuredImageAlt || `Preview do projeto ${title}`,
        category: project.category || 'Projeto',
        tags: normalizeStringList(project.niches || project.tags || project.featuredTags).slice(0, 3),
      };
    });
}
