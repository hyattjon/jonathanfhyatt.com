import { useState } from 'react';

const BASE = import.meta.env.BASE_URL;

const SECTION_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'cv', label: 'CV' },
  { id: 'projects', label: 'Projects' },
  { id: 'github', label: 'GitHub' },
];

// Separate pages (their own HTML entry), as opposed to sections of the one-pager.
const PAGE_LINKS = [
  { href: `${BASE}circular-flow/`, label: 'Circular Flow' },
];

// On the one-pager the section links are in-page anchors; from any other page they lead back to it.
export default function Nav({ onHomePage = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  const links = [
    ...SECTION_LINKS.map(({ id, label }) => ({
      href: onHomePage ? `#${id}` : `${BASE}#${id}`,
      label,
    })),
    ...PAGE_LINKS,
  ];

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
          {links.map(({ href, label }) => (
            <li key={href}>
              <a href={href} onClick={close}>{label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
