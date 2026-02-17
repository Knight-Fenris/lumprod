import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/categories', label: 'Categories' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/guidelines', label: 'Guidelines' },
  { href: '/faq', label: 'FAQ' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img src="/lumiere-logo.png" alt="LUMIERE" className="logo-image" />
        </Link>

        <nav className="header-nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`nav-link ${location.pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost hide-mobile">Dashboard</Link>
              <Link to="/submit" className="btn btn-primary hide-mobile">Submit Film</Link>
              <button onClick={handleSignOut} className="btn btn-ghost">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost hide-mobile">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}

          <button className="menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} to={link.href} className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleSignOut} className="nav-link" style={{ width: '100%', textAlign: 'left' }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
