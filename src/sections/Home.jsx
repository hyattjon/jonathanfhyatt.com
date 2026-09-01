import { useScrollReveal } from '../hooks/useScrollReveal';

// const FredChart = lazy(() => import('../components/FredChart'));

export default function Home() {
  const ref = useScrollReveal(0.05);

  return (
    <section id="home">
      <div className="home__hero reveal" ref={ref}>
        <h1 className="home__name">Jonathan Hyatt</h1>
        <p className="home__title">Pre-Doctoral Research Fellow, University of Chicago Booth School of Business</p>
        <p className="home__bio">
          I am a pre-doctoral research fellow at the University of Chicago Booth School of Business,
          working with Kilian Huber and Ludwig Straub on large-scale consumer transaction microdata.
          I graduated from Brigham Young University in April 2025 with a B.S. in Economics with a Minor in Mathematics. I am applying to economics PhD programs.
        </p>
        <div className="home__links">
          <a className="home__link" href="mailto:jonathanhyatt@uchicago.edu">
            Email
          </a>
          <a className="home__link" href="#cv">
            Curriculum Vitae
          </a>
          <a className="home__link" href="#projects">
            Coding Projects
          </a>
          <a className="home__link" href="https://github.com/hyattjon" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <div className="home__fields">
          {['Macroeconomics', 'Microeconomics', 'Econometrics', 'Machine Learning for Economics'].map(f => (
            <span key={f} className="home__field-tag">{f}</span>
          ))}
        </div>
        {/* <Suspense fallback={<div className="home__chart-skeleton" style={{height: 220, marginTop: 'var(--space-8)', borderRadius: 'var(--radius-md)'}} />}>
          <FredChart />
        </Suspense> */}
      </div>
    </section>
  );
}
