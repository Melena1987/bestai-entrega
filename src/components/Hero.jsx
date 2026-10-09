import './Hero.css';
import { FiArrowRight } from 'react-icons/fi';

const Hero = () => {
  return (
    <section id="inicio" className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-text reveal" style={{ textAlign: 'left' }}>
            <h1>
              Invierte Directamente en Proyectos Inmobiliarios de <span className="red" style={{ display: 'inline-block' }}>Alto Valor</span>.
            </h1>
            <p>
              Bienvenido a la democratización real en las inversiones inmobiliarias. Invierte <strong>CON LA MISMA FUERZA QUE LOS GRANDES EN BIENES PREMIUM TUYOS QUE PUEDES TOCAR</strong>. Bienvenido a BestAI, TU INVERSIÓN INMOBILIARIA DIRECTA Y TANGIBLE.
            </p>
            <div className="hero-buttons">
              <a href="#proyectos" className="btn btn-primary">
                Explora Oportunidades
              </a>
              <a href="#contacto" className="btn btn-secondary">
                Únete Ahora <FiArrowRight />
              </a>
            </div>
          </div>
          <div className="hero-image-wrapper reveal">
            <div className="hero-image">
              <img src="/assets/hero_bg_1778101077257.png" alt="Inversiones Inmobiliarias Premium" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
