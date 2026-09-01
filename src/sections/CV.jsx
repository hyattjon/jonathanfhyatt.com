const education = [
  {
    institution: 'Brigham Young University',
    degree: 'B.S. Economics (Major), Mathematics (Minor)',
    date: 'April 2025',
    detail: 'GPA: 3.83/4.00 · Coursework: Macroeconomics (Bradford), Microeconomics (Lefgren), Econometrics (Pope), Machine Learning for Economics (Frandsen), Graduate Microeconomics I & II (Condie, Platt), Graduate Macroeconomics (Vom Lehn)',
  },
];

const awards = [
  { title: 'Alvina Soffel Barrett Scholarship', subtitle: 'Merit Based · Brigham Young University', date: '' },
  { title: 'Richard and Patricia Clyde Scholarship', subtitle: 'Merit Based · Brigham Young University', date: '' },
  { title: 'Regents Scholarship', subtitle: 'Merit Based · State of Utah', date: '2019' },
];

const research = [
  {
    title: 'Research Assistant',
    subtitle: 'Dr. Scott Condie · Brigham Young University',
    date: '2023 – Present',
    detail: 'Built dataset via Python API calls. Cleaned, visualized, and summarized data. Performed literature review and drafted paper sections in LaTeX.',
  },
  {
    title: 'Teaching Assistant — Machine Learning for Economics',
    subtitle: 'Dr. Brigham Frandsen · Brigham Young University',
    date: '2024 – Present',
    detail: 'Taught introductory Python lab session. Migrated all course materials to GitHub.',
  },
];

const skills = [
  { title: 'Programming & Software', subtitle: 'Python, STATA, LaTeX, Tableau', date: '' },
  { title: 'Languages', subtitle: 'English (native), Spanish (fluent — passed 16-credit BYU challenge exam)', date: '' },
];

const service = [
  {
    title: 'Teacher — Missionary Training Center',
    subtitle: 'The Church of Jesus Christ of Latter-day Saints',
    date: '2021 – 2023',
    detail: 'Trained senior missionaries on finance, housing, office responsibilities, and core curriculum.',
  },
  {
    title: 'Volunteer Missionary',
    subtitle: 'Argentina Comodoro Rivadavia & Washington D.C. South Missions',
    date: '2019 – 2021',
    detail: 'Led a 10-person team. Developed fluent Spanish.',
  },
  {
    title: 'Staff — Timberline National Youth Leadership Training, Boy Scouts of America',
    subtitle: 'Patrol Guide / Instructor (2018, 2019) · Intern (2017)',
    date: '2017 – 2019',
    detail: '',
  },
  {
    title: 'Eagle Scout',
    subtitle: 'Project: organized 35 volunteers to create and deliver blankets for a children\'s hospital',
    date: '2017',
    detail: '',
  },
];

function CVBlock({ title, entries }) {
  return (
    <div className="cv__block">
      <h3 className="cv__section-title">{title}</h3>
      {entries.map((e, i) => (
        <div key={i} className="cv__entry">
          <span className="cv__entry-title">{e.title || e.institution}</span>
          {e.date && <span className="cv__entry-date">{e.date}</span>}
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
        <CVBlock title="Research & Teaching Experience" entries={research} />
        <CVBlock title="Honors & Awards" entries={awards} />
        <CVBlock title="Skills" entries={skills} />
        <CVBlock title="Service & Leadership" entries={service} />
      </div>
    </section>
  );
}
