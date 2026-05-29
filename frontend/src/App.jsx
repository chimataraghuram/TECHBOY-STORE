import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, Suspense, lazy } from 'react'
import { createPortal } from 'react-dom'
import './App.css'
import './redline.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StoreSection from './components/StoreSection'
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

  return (
    <>
      <AnimatePresence>
        {showIntro && <IntroScreen key="intro" onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <>
          <Navbar onChatToggle={() => setIsChatOpen(!isChatOpen)} onSearch={setSearchTerm} searchTerm={searchTerm} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="app-container"
          >
            <ParticleBackground />
          <main>
            <Hero 
              onOpenAdvisor={() => setIsAdvisorOpen(true)} 
              searchTerm={searchTerm} 
              onSearch={setSearchTerm} 
            />
            <StoreSection searchTerm={searchTerm} onSearch={setSearchTerm} />
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
    </>
  )
}

export default App
