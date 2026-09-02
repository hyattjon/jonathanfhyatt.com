import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Home() {
  const ref = useScrollReveal(0.05);

  return (
    <section id="home">
      <div className="home__hero reveal" ref={ref}>
        <img
          className="home__photo"
          src="/Profile_chicago.jpg"
          alt="Jonathan Hyatt"
        />
        <div className="home__content">
          <h1 className="home__name">Jonathan Hyatt</h1>
          <p className="home__title">Pre-Doctoral Research Professional, University of Chicago Booth School of Business</p>
          <p className="home__bio">
            I am a pre-doctoral research professional at the University of Chicago Booth School of Business,
            working with Kilian Huber and Ludwig Straub on large-scale consumer transaction microdata.
            I graduated from Brigham Young University in April 2025 with a B.S. in Economics with a Minor in Mathematics. I am applying to economics PhD programs.
          </p>
        </div>
        <div className="home__links">
          <a className="home__link" href="mailto:jonathanhyatt@uchicago.edu">Email</a>
          <a className="home__link" href="#cv">Curriculum Vitae</a>
          <a className="home__link" href="#projects">Projects</a>
          <a className="home__link" href="#github">GitHub</a>
        </div>
        <div className="home__fields">
          {['Micro-informed Macroeconomics', 'Econometrics', 'Machine Learning for Economics'].map(f => (
            <span key={f} className="home__field-tag">{f}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
