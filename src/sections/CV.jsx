const education = [
  {
    institution: 'Brigham Young University',
    degree: 'B.S. Economics (Major), Mathematics (Minor)',
    date: 'April 2025',
    detail: 'GPA: 3.83/4.00 · Coursework: Macroeconomics, Microeconomics, Econometrics, Machine Learning for Economics, Graduate Microeconomics I & II, Graduate Macroeconomics',
  },
];

const research = [
  {
    title: 'Pre-Doctoral Research Professional',
    subtitle: 'University of Chicago Booth School of Business',
    date: '2025 – Present',
    supervisors: 'Kilian Huber (University of Chicago) and Ludwig Straub (Harvard University)',
    bullets: [
      'Process large-scale Visa transaction microdata using Hive and PySpark, working with hundreds of millions of consumer-level observations.',
      'Resolve geographic location attribution problems in transaction data using economic intuition and spatial heuristics.',
      // 'Construct the U.S. extension of the Disaggregated Economic Accounts (DEA) model, adapting methods from Andersen, Huber, Johannesen, Straub & Vestergaard (QJE, 2026); acknowledged in published paper.',
    ],
  },
  {
    title: 'Research Assistant to Prof. Scott Condie',
    subtitle: 'Brigham Young University, Department of Economics',
    date: '2023 – 2025',
    bullets: [
      'Constructed original dataset via Python API calls.',
      'Cleaned, visualized, and summarized data; performed literature review.',
      'Co-authored draft using LaTeX.',
    ],
  },
];

const teaching = [
  {
    title: 'Teaching Assistant — Machine Learning for Economics',
    subtitle: 'Prof. Brigham Frandsen, Brigham Young University',
    date: '2024 – 2025',
    bullets: [
      'Led Python lab sessions and migrated course materials to GitHub.',
    ],
  },
];

const awards = [
  { title: "Dean's List, Economics", subtitle: 'Brigham Young University', date: '2023' },
  { title: 'Alvina Soffel Barrett Scholarship (merit-based)', subtitle: 'Brigham Young University', date: '2023' },
  { title: 'Richard and Patricia Clyde Scholarship (merit-based)', subtitle: 'Brigham Young University', date: '2023' },
  { title: 'Regents Scholarship (merit-based)', subtitle: 'State of Utah', date: '2019' },
];

const skills = [
  { title: 'Programming', subtitle: 'Python, PySpark, Stata, LaTeX, Hive (HQL), Front-End Development (HTML/CSS/JS)', date: '' },
  { title: 'Data', subtitle: 'Large-scale transaction microdata, SQL, Tableau, GitHub', date: '' },
  { title: 'Languages', subtitle: 'English (native), Spanish (fluent — passed 16-credit challenge exam at BYU)', date: '' },
];

const service = [
  {
    title: 'Volunteer Missionary — Church of Jesus Christ of Latter-day Saints',
    subtitle: 'Argentina Comodoro Rivadavia Mission / Washington D.C. South Mission',
    date: '2019 – 2021',
    bullets: ['Led 10-person team and designed data tracking tools for pipeline management.'],
  },
  {
    title: 'Teacher — Missionary Training Center',
    subtitle: 'The Church of Jesus Christ of Latter-day Saints',
    date: '2021 – 2023',
    bullets: ['Trained senior missionaries on finance, housing, and core curriculum.'],
  },
  {
    title: 'Staff — Timberline National Youth Leadership Training, BSA',
    subtitle: 'Eagle Scout (2017)',
    date: '2017 – 2019',
  },
];

function CVEntry({ entry }) {
  const { title, institution, degree, subtitle, date, detail, supervisors, bullets } = entry;
  return (
    <div className="cv__entry">
      <div className="cv__entry-header">
        <span className="cv__entry-title">{title || institution}</span>
        {date && <span className="cv__entry-date">{date}</span>}
      </div>
      <p className="cv__entry-subtitle">{degree || subtitle}</p>
      {supervisors && (
        <p className="cv__entry-supervisors">Supervisors: {supervisors}</p>
      )}
      {detail && <p className="cv__entry-detail">{detail}</p>}
      {bullets && bullets.length > 0 && (
        <ul className="cv__entry-bullets">
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
    </div>
  );
}

import { useScrollReveal } from '../hooks/useScrollReveal';

function CVBlock({ title, entries }) {
  const ref = useScrollReveal();
  return (
    <div className="cv__block reveal" ref={ref}>
      <h3 className="cv__section-title">{title}</h3>
      {entries.map((e, i) => <CVEntry key={i} entry={e} />)}
    </div>
  );
}

export default function CV() {
  return (
    <section id="cv" className="section--alt">
      <div className="section__inner">
        <p className="section__label">Curriculum Vitae</p>
        <a className="cv__download-link" href="/Jonathan_Hyatt_CV.pdf" target="_blank" rel="noreferrer">
          Download full CV (PDF) &rarr;
        </a>
        <CVBlock title="Education" entries={education} />
        <CVBlock title="Research Positions" entries={research} />
        <CVBlock title="Teaching Experience" entries={teaching} />
        <CVBlock title="Honors & Awards" entries={awards} />
        <CVBlock title="Skills" entries={skills} />
        <CVBlock title="Service & Leadership" entries={service} />
      </div>
    </section>
  );
}
