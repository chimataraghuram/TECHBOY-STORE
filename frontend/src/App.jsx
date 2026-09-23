import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion'
import React, { useState, Suspense, lazy } from 'react'
import { createPortal } from 'react-dom'
import './App.css'
import './redline.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StoreSection from './components/StoreSection'
const ChatPopup = lazy(() => import('./components/ChatPopup'))
const ParticleBackground = lazy(() => import('./components/ParticleBackground'))
import IntroScreen from './components/IntroScreen'

const TechBoyTrends = lazy(() => import('./components/TechBoyTrends'))
const Footer = lazy(() => import('./components/Footer'))

const TechAdvisorModal = lazy(() => import('./components/TechAdvisorModal'))
const TrackHub = lazy(() => import('./components/TrackHub'))
const ProfilePage = lazy(() => import('./components/ProfilePage'))

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [profileTab, setProfileTab] = useState('profile');

  // Support navigating to profile with a specific tab
  const handleViewChange = (view, tab) => {
    setCurrentView(view);
    if (view === 'profile' && tab) {
      setProfileTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        'section:not([data-observed]), .footer-section:not([data-observed])'
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
            setCurrentView={handleViewChange}
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
            className="app-container pb-mobile-dock pb-24 lg:pb-0"
          >
          <main>
            <AnimatePresence mode="wait">
              {currentView === 'home' ? (
                <m.div
                  key="home"
                  initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Hero 
                    onOpenAdvisor={() => setIsAdvisorOpen(true)} 
                    searchTerm={searchTerm} 
                    onSearch={setSearchTerm} 
                    setCurrentView={handleViewChange}
                  />
                  <StoreSection searchTerm={searchTerm} onSearch={setSearchTerm} />
                  <Suspense fallback={<div className="section-fallback shimmer-bg" style={{height: '300px', margin: '40px 0', borderRadius: '16px'}}></div>}>
                    <TechBoyTrends />
                  </Suspense>
                </m.div>
              ) : currentView === 'trackhub' ? (
                <m.div
                  key="trackhub"
                  initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Suspense fallback={<div className="section-fallback shimmer-bg" style={{height: '500px', margin: '120px 20px', borderRadius: '16px'}}></div>}>
                    <TrackHub />
                  </Suspense>
                </m.div>
              ) : currentView === 'profile' ? (
                <m.div
                  key={`profile-${profileTab}`}
                  initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Suspense fallback={<div className="section-fallback shimmer-bg" style={{height: '500px', margin: '120px 20px', borderRadius: '16px'}}></div>}>
                    <ProfilePage setCurrentView={handleViewChange} initialTab={profileTab} onSearch={setSearchTerm} />
                  </Suspense>
                </m.div>
              ) : null}
            </AnimatePresence>
          </main>
          
          <Suspense fallback={<div className="section-fallback shimmer-bg" style={{height: '200px'}}></div>}>
            <Footer setCurrentView={handleViewChange} />
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
  )
}

export default App