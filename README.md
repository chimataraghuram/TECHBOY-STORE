# 🚀 TechBoy Store: Expert Smartphone Discovery

**TechBoy Store** is a full-stack, premium responsive web application designed for high-end smartphone discovery. It features an expert-curated recommendation engine, real-time price tracking, and a sleek neon/glassmorphism UI.

## 🌟 Key Features
- **Analyst Picks**: Expert-vetted recommendations across all price ranges (Under 10k to 1 Lakh+).
- **Smart Search & Filter**: Instant filtering by budget and performance categories.
- **Comparison Engine**: Side-by-side spec comparisons for the latest devices.
- **Analytics Trackers**: Integrated referral click tracking for Amazon and Flipkart deals.
- **Dynamic DRF Backend**: Powered by Django REST Framework with JWT authentication.

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Vanilla CSS (Neon/Glassmorphism).
- **Backend**: Django 6, Django REST Framework (DRF).
- **Authentication**: JWT (SimpleJWT).
- **Database**: SQLite (Development) / PostgreSQL (Production ready).

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.12+
- Node.js 20+

### 2. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt  # (See list below)
python manage.py migrate
python manage.py populate_db     # (Seed initial expert data)
python manage.py runserver
```

### 3. Frontend Setup
```bash
npm install
npm run dev
```

## 🔒 Dependencies
- `djangorestframework`
- `djangorestframework-simplejwt`
- `django-cors-headers`
- `django-filter`
- `react`, `react-dom`, `vite`

---
Developed with ❤️ by [Chimata Raghuram](https://github.com/chimataraghuram)
