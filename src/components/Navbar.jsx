import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';
import LoginModal from './LoginModal';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const token = await currentUser.getIdTokenResult(true);
        setIsAdmin(!!token.claims.admin);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      // Navigate to home first, passing the target section via state
      navigate('/', { state: { scrollTo: href } });
    } else {
      // Already on home, just scroll
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle scrolling when we arrive at home from another page
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      const href = location.state.scrollTo;
      // Wait for the page to fully render before scrolling
      const timer = setTimeout(() => {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
        // Clear the state so it doesn't scroll again on re-renders
        navigate('/', { replace: true, state: {} });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Sobre Nosotros', href: '#nosotros' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Cómo funciona', href: '#comofunciona' },
    { name: 'Proyectos', href: '#proyectos' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled glass' : ''}`}>
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <img 
            src="https://static.wixstatic.com/media/1846ad_7330f8241dca44a59ab267660791c3e6~mv2.png/v1/crop/x_7,y_198,w_799,h_405/fill/w_383,h_194,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/BESTai%20logo%20web.png" 
            alt="BestAI Logo" 
            className="logo-img"
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="nav-links desktop-only">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>{link.name}</a>
            </li>
          ))}
        </ul>

        <div className="nav-actions desktop-only">
          {user ? (
            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'var(--color-text)', fontSize: '0.9rem', fontWeight: '500' }}>{user.displayName || user.email.split('@')[0]}</span>
              {isAdmin && <Link to="/admin" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: '#1b6e3b', color: '#1b6e3b' }}>Admin</Link>}
              <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => auth.signOut()}>Salir</button>
            </div>
          ) : (
            <button className="btn btn-outline" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }} onClick={() => setIsModalOpen(true)}>Iniciar sesión</button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="mobile-toggle mobile-only" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={`mobile-nav glass ${mobileMenuOpen ? 'open' : ''}`}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} onClick={(e) => {
                handleNavClick(e, link.href);
                setMobileMenuOpen(false);
              }}>
                {link.name}
              </a>
            </li>
          ))}
          <li>
            {user ? (
              <div style={{ textAlign: 'center', marginTop: '1rem', padding: '0 1rem' }}>
                <span style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text)', fontSize: '0.9rem' }}>{user.displayName || user.email.split('@')[0]}</span>
                {isAdmin && <Link to="/admin" className="btn btn-outline" style={{ width: '100%', marginBottom: '0.5rem', borderColor: '#1b6e3b', color: '#1b6e3b' }} onClick={() => setMobileMenuOpen(false)}>Admin</Link>}
                <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => { auth.signOut(); setMobileMenuOpen(false); }}>Salir</button>
              </div>
            ) : (
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => { setIsModalOpen(true); setMobileMenuOpen(false); }}>
                Iniciar sesión
              </button>
            )}
          </li>
        </ul>
      </div>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
