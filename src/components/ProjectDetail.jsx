import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import {
  FiArrowLeft, FiMapPin, FiHome, FiTag, FiPhone,
  FiMail, FiChevronDown, FiCheckCircle, FiTrendingUp,
  FiClock, FiTarget, FiExternalLink
} from 'react-icons/fi';
import './ProjectDetail.css';

/* ─── Intersection Observer Hook ─────────────────────────────── */
function useFadeUp(threshold = 0.1) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Make visible immediately if already in viewport
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect(); } },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    // Fallback: force visible after 600ms in case observer doesn't fire
    const timer = setTimeout(() => { el.classList.add('visible'); }, 600);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [threshold]);
  return ref;
}

/* ─── Feature icons map ───────────────────────────────────────── */
const FEATURE_ICONS = ['🏊', '🌳', '🅿️', '🏋️', '🛡️', '🌅', '🔒', '✨', '🏡', '🎯'];

/* ─── Main Component ──────────────────────────────────────────── */
const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [formSent, setFormSent] = useState(false);

  const overviewRef = useFadeUp();
  const statsRef = useFadeUp();
  const featuresRef = useFadeUp();
  const galleryRef = useFadeUp();
  const locationRef = useFadeUp();
  const ctaRef = useFadeUp();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  // Once project data is ready, force fade-up elements visible
  useEffect(() => {
    if (!project) return;
    const timer = setTimeout(() => {
      document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
    }, 100);
    return () => clearTimeout(timer);
  }, [project]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, border: '3px solid var(--color-border)',
            borderTopColor: 'var(--color-primary)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem'
          }} />
          <p style={{ color: 'var(--color-text-muted)' }}>Cargando propiedad…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!project) {
    return (
      <div className="container" style={{ padding: '12rem 0', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Propiedad no encontrada</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          Es posible que esta propiedad haya sido eliminada o no esté disponible.
        </p>
        <Link to="/#proyectos" className="btn btn-primary">← Ver todos los proyectos</Link>
      </div>
    );
  }

  const imgSrc = project.img || project.image;
  const label = project.label || project.status;
  const labelColor = project.labelColor || project.statusColor || '#22c55e';
  const mapsUrl = project.mapsUrl;

  return (
    <div className="property-landing">

      {/* ── BACK BUTTON ────────────────────────────────────────── */}
      <button className="property-back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft size={16} /> Volver
      </button>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="property-hero">
        <div className="property-hero-bg">
          <img src={imgSrc} alt={project.title} />
          <div className="hero-overlay" />
        </div>

        <div className="container">
          <div className="hero-content">
            {label && (
              <div className="hero-badge" style={{ background: `${labelColor}30`, borderColor: `${labelColor}50` }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: labelColor, display: 'inline-block'
                }} />
                <span style={{ color: labelColor }}>{label}</span>
              </div>
            )}

            <h1>{project.title}</h1>

            <div className="hero-meta">
              {project.location && (
                <div className="hero-meta-item">
                  <FiMapPin size={16} />
                  {mapsUrl ? (
                    <a href={mapsUrl} target="_blank" rel="noreferrer">
                      {project.location} <FiExternalLink size={12} style={{ display: 'inline' }} />
                    </a>
                  ) : (
                    <span>{project.location}</span>
                  )}
                </div>
              )}
              {project.type && (
                <div className="hero-meta-item">
                  <FiHome size={16} />
                  <span>{project.type}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <span>Desplaza</span>
          <FiChevronDown />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          OVERVIEW + STATS CARD
      ══════════════════════════════════════════════════════════ */}
      <section className="property-section">
        <div className="container">
          <div className="overview-grid">

            {/* Left: description */}
            <div ref={overviewRef} className="overview-text fade-up">
              {project.type && (
                <span className="overview-type-tag">
                  <FiTag size={14} /> {project.type}
                </span>
              )}
              <h2>Sobre esta <span style={{ color: 'var(--color-primary)' }}>propiedad</span></h2>
              <p className="desc-lead">{project.desc}</p>
              {project.fullDesc && <p className="desc-body">{project.fullDesc}</p>}

              {/* Features / amenities */}
              {project.features && project.features.length > 0 && (
                <div style={{ marginTop: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', color: 'var(--color-text-muted)' }}>
                    Características destacadas
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {project.features.map((f, i) => (
                      <span key={i} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.5rem 1rem', borderRadius: '50px',
                        background: 'rgba(0,0,0,0.03)',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.9rem', color: 'var(--color-text)'
                      }}>
                        <FiCheckCircle size={14} style={{ color: 'var(--color-secondary)' }} />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: stats card */}
            <div ref={statsRef} className="fade-up" style={{ transitionDelay: '0.15s' }}>
              <div className="property-stats-card">
                <h3>Ficha de la propiedad</h3>

                <div className="stat-row">
                  <div className="stat-row-icon blue"><FiHome /></div>
                  <div className="stat-row-data">
                    <small>Tipo</small>
                    <strong>{project.type || 'N/A'}</strong>
                  </div>
                </div>

                <div className="stat-row">
                  <div className="stat-row-icon red"><FiMapPin /></div>
                  <div className="stat-row-data">
                    <small>Ubicación</small>
                    <strong style={{ fontSize: '1.1rem' }}>{project.location || 'N/A'}</strong>
                  </div>
                </div>

                {project.stats?.tir && (
                  <div className="stat-row">
                    <div className="stat-row-icon green"><FiTrendingUp /></div>
                    <div className="stat-row-data">
                      <small>TIR Estimada</small>
                      <strong>{project.stats.tir}</strong>
                    </div>
                  </div>
                )}

                {project.stats?.plazo && (
                  <div className="stat-row">
                    <div className="stat-row-icon blue"><FiClock /></div>
                    <div className="stat-row-data">
                      <small>Plazo Previsto</small>
                      <strong>{project.stats.plazo}</strong>
                    </div>
                  </div>
                )}

                {project.stats?.objetivo && (
                  <div className="stat-row">
                    <div className="stat-row-icon red"><FiTarget /></div>
                    <div className="stat-row-data">
                      <small>Objetivo de Inversión</small>
                      <strong>{project.stats.objetivo}</strong>
                    </div>
                  </div>
                )}

                <div className="stats-cta">
                  <a href="tel:+34910601515" className="btn btn-primary" style={{ display: 'flex', marginBottom: '0.75rem', borderRadius: '12px', justifyContent: 'center' }}>
                    <FiPhone size={16} /> Llamar ahora
                  </a>
                  <a href="mailto:info@bestai.es" className="btn btn-outline" style={{ display: 'flex', borderRadius: '12px', justifyContent: 'center' }}>
                    <FiMail size={16} /> Solicitar información
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          GALLERY
      ══════════════════════════════════════════════════════════ */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="property-section alt-bg">
          <div className="container">
            <div ref={galleryRef} className="property-section-header fade-up">
              <span className="overline">Visual</span>
              <h2>Galería de <span style={{ color: 'var(--color-secondary)' }}>imágenes</span></h2>
              <hr className="property-divider" style={{ marginTop: '1rem' }} />
            </div>

            <div className="property-gallery-grid">
              {project.gallery.map((url, idx) => (
                <div key={idx} className={`gallery-cell ${idx === 0 && project.gallery.length >= 3 ? 'span-2' : ''}`}>
                  <img src={url} alt={`${project.title} — imagen ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          LOCATION
      ══════════════════════════════════════════════════════════ */}
      {project.location && (
        <section className="property-section">
          <div className="container">
            <div ref={locationRef} className="location-content fade-up">
              <div className="location-info">
                <span className="overline" style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--color-primary)', display: 'block', marginBottom: '0.75rem' }}>
                  Ubicación
                </span>
                <h3>{project.location}</h3>
                <p>
                  Esta propiedad está estratégicamente situada en una de las zonas más exclusivas.
                  Acceso rápido a servicios, ocio y comunicaciones de primer nivel.
                </p>
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline"
                    style={{ display: 'inline-flex', gap: '0.5rem', borderRadius: '12px', padding: '0.8rem 1.5rem' }}
                  >
                    <FiMapPin size={16} /> Ver en Google Maps
                    <FiExternalLink size={14} />
                  </a>
                )}
              </div>

              <div className="location-map-container">
                {mapsUrl ? (
                  /* Embed Google Maps if we can extract lat/lng — else show CTA */
                  <div className="location-map-placeholder">
                    <div style={{
                      fontSize: '4rem', marginBottom: '1rem',
                      background: 'rgba(0,159,227,0.1)', width: 80, height: 80,
                      borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', margin: '0 auto 1rem'
                    }}>
                      📍
                    </div>
                    <strong style={{ color: 'var(--color-text)', fontSize: '1.1rem' }}>{project.location}</strong>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                      style={{ marginTop: '1rem', borderRadius: '10px', fontSize: '0.9rem', padding: '0.7rem 1.5rem' }}
                    >
                      Abrir en Maps
                    </a>
                  </div>
                ) : (
                  <div className="location-map-placeholder">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>🗺️</div>
                    <span style={{ fontSize: '0.9rem' }}>Ubicación: {project.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          CONTACT FORM
      ══════════════════════════════════════════════════════════ */}
      <section className="property-section alt-bg">
        <div className="container">
          <div ref={ctaRef} className="fade-up" style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="property-section-header">
              <span className="overline">Contacto</span>
              <h2>¿Te interesa esta <span style={{ color: 'var(--color-primary)' }}>propiedad</span>?</h2>
              <p>Déjanos tus datos y nuestro equipo te contactará en menos de 24 horas con toda la información.</p>
            </div>

            {formSent ? (
              <div style={{
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: 20, padding: '3rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ marginBottom: '0.5rem' }}>¡Mensaje enviado!</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Nos pondremos en contacto contigo en breve.</p>
              </div>
            ) : (
              <form
                onSubmit={handleFormSubmit}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 20, padding: '2.5rem',
                  display: 'flex', flexDirection: 'column', gap: '1.2rem'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    className="premium-input"
                  />
                  <input
                    type="email"
                    placeholder="Tu email"
                    required
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    className="premium-input"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Teléfono (opcional)"
                  value={contactForm.phone}
                  onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="premium-input"
                />
                <textarea
                  placeholder={`Quiero más información sobre ${project.title}…`}
                  rows={4}
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  className="premium-input"
                  style={{ resize: 'vertical', minHeight: 120 }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '1rem', borderRadius: '12px', fontSize: '1rem' }}
                >
                  Enviar solicitud
                </button>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                  También puedes llamarnos al <a href="tel:+34910601515" style={{ color: 'var(--color-secondary)' }}>+34 910 601 515</a> o escribirnos a{' '}
                  <a href="mailto:info@bestai.es" style={{ color: 'var(--color-secondary)' }}>info@bestai.es</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="property-cta-section">
        <div className="container">
          <div className="property-cta-content">
            <h2>¿Listo para dar el siguiente <span style={{ color: 'var(--color-primary)' }}>paso</span>?</h2>
            <p>Nuestro equipo de expertos está disponible para guiarte en cada etapa del proceso.</p>
            <div className="cta-buttons">
              <Link to="/#proyectos" className="btn btn-outline">
                ← Ver más proyectos
              </Link>
              <a href="tel:+34910601515" className="btn btn-primary">
                <FiPhone size={16} /> Hablar con un asesor
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};



export default ProjectDetail;
