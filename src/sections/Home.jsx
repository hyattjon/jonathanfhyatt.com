export default function Home() {
  return (
    <section id="home">
      <div className="home__hero">
        <h1 className="home__name">Jonathan Hyatt</h1>
        <p className="home__title">Economics & Mathematics, Brigham Young University</p>
        <p className="home__bio">
          I am an economics researcher with experience in empirical work, machine learning
          applications, and data analysis. I have worked as a research assistant with Dr. Scott
          Condie and as a teaching assistant for Dr. Brigham Frandsen's Machine Learning for
          Economics course at BYU. I am applying to economics PhD programs.
        </p>
        <div className="home__links">
          <a className="home__link" href="mailto:hyatt.jonathan99@gmail.com">
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
      </div>
    </section>
  );
}
