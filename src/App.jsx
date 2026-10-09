import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import WhyUs from './components/WhyUs';
import Stats from './components/Stats';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import Projects from './components/Projects';
import ContactFooter from './components/ContactFooter';
import ProjectDetail from './components/ProjectDetail';
import AdminArea from './pages/AdminArea';
import { useEffect } from 'react';

const Home = () => (
  <>
    <Hero />
    <About />
    <WhyUs />
    <Stats />
    <Services />
    <HowItWorks />
    <Projects />
  </>
);

function ScrollRevealHandler() {
  const location = useLocation();

  useEffect(() => {
    // A more robust observer without restrictive rootMargin which causes issues on reload
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once active, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 }); // Lower threshold so it triggers earlier

    const observeElements = () => {
      document.querySelectorAll('.reveal:not(.active)').forEach((el) => {
        observer.observe(el);
      });
    };

    // Initial observation
    observeElements();

    // Observe future DOM additions (like Firebase async data)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also try to observe after a short delay to catch late renders just in case
    const timeoutId = setTimeout(observeElements, 500);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, [location.pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proyecto/:id" element={<ProjectDetail />} />
          <Route path="/admin" element={<AdminArea />} />
        </Routes>
      </main>
      {!isAdmin && <ContactFooter />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollRevealHandler />
      <AppContent />
    </Router>
  );
}

export default App;
