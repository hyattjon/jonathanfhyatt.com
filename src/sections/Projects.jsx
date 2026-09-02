import { useScrollReveal } from '../hooks/useScrollReveal';

// Add working papers here as { title, coauthors, status, date, links: [{ label, href }] } once available.
const papers = [];

export default function Projects() {
  const ref = useScrollReveal();

  return (
    <section id="projects" className="section">
      <div className="reveal" ref={ref}>
        <p className="section__label">Projects</p>
        <h2 className="section__title">Working Papers</h2>

        {papers.length === 0 && (
          <p className="projects__placeholder">Working papers coming soon.</p>
        )}
      </div>
    </section>
  );
}
