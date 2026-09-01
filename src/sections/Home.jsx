export default function Home() {
  return (
    <section id="home">
      <div className="home__hero">
        <h1 className="home__name">Jonathan F. Hyatt</h1>
        <p className="home__title">PhD Applicant in Economics &middot; University of Chicago</p>
        <p className="home__bio">
          I am a researcher interested in macroeconomics, econometrics, and applied
          microeconomics. My work focuses on empirical questions at the intersection
          of labor markets and economic policy. I will be applying to economics PhD
          programs in the 2026&ndash;2027 cycle.
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
          <a className="home__link" href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <div className="home__fields">
          {['Macroeconomics', 'Econometrics', 'Labor Economics', 'Applied Microeconomics'].map(f => (
            <span key={f} className="home__field-tag">{f}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
