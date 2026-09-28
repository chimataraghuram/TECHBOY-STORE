# TECHBOY STORE

TECHBOY STORE is a full-stack smartphone discovery and price-tracking application. It combines a React/Vite storefront with a Django REST API, product comparison, wishlist and watchlist features, AI-assisted recommendations, Google authentication, and configurable price alerts.

## Live project

- Website: <https://techboy-store.vercel.app/>
- Repository: <https://github.com/chimataraghuram/TECHBOY-STORE>

## Features

- Responsive neon/glassmorphism smartphone catalog.
- Product search, category filtering, budget filtering, sorting, quick view, and deep links.
- Side-by-side comparison for up to three phones.
- Wishlist, recently viewed products, watchlist, and TrackHub.
- Google sign-in through Firebase Authentication.
- AI assistant with NVIDIA NIM integration and a local fallback response path.
- Trending products and engagement analytics.
- Target-price and price-change alerts for guests and signed-in users.
- Database-level duplicate prevention and notification checkpointing.
- PWA support and responsive mobile layouts.

## Technology stack

### Frontend

React 19, Vite, Framer Motion, Three.js/React Three Fiber, Tailwind CSS, Firebase Authentication, and ESLint.

### Backend

Django, Django REST Framework, SQLite or PostgreSQL, Simple JWT, Firebase Admin, Django Q2, SMTP, Gunicorn, and WhiteNoise.

## Repository layout

```text
TECHBOY-STORE/
├── backend/
│   ├── api/
│   │   ├── migrations/        # Database migrations
│   │   ├── services/          # Alert and business-logic services
│   │   ├── management/        # Custom Django commands
│   │   ├── models.py          # Users, products, alerts, history, watchlists
│   │   ├── serializers.py     # REST representations and validation
│   │   ├── views.py           # API viewsets and endpoints
│   │   ├── signals.py         # Price-history alert triggers
│   │   └── urls.py            # API routes
│   ├── core/                  # Django settings and URL configuration
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/        # Store, catalog, auth, alert, and modal UI
│   │   ├── context/           # Authentication and application state
│   │   ├── data/              # Local product fallback data
│   │   ├── hooks/             # Reusable React hooks
│   │   ├── utils/             # Images, links, haptics, and recent views
│   │   └── workers/           # Background client-side work
│   ├── public/                # Public static assets
│   ├── package.json
│   └── vite.config.js
├── images/                    # Shared source assets
├── scripts/                   # Data and maintenance scripts
├── workflows/                 # Workflow definitions and automation assets
├── .github/workflows/         # CI and scheduled deal updates
├── docker-compose.yml
├── render.yaml
└── README.md
```

## Local setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
```

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API runs at `http://127.0.0.1:8000/api/`.

## Environment variables

Create `frontend/.env.local` with the Firebase web configuration and backend URL:

```env
VITE_BACKEND_URL=http://127.0.0.1:8000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

For Gmail SMTP, configure deployment secrets only; never commit them:

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_gmail_app_password
DEFAULT_FROM_EMAIL=TechBoy Store <your_email@gmail.com>
```

Use a Google App Password with two-step verification enabled. Do not use the normal Google account password.

## Price alerts

Alerts are stored by email and product. Repeated submissions update the existing alert instead of creating duplicates. When price history is created, the service finds matching active alerts, skips the same notification checkpoint or a price rebound, sends an HTML email, records the notified price and timestamp, and keeps the alert active for later lower prices.

After deployment, apply migrations:

```bash
python manage.py migrate
```

The deduplication and checkpoint migration is `0007_pricealert_checkpoints_and_unique.py`.

## Scheduled updates and deployment

`.github/workflows/update_deals.yml` runs the deal updater on a schedule. Configure its repository secrets and backend URL before enabling production notifications.

- Frontend: Vercel or another static Vite host using `npm run build`.
- Backend: Render, PythonAnywhere, or another Django host using Gunicorn.
- Database: SQLite for local use; PostgreSQL is recommended for production.
- Firebase: enable Google sign-in and add every local and deployed domain to Authentication authorized domains.

## Verification checklist

```bash
cd frontend
npm run lint
npm run build

cd ../backend
python -m compileall -q .
python manage.py check
python manage.py migrate --check
```

For end-to-end alert testing, sign in or use a guest email, create the same alert twice, confirm one alert exists, create a lower price-history entry, and verify one email plus a stored checkpoint.

## Contributing

1. Create a feature branch.
2. Make a focused change.
3. Run the frontend and backend checks.
4. Open a pull request with screenshots for UI changes.

## Author

**Chimata Raghuram** — [GitHub](https://github.com/chimataraghuram) · [LinkedIn](https://www.linkedin.com/in/chimataraghuram/)

## License

This project is distributed under the MIT License.
