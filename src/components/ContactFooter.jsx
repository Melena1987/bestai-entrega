import { FiMapPin, FiPhone, FiMail, FiFacebook, FiInstagram } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import './ContactFooter.css';

const ContactFooter = () => {
  return (
    <footer id="contacto" className="contact-footer">
      <div className="container">
        <div className="contact-grid">
          
          <div className="contact-info reveal">
            <h2>Contacta con <span className="red">Nosotros</span></h2>
            <p className="contact-desc">
              ¿Listo para invertir en el mercado inmobiliario premium con la seguridad y rentabilidad de BestAI? Escríbenos.
            </p>
            
            <div className="info-items">
              <div className="info-item">
                <FiMapPin className="info-icon" style={{ color: 'var(--color-primary)' }} />
                <div>
                  <h4>Dirección</h4>
                  <p>Calle Velázquez, 27, 1º Ext. Izda.<br/>28001 Madrid</p>
                </div>
              </div>
              
              <div className="info-item">
                <FiPhone className="info-icon" style={{ color: 'var(--color-secondary)' }} />
                <div>
                  <h4>Teléfono</h4>
                  <p>(+34) 910 60 15 15</p>
                </div>
              </div>
              
              <div className="info-item">
                <FiMail className="info-icon" style={{ color: 'var(--color-primary)' }} />
                <div>
                  <h4>Email</h4>
                  <p>info@bestai.es</p>
                </div>
              </div>
            </div>
            
            <div className="social-links mt-2">
              <h4>Síguenos</h4>
              <div className="social-icons">
                <a href="#" aria-label="Facebook"><FiFacebook /></a>
                <a href="#" aria-label="Instagram"><FiInstagram /></a>
                <a href="#" aria-label="Google"><FaGoogle /></a>
              </div>
            </div>
          </div>
          
          <div className="contact-form-container glass reveal" style={{ transitionDelay: '0.2s', borderTopColor: 'var(--color-secondary)' }}>
            <h3>Envíanos un mensaje</h3>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre*</label>
                  <input type="text" id="nombre" required />
                </div>
                <div className="form-group">
                  <label htmlFor="apellido">Apellido*</label>
                  <input type="text" id="apellido" required />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email*</label>
                  <input type="email" id="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input type="tel" id="telefono" />
                </div>
              </div>
              
              <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-logo">
            <img 
              src="https://static.wixstatic.com/media/1846ad_7330f8241dca44a59ab267660791c3e6~mv2.png/v1/crop/x_7,y_198,w_799,h_405/fill/w_383,h_194,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/BESTai%20logo%20web.png" 
              alt="BestAI Logo" 
              className="footer-logo-img"
            />
          </div>
          <div className="footer-legal">
            <a href="#">Aviso Legal</a>
            <span className="separator">•</span>
            <a href="#">Privacidad</a>
          </div>
          <div className="footer-copyright">
            &copy; 2026 por BestAI.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ContactFooter;
