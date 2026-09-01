const education = [
  {
    institution: 'University of Chicago',
    degree: 'B.A. Economics (with Honors)',
    date: 'Expected June 2027',
    detail: 'Relevant coursework: Mathematical Economics, Econometrics, Macroeconomic Theory, Real Analysis',
  },
];

const research = [
  {
    title: 'Research Assistant',
    subtitle: 'University of Chicago, Department of Economics',
    date: '2025 – Present',
    detail: 'Working with Prof. [Name] on empirical labor market research. Responsibilities include data cleaning, causal inference implementation, and literature review.',
  },
];

const awards = [
  { title: 'Dean\'s List', subtitle: 'University of Chicago', date: '2024, 2025' },
];

function CVBlock({ title, entries }) {
  return (
    <div className="cv__block">
      <h3 className="cv__section-title">{title}</h3>
      {entries.map((e, i) => (
        <div key={i} className="cv__entry">
          <span className="cv__entry-title">{e.title || e.institution}</span>
          <span className="cv__entry-date">{e.date}</span>
          <span className="cv__entry-subtitle">{e.degree || e.subtitle}</span>
          {e.detail && <p className="cv__entry-detail">{e.detail}</p>}
        </div>
      ))}
    </div>
  );
}

export default function CV() {
  return (
    <section id="cv" className="section--alt">
      <div className="section__inner">
        <p className="section__label">Curriculum Vitae</p>
        <a className="cv__download-link" href="/cv.pdf" target="_blank" rel="noreferrer">
          Download full CV (PDF) &rarr;
        </a>
        <CVBlock title="Education" entries={education} />
        <CVBlock title="Research Experience" entries={research} />
        <CVBlock title="Honors & Awards" entries={awards} />
      </div>
    </section>
  );
}
