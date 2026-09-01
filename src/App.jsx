import { useState } from 'react';
import './App.css';
import Home from './sections/Home';
import CV from './sections/CV';
import Projects from './sections/Projects';
import WritingSample from './sections/WritingSample';

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#cv', label: 'CV' },
  { href: '#writing', label: 'Writing' },
  { href: '#projects', label: 'Projects' },
];

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <nav className={`nav${menuOpen ? ' nav--open' : ''}`}>
      <div className="nav__inner">
        <span className="nav__name">Jonathan Hyatt</span>
        <button
          className="nav__menu-btn"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        <ul className="nav__links">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} onClick={close}>{label}</a>
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
      &copy; {new Date().getFullYear()} Jonathan Hyatt &middot; jonathanhyatt@uchicago.edu
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
        <WritingSample />
        <Projects />
      </main>
      <Footer />
    </>
  );
}
