import './About.css';

const About = () => {
  return (
    <section id="nosotros" className="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-content reveal">
            <h2 className="section-title" style={{ textAlign: 'left' }}>Sobre <span className="red">Nosotros</span></h2>
            
            <p className="lead-text">
              <strong>BestAI</strong>, un equipo de profesionales con más de 25 años de experiencia en los sectores inmobiliario y financiero. 
            </p>
            <p>
              Desde el año 2021, hemos unido nuestras fuerzas para desarrollar las mejores inversiones en bienes raíces premium, trabajando mano a mano con nuestros socios para obtener retornos por encima de la media del mercado.
            </p>
            <p>
              En BestAI somos pioneros en la gestión inmobiliaria, aplicando <span className="blue" style={{fontWeight: 600}}>Inteligencia Artificial</span> a través de nuestros algoritmos para localizar los mejores activos en venta dentro de los mercados premium y de lujo.
            </p>
            <p>
              Trabajamos principalmente en cuatro zonas clave: <strong>Madrid, Costa del Sol, Málaga y Barcelona</strong>. Gracias a nuestra tecnología, encontramos oportunidades con descuentos que oscilan entre el 15% y el 40% de su valor de mercado.
            </p>
            
            <div className="highlight-box glass mt-2">
              <p>
                <strong>¡Bienvenido a la verdadera democratización en la compra-venta de activos!</strong><br />
                Bienvenido a <span className="red">Best</span><span className="blue">AI</span>, tu inversión inmobiliaria directa y tangible.
              </p>
            </div>
          </div>
          
          <div className="about-image-wrapper reveal">
            <div className="about-image">
               <img src="/assets/project_penthouse_1778101107602.png" alt="Interior Premium Marbella" />
               <div className="experience-badge glass" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                 <span className="years" style={{ color: 'var(--color-primary)' }}>+25</span>
                 <span className="text">Años de<br/>Experiencia</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
