import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Services from './components/Services';
import MeetingScheduler from './components/MeetingScheduler';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    // Set initial title
    document.title = 'Digital Optimistic';

    // Function to update title based on visible section
    const updateTitle = () => {
      const sections = [
        { id: 'hero', title: 'Digital Optimistic' },
        { id: 'about', title: 'About Us | Digital Optimistic' },
        { id: 'skills', title: 'Skills & Expertise | Digital Optimistic' },
        { id: 'projects', title: 'Projects | Digital Optimistic' },
        { id: 'services', title: 'Services | Digital Optimistic' },
        { id: 'meeting', title: 'Book a Meeting | Digital Optimistic' },
        { id: 'contact', title: 'Contact Us | Digital Optimistic' },
      ];

      // Find which section is most visible
      let maxVisible = 0;
      let activeSection = sections[0];

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
          const visibleRatio = visibleHeight / rect.height;

          if (visibleRatio > maxVisible && visibleRatio > 0.3) {
            maxVisible = visibleRatio;
            activeSection = section;
          }
        }
      });

      // Update title
      document.title = activeSection.title;
    };

    // Update title on scroll
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateTitle();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial update
    updateTitle();

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateTitle);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateTitle);
    };
  }, []);

  return (
    <Router>
      <div className="App overflow-x-hidden w-full">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Services />
        <MeetingScheduler />
        <Contact />
        <Footer />
      </div>
    </Router>
  );
}

export default App;

