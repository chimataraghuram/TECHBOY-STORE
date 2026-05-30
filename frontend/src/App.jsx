import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, Suspense, lazy } from 'react'
import { createPortal } from 'react-dom'
import './App.css'
import './redline.css'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StoreSection from './components/StoreSection'
import TechBoyTrends from './components/TechBoyTrends'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import ChatPopup from './components/ChatPopup'
import ParticleBackground from './components/ParticleBackground'
import IntroScreen from './components/IntroScreen'
import { StatsStrip } from './components/AnimationEngine'

const TechAdvisorModal = lazy(() => import('./components/TechAdvisorModal'))

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showIntro, setShowIntro] = useState(true);

  React.useEffect(() => {
    if (showIntro) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(
      'section, .footer-section, .stats-strip-container'
    );
    elementsToAnimate.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [showIntro]);

  return (
    <AuthProvider>
      <AnimatePresence>
        {showIntro && <IntroScreen key="intro" onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <>
          <Navbar onChatToggle={() => setIsChatOpen(!isChatOpen)} onSearch={setSearchTerm} searchTerm={searchTerm} />
          {createPortal(<ParticleBackground />, document.body)}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="app-container"
          >
          <main>
            <Hero 
              onOpenAdvisor={() => setIsAdvisorOpen(true)} 
              searchTerm={searchTerm} 
              onSearch={setSearchTerm} 
            />
            <StoreSection searchTerm={searchTerm} onSearch={setSearchTerm} />
            <TechBoyTrends />
            <HowItWorks />
            <div className="container">
              <StatsStrip />
            </div>
          </main>
          <Footer />
          </motion.div>
        </>
      )}

      {/* ── Chat Portal & Modals: rendered directly in <body> so position:fixed always works ── */}
      {!showIntro && createPortal(
        <AnimatePresence>
          {isChatOpen && (
            <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          )}
          {isAdvisorOpen && (
            <Suspense fallback={<div className="modal-fallback">Loading Advisor...</div>}>
              <TechAdvisorModal onClose={() => setIsAdvisorOpen(false)} />
            </Suspense>
          )}
        </AnimatePresence>,
        document.body
      )}
    </AuthProvider>
  )
}

export default App
