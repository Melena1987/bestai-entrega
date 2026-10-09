import { FiHome, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import './Services.css';

const Services = () => {
  return (
    <section id="servicios" className="services bg-light">
      <div className="container">
        <h2 className="section-title reveal">Nuestros <span className="red">Servicios</span></h2>
        <p className="section-subtitle reveal">
          Ofrecemos soluciones integrales y personalizadas para inversores, compradores, vendedores e inquilinos en el mercado Premium.
        </p>

        <div className="services-container">
          
          <div className="service-group glass reveal" style={{ borderLeft: '4px solid var(--color-primary)' }}>
            <div className="service-header">
              <div className="service-icon" style={{ backgroundColor: 'var(--color-primary)' }}><FiHome size={28} /></div>
              <h3>1. Gestión Integral de Propiedades</h3>
            </div>
            <ul className="service-list">
              <li>
                <FiCheckCircle className="check-icon" style={{ color: 'var(--color-primary)' }} />
                <span><strong>Venda su vivienda</strong> de manera rápida al mejor precio de mercado, ya tenemos su comprador.</span>
              </li>
              <li>
                <FiCheckCircle className="check-icon" style={{ color: 'var(--color-primary)' }} />
                <span><strong>Alquile su vivienda</strong> a nuestro precio garantizado.</span>
              </li>
            </ul>
          </div>

          <div className="service-group glass reveal" style={{ transitionDelay: '0.1s', borderLeft: '4px solid var(--color-secondary)' }}>
            <div className="service-header">
              <div className="service-icon" style={{ backgroundColor: 'var(--color-secondary)' }}><FiTrendingUp size={28} /></div>
              <h3>2. Inversión Directa e Intermediación Premium</h3>
            </div>
            
            <div className="service-columns">
              <div className="service-col">
                <h4 className="col-title" style={{ color: 'var(--color-secondary)' }}>Para compradores y propietarios</h4>
                <ul className="service-list">
                  <li><FiCheckCircle className="check-icon" style={{ color: 'var(--color-secondary)' }} /> Tasación gratuita.</li>
                  <li><FiCheckCircle className="check-icon" style={{ color: 'var(--color-secondary)' }} /> Consultor personal experimentado.</li>
                </ul>
              </div>
              
              <div className="service-col">
                <h4 className="col-title" style={{ color: 'var(--color-primary)' }}>Valor Añadido</h4>
                <ul className="service-list">
                  <li><FiCheckCircle className="check-icon" style={{ color: 'var(--color-primary)' }} /> <strong>Revalorice su propiedad entre un 20 y un 40%</strong>. Realizamos una reforma de diseño completamente a nuestro cargo.</li>
                </ul>
              </div>
            </div>
            
            <div className="service-alert mt-2" style={{ borderColor: 'var(--color-primary)', backgroundColor: 'rgba(227, 6, 19, 0.05)' }}>
              <p><strong>LE COMPRAMOS SU VIVIENDA AL CONTADO</strong> AL MEJOR PRECIO DE MERCADO EN CUALQUIER ESTADO.</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Services;
