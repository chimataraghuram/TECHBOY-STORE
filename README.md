<div align="center">

  <img src="src/assets/techboy-logo.jpg" alt="TechBoy Logo" width="120" style="border-radius: 50%; box-shadow: 0 0 20px rgba(255, 140, 66, 0.4); border: 2px solid #ff8c42;">

  # <span style="color: #ff8c42;">TECHBOY STORE</span>
  
  **The Ultimate Expert-Curated Smartphone Discovery Platform**

  [![Live Demo](https://img.shields.io/badge/Live-Demo-ff8c42?style=for-the-badge&logoColor=white)](https://chimataraghuram.github.io/TECHBOY-STORE/)
  [![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-white?style=for-the-badge&logo=github&logoColor=black)](https://github.com/chimataraghuram/TECHBOY-STORE)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://opensource.org/licenses/MIT)

  > `⚡ Smart Analyst Picks for Every Budget`  
  > `🔍 Real-Time Pricing and Deal Tracking`  
  > `⚖️ Seamless Side-by-Side Comparison Engine`

  **A full-stack, premium responsive web application designed for high-end smartphone discovery. It bridges the gap between expert advice and e-commerce availability with a stunning neon aesthetic.**

</div>

---

## 🌐 Live Demo
You can explore the live interface here: [https://chimataraghuram.github.io/TECHBOY-STORE/](https://chimataraghuram.github.io/TECHBOY-STORE/)

> "Empowering users to find the best tech deals with zero marketing fluff, just pure performance data."

---

## 🖼️ Project Screenshots

<div align="center">
  <h3>🚀 Hero Section</h3>
  <p>Vibrant Neon Landing Page with Interactive 3D Particles and high-impact CTAs.</p>
  <img src="https://placehold.co/800x400/100000/ff8c42?text=Hero+Dynamic+Dashboard" width="800" style="border-radius: 12px; border: 1px solid rgba(255, 69, 0, 0.2);">
  
  <br /><br />
  
  <h3>📊 Analyst Picks</h3>
  <p>Dynamic filtered product cards with real-time deal links and performance tags.</p>
  <img src="https://placehold.co/800x400/100000/ff8c42?text=Expert+Recommendations+Grid" width="800" style="border-radius: 12px; border: 1px solid rgba(255, 69, 0, 0.2);">
  
  <br /><br />
  
  <h3>⚖️ Comparison Engine</h3>
  <p>Semi-transparent side-by-side spec comparison table for deep technical analysis.</p>
  <img src="https://placehold.co/800x400/100000/ff8c42?text=Comparison+Engine+Modal" width="800" style="border-radius: 12px; border: 1px solid rgba(255, 69, 0, 0.2);">
  
  <br /><br />
  
  <h3>🔐 Auth Experience</h3>
  <p>Clean Glassmorphism-style Login & Registration with JWT session management.</p>
  <img src="https://placehold.co/800x400/100000/ff8c42?text=Premium+Identity+System" width="800" style="border-radius: 12px; border: 1px solid rgba(255, 69, 0, 0.2);">
  
  <br /><br />
  
  <h3>📈 Analytics View</h3>
  <p>Backend dashboard tracking user engagement, referral trends, and click analytics.</p>
  <img src="https://placehold.co/800x400/100000/ff8c42?text=Admin+Click+Tracking+Panel" width="800" style="border-radius: 12px; border: 1px solid rgba(255, 69, 0, 0.2);">
</div>

---

## ✨ Features

| Icon | Feature | Description |
| :--- | :--- | :--- |
| 📱 | **Analyst Picks** | Multi-category budget-vetted recommendations (Under 10k to Flagship). |
| ⚖️ | **Smart Comparison** | Overlay comparison engine for a detailed spec-by-spec breakdown. |
| 📈 | **Weighted Trending** | Advanced sorting logic using recent (24h) and total click momentum. |
| 🧠 | **Smart Recommendations** | AI-like similarity matching based on price buffers and categories. |
| 📊 | **Analytics Suite** | Real-time tracking of referral sources and top product engagement. |
| 🔐 | **JWT Integration** | Secure account management with personalized search and profiles. |
| ⚡ | **DRF Caching** | Server-side LocMem caching for lightning-fast API response times. |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Core with Context API
- **Vite** - High-performance build tooling
- **Vanilla CSS** - Premium Neon Styling & Glassmorphism
- **Framer Motion** - Smooth micro-animations

### Backend (Production-Grade)
- **Django 6** - Robust Backend Framework
- **DRF (REST Framework)** - Scalable API Layer
- **Service Layer Architecture** - Decoupled business logic (Services/Views)
- **Caching & Throttling** - High-speed LocMemCache and API rate limiting
- **SQLite / PostgreSQL** - Enterprise-ready database design
- **Gunicorn** - Production-grade WSGI server

---

## 📂 Project Structure

```text
TECHBOY-STORE/
├── backend/                # Django REST API (Production Setup)
│   ├── api/                
│   │   ├── services/       # Decoupled Business Logic (Analytics, Products)
│   │   ├── models.py       # Optimized DB Models with Indexing
│   │   ├── views.py        # Thin ViewSet Layer
│   │   ├── serializers.py  # Advanced Data Transform Layer (Score Logic)
│   │   └── exceptions.py   # Global Unified JSON Error Handler
│   └── core/               # Central Config (Logging, Cache, Throttle)
├── src/                    # React Frontend
│   ├── components/         # Modular UI Components
│   └── App.css             # Neon/Glassmorphism Design System
└── README.md               # Production Documentation
```

---

## 🛣️ Future Roadmap
- [ ] **AI Chatbot**: Integrate a Llama-3 based assistant for personalized advice.
- [ ] **Global Price Alert**: Email notifications for price drops on watched devices.
- [ ] **Deployment**: One-click deploy configuration for AWS/Render.

---

## 🤝 Contributing
1. **Fork** the repository.
2. Create your **Feature Branch** (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4. **Push** to the branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.

---

## 📜 License
Distributed under the **MIT License**. See `LICENSE` for more information.  
*Note: Please give appropriate credit if you use this UI template.*

---

## 👨‍💻 Author
**Chimata Raghuram**  
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/chimataraghuram)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/chimataraghuram)

<div align="center">
  <br />
  Built with ❤️ by <b>Chimata Raghuram</b>
</div>
