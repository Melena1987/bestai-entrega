import './Projects.css';

const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Selección de Proyecto",
      desc: "Cada proyecto es seleccionado cuidadosamente por nuestros expertos.",
      color: "var(--color-primary)"
    },
    {
      num: "02",
      title: "Creación de Sociedad",
      desc: "Forma parte de una sociedad limitada junto a nosotros.",
      color: "var(--color-secondary)"
    },
    {
      num: "03",
      title: "Gestión Profesional",
      desc: "BestAI se encarga de la administración completa hasta la venta.",
      color: "var(--color-primary)"
    },
    {
      num: "04",
      title: "Rentabilidad",
      desc: "Recibe tu parte proporcional de las ganancias.",
      color: "var(--color-secondary)"
    }
  ];

  return (
    <section id="comofunciona" className="how-it-works">
      <div className="container">
        <h2 className="section-title reveal">¿Cómo <span className="red">Funciona</span>?</h2>
        <p className="section-subtitle reveal">
          Con BestAI, te conviertes en socio de proyectos exclusivos. Máxima seguridad y transparencia garantizada.
        </p>

        <div className="timeline">
          {steps.map((step, index) => (
            <div key={index} className="timeline-item reveal" style={{ transitionDelay: `${index * 0.15}s` }}>
              <div className="timeline-number" style={{ color: `${step.color}20` }}>{step.num}</div>
              <div className="timeline-content glass" style={{ borderTopColor: step.color }}>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
