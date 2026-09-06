import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion'
import React, { useState, Suspense, lazy } from 'react'
import { createPortal } from 'react-dom'
import './App.css'
import './redline.css'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StoreSection from './components/StoreSection'
const ChatPopup = lazy(() => import('./components/ChatPopup'))
const ParticleBackground = lazy(() => import('./components/ParticleBackground'))
import IntroScreen from './components/IntroScreen'
import { StatsStrip } from './components/AnimationEngine'

const TechBoyTrends = lazy(() => import('./components/TechBoyTrends'))
const Footer = lazy(() => import('./components/Footer'))

const TechAdvisorModal = lazy(() => import('./components/TechAdvisorModal'))
const TrackHub = lazy(() => import('./components/TrackHub'))

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'trackhub'

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

    const observeElements = () => {
      const elementsToAnimate = document.querySelectorAll(
        'section:not([data-observed]), .footer-section:not([data-observed]), .stats-strip-container:not([data-observed])'
      );
      elementsToAnimate.forEach(el => {
        el.setAttribute('data-observed', 'true');
        observer.observe(el);
      });
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });
    
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [showIntro, currentView]);

  return (
    <AuthProvider>
      <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {showIntro && <IntroScreen key="intro" onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <>
          <Navbar 
            onChatToggle={() => setIsChatOpen(!isChatOpen)} 
            onSearch={setSearchTerm} 
            searchTerm={searchTerm} 
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
          {createPortal(
            <Suspense fallback={null}>
              <ParticleBackground />
            </Suspense>, 
            document.body
          )}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="app-container"
          >
          <main>
            {currentView === 'home' ? (
              <>
                <Hero 
                  onOpenAdvisor={() => setIsAdvisorOpen(true)} 
                  searchTerm={searchTerm} 
                  onSearch={setSearchTerm} 
                  setCurrentView={setCurrentView}
                />
                <StoreSection searchTerm={searchTerm} onSearch={setSearchTerm} />
                
                <Suspense fallback={<div className="section-fallback shimmer-bg" style={{height: '300px', margin: '40px 0', borderRadius: '16px'}}></div>}>
                  <TechBoyTrends />
                </Suspense>

              </>
            ) : currentView === 'trackhub' ? (
              <Suspense fallback={<div className="section-fallback shimmer-bg" style={{height: '500px', margin: '120px 20px', borderRadius: '16px'}}></div>}>
                <TrackHub />
              </Suspense>
            ) : null}
          </main>
          
          <Suspense fallback={<div className="section-fallback shimmer-bg" style={{height: '200px'}}></div>}>
            <Footer setCurrentView={setCurrentView} />
          </Suspense>
          </m.div>
        </>
      )}

      {!showIntro && createPortal(
        <AnimatePresence>
          {isChatOpen && (
            <Suspense fallback={null}>
              <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            </Suspense>
          )}
          {isAdvisorOpen && (
            <Suspense fallback={<div className="modal-fallback">Loading Advisor...</div>}>
              <TechAdvisorModal onClose={() => setIsAdvisorOpen(false)} />
            </Suspense>
          )}
        </AnimatePresence>,
        document.body
      )}
      </LazyMotion>
    </AuthProvider>
  )
}

export default App
