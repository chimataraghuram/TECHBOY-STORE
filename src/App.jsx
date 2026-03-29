import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StoreSection from './components/StoreSection'
import HowToUse from './components/HowToUse'
import Features from './components/Features'
import Footer from './components/Footer'
import ChatPopup from './components/ChatPopup'
import ParticleBackground from './components/ParticleBackground'

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="app-container"
    >
      <ParticleBackground />
      <Navbar onChatToggle={() => setIsChatOpen(!isChatOpen)} onSearch={setSearchTerm} />
      <main>
        <Hero />
        <HowToUse />
        <StoreSection searchTerm={searchTerm} />
        <Features />
      </main>
      <Footer />
      <AnimatePresence>
        {isChatOpen && <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
      </AnimatePresence>
    </motion.div>
  )
}

export default App
