import './Services.css';

const Stats = () => {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="grid-3">
          <div className="stat-card glass reveal" style={{ borderTopColor: 'var(--color-primary)' }}>
            <h3 className="stat-value">11,68% - 14,79%<span className="asterisk" style={{ color: 'var(--color-primary)' }}>*</span></h3>
            <p className="stat-title" style={{ color: 'var(--color-primary)' }}>Rentabilidad Anualizada</p>
            <p className="stat-desc">
              *Horquilla de rentabilidades promedio en 2024.
            </p>
          </div>
          
          <div className="stat-card glass reveal" style={{ transitionDelay: '0.1s', borderTopColor: 'var(--color-secondary)' }}>
            <h3 className="stat-value">+ 42 M€</h3>
            <p className="stat-title" style={{ color: 'var(--color-secondary)' }}>Volumen de Adquisiciones</p>
            <p className="stat-desc">Capital gestionado en inversiones estratégicas premium.</p>
          </div>
          
          <div className="stat-card glass reveal" style={{ transitionDelay: '0.2s', borderTopColor: 'var(--color-primary)' }}>
            <h3 className="stat-value">5,56 M€ <span className="highlight" style={{ color: 'var(--color-secondary)' }}>(13,24%)</span></h3>
            <p className="stat-title" style={{ color: 'var(--color-primary)' }}>Beneficios Proyectos</p>
            <p className="stat-desc">Resultados reales de operaciones completadas con éxito.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
