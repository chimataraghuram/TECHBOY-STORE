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
    <div className="app-container">
      <ParticleBackground />
      <Navbar onChatToggle={() => setIsChatOpen(!isChatOpen)} onSearch={setSearchTerm} />
      <main>
        <Hero />
        <HowToUse />
        <StoreSection searchTerm={searchTerm} />
        <Features />
      </main>
      <Footer />
      <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

export default App
