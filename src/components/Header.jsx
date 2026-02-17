import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Header.css";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/categories", label: "Categories" },
  // { href: "/schedule", label: "Schedule" },
  { href: "/guidelines", label: "Guidelines" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setMobileMenuOpen(false);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <header className={`header ${mobileMenuOpen ? "menu-open" : ""}`}>
      <div className="header-container">

        {/* LOGO */}
        <Link
          to="/"
          className="header-logo"
          onClick={() => setMobileMenuOpen(false)}
        >
          <img
            src="/logo-text.png"
            alt="LUMIÈRE"
            className="logo-image"
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="header-nav">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`nav-link ${
                location.pathname === link.href ? "active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="header-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost hide-mobile">
                Dashboard
              </Link>
              <button
                type="button"
                className="btn btn-primary hide-mobile is-disabled"
                disabled
              >
                Submit video
              </button>
              <button onClick={handleSignOut} className="btn btn-ghost">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost hide-mobile">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            className="menu-btn"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
            onClick={toggleMobileMenu}
          >
            <span className="menu-icon">
              {mobileMenuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-inner">

          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`nav-link ${
                location.pathname === link.href ? "active" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="mobile-divider" />

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="nav-link mobile-logout"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}
