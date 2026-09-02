import { useEffect, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const GITHUB_USERNAME = 'hyattjon';

// Add or remove repo slugs here to control which repos are displayed.
const PINNED_REPOS = [
  'weak_instruments',
];

const LANG_COLORS = {
  Python: '#3572A5',
  R: '#198CE7',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Jupyter_Notebook: '#DA5B0B',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
};

function LanguageDot({ language }) {
  if (!language) return null;
  const color = LANG_COLORS[language.replace(/ /g, '_')] ?? '#888882';
  return (
    <span className="repo-card__lang">
      <span className="repo-card__lang-dot" style={{ backgroundColor: color }} />
      {language}
    </span>
  );
}

function StarCount({ count }) {
  if (!count) return null;
  return (
    <span className="repo-card__stars">
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
      </svg>
      {count}
    </span>
  );
}

function RepoCard({ name, description, language, stargazers_count, html_url }) {
  return (
    <article className="repo-card">
      <h3 className="repo-card__title">{name}</h3>
      {description && <p className="repo-card__desc">{description}</p>}
      <div className="repo-card__meta">
        <LanguageDot language={language} />
        <StarCount count={stargazers_count} />
      </div>
      <div className="repo-card__links">
        <a className="repo-card__link" href={html_url} target="_blank" rel="noreferrer">
          View on GitHub &rarr;
        </a>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <article className="repo-card repo-card--skeleton">
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--line" />
      <div className="skeleton skeleton--line skeleton--short" />
    </article>
  );
}

export default function GitHub() {
  const [repos, setRepos] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'done' | 'error'

  useEffect(() => {
    const controller = new AbortController();

    Promise.all(
      PINNED_REPOS.map(slug =>
        fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${slug}`, {
          signal: controller.signal,
          headers: { Accept: 'application/vnd.github+json' },
        }).then(r => {
          if (!r.ok) throw new Error(`${slug}: ${r.status}`);
          return r.json();
        })
      )
    )
      .then(data => {
        setRepos(data);
        setStatus('done');
      })
      .catch(err => {
        if (err.name !== 'AbortError') setStatus('error');
      });

    return () => controller.abort();
  }, []);

  const ref = useScrollReveal();

  return (
    <section id="github" className="section">
      <div className="reveal" ref={ref}>
      <p className="section__label">GitHub</p>
      <h2 className="section__title">Selected Repositories</h2>
      <a className="github__profile-link" href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer">
        View full GitHub profile &rarr;
      </a>

      {status === 'error' && (
        <p className="github__error">
          Could not load repositories. Visit{' '}
          <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer">
            GitHub
          </a>{' '}
          directly.
        </p>
      )}

      <div className="github__grid">
        {status === 'loading'
          ? PINNED_REPOS.map(s => <SkeletonCard key={s} />)
          : repos.map(repo => <RepoCard key={repo.id} {...repo} />)}
      </div>
      </div>
    </section>
  );
}
