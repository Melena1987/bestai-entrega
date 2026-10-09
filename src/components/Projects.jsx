import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Projects.css';

// Map legacy CSS class names to real hex colors
const STATUS_COLOR_MAP = {
  'status-new':      '#22c55e',
  'status-closed':   '#f59e0b',
  'status-finished': '#60a5fa',
  'status-sold':     '#a78bfa',
};

function resolveColor(color) {
  if (!color) return '#22c55e';
  // If it's a CSS class name (no # or rgb), map it
  if (!color.startsWith('#') && !color.startsWith('rgb')) {
    return STATUS_COLOR_MAP[color] || '#22c55e';
  }
  return color;
}

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Re-fetch every time the section is visited
    let cancelled = false;
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const querySnapshot = await getDocs(collection(db, 'properties'));
        if (cancelled) return;
        const props = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.published === true) {
            props.push({ id: doc.id, ...data });
          }
        });
        setProjects(props);
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching projects:', err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProjects();
    return () => { cancelled = true; };
  }, [location.pathname]); // re-run when navigating back to home

  return (
    <section id="proyectos" className="projects bg-light">
      <div className="container">
        <h2 className="section-title reveal">
          Explora Nuestros <span className="blue">Proyectos</span>
        </h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem 0' }}>
            Cargando proyectos…
          </p>
        ) : error ? (
          <p style={{ textAlign: 'center', color: 'var(--color-primary)', padding: '3rem 0' }}>
            Error al cargar proyectos: {error}
          </p>
        ) : projects.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem 0' }}>
            Próximamente nuevos proyectos.
          </p>
        ) : (
          <div className="projects-grid">
            {projects.map((project, index) => {
              const imgSrc = project.img || project.image;
              const label = project.label || project.status;
              const badgeColor = resolveColor(project.labelColor || project.statusColor);

              return (
                <div
                  key={project.id}
                  className="project-card reveal"
                  style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
                >
                  <div className="project-img">
                    {imgSrc && <img src={imgSrc} alt={project.title} />}

                    {label && (
                      <div
                        className="project-status"
                        style={{
                          background: badgeColor,
                          color: '#fff',
                          position: 'absolute',
                          top: '1rem',
                          left: '1rem',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          zIndex: 1,
                        }}
                      >
                        {label}
                      </div>
                    )}
                  </div>

                  <div className="project-info glass">
                    <h3>{project.title}</h3>
                    <p>{project.desc}</p>

                    {project.location && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.5rem 0' }}>
                        {project.mapsUrl ? (
                          <a
                            href={project.mapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--color-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            📍 {project.location}
                          </a>
                        ) : (
                          <>📍 {project.location}</>
                        )}
                      </p>
                    )}

                    <Link
                      to={`/proyecto/${project.id}`}
                      className="btn btn-primary"
                      style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
