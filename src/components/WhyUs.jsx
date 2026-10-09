import { FiShield, FiTrendingUp, FiPieChart, FiUsers, FiEye } from 'react-icons/fi';
import './About.css';

const WhyUs = () => {
  const reasons = [
    {
      icon: <FiEye size={32} />,
      title: "Transparencia Total",
      desc: "Participa directamente en la adquisición y gestión de activos inmobiliarios Premium.",
      color: "var(--color-primary)"
    },
    {
      icon: <FiShield size={32} />,
      title: "Control y Seguridad",
      desc: "Tu inversión está guiada y gestionada por expertos en cada etapa, pero tú posees y controlas tu activo inmobiliario en todo momento.",
      color: "var(--color-secondary)"
    },
    {
      icon: <FiTrendingUp size={32} />,
      title: "Rentabilidad Óptima",
      desc: "Obtén retornos significativos con proyectos en Bienes Raíces Premium seleccionados cuidadosamente.",
      color: "var(--color-primary)"
    },
    {
      icon: <FiPieChart size={32} />,
      title: "Diversificación",
      desc: "La selección realizada por nuestros profesionales le permitirá tener sus inversiones inmobiliarias altamente diversificados.",
      color: "var(--color-secondary)"
    },
    {
      icon: <FiUsers size={32} />,
      title: "Compromiso",
      desc: "Con BestAI, el usuario de nuestros servicios no es un cliente, es un socio más con todo su significado pleno.",
      color: "var(--color-primary)"
    }
  ];

  return (
    <section className="why-us bg-light">
      <div className="container">
        <h2 className="section-title reveal">¿Por qué <span className="blue">elegirnos</span>?</h2>
        
        <div className="features-grid">
          {reasons.map((reason, index) => (
            <div 
              key={index} 
              className={`feature-card glass reveal ${index === 4 ? 'feature-card-large' : ''}`}
              style={{ 
                transitionDelay: `${index * 0.1}s`,
                borderTop: `2px solid ${reason.color}`
              }}
            >
              <div className="feature-icon" style={{ backgroundColor: `${reason.color}20`, color: reason.color }}>
                {reason.icon}
              </div>
              <h3>{reason.title}</h3>
              <p>{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
