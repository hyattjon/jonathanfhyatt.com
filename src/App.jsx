import './App.css';
import Home from './sections/Home';
import CV from './sections/CV';
import Projects from './sections/Projects';

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#cv', label: 'CV' },
  { href: '#projects', label: 'Projects' },
];

function Nav() {
  return (
    <nav className="nav">
      <div className="nav__inner">
        <span className="nav__name">Jonathan Hyatt</span>
        <ul className="nav__links">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      &copy; {new Date().getFullYear()} Jonathan Hyatt &middot; hyatt.jonathan99@gmail.com
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <main className="page">
        <Home />
        <CV />
        <Projects />
      </main>
      <Footer />
    </>
  );
}
