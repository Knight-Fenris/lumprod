# LUMIERE 2026 🎬

A modern, production-ready film festival submission platform for the LUMIERE Film Festival 2026 at PEC Chandigarh.

**Live Site**: [https://lumierepdc.web.app](https://lumierepdc.web.app)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-purple.svg)](https://vitejs.dev/)

## ✨ Features

### Core Functionality
- 🎥 **Film Submission Portal** - Multi-step form with validation and file upload
- 🔐 **Authentication System** - Secure Firebase Auth with email/password
- 📊 **User Dashboard** - Track submission status and manage films
- 🎬 **Category Browsing** - Explore different film categories
- 📅 **Festival Schedule** - Interactive event calendar
- ⏱️ **Live Countdown** - Real-time countdown to festival dates

### User Experience
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🎨 **Modern Design** - Black & white monochrome theme with premium typography
- ♿ **Accessibility** - WCAG 2.1 Level AA compliant
- 🚀 **Performance** - Code splitting, lazy loading, optimized assets
- 💾 **PWA Support** - Install as app with offline capabilities
- 🔔 **Toast Notifications** - User-friendly feedback system

### Developer Features
- 🏗️ **Component Library** - Reusable UI components (Button, Card, Modal, Input, etc.)
- 🎣 **Custom Hooks** - useForm, useAsync, useFetch, useMediaQuery, and more
- 📦 **Service Layer** - Clean API abstraction with error handling
- 🛠️ **Utility Functions** - Validators, formatters, image optimization
- 📊 **Analytics** - Google Analytics integration
- 📈 **Performance Monitoring** - Core Web Vitals tracking
- 🐛 **Error Boundary** - Graceful error handling
- 📝 **Logging System** - Centralized logging with levels

## 🏗️ Tech Stack

- **Frontend**: React 18.3.1 with hooks
- **Build Tool**: Vite 5.4.21
- **Routing**: React Router v6
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Cloud Storage
- **Hosting**: Firebase Hosting
- **Styling**: Custom CSS with CSS Variables
- **State Management**: React Context API
- **Type Checking**: PropTypes
- **Code Quality**: ESLint + Prettier

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── firebase.js     # Firebase config
│   │   ├── AuthContext.jsx # Auth provider
│   │   └── styles.css      # Global styles
│   └── .env.example        # Environment template
├── firestore/              # Firestore rules & indexes
├── firebase.json           # Firebase config
└── frontend details.md     # Event details reference
```

## Local Development

### Prerequisites

- Node.js 18+
- Firebase account with project created

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lumiere-website.git
   cd lumiere-website
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Configure Firebase**
   
   Create `client/.env` from the example:
   ```bash
   cp client/.env.example client/.env
   ```
   
   Fill in your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Firebase Hosting

```bash
# Build the client
cd client
npm run build

# Deploy (from root directory)
cd ..
firebase deploy --only "hosting,firestore"
```

## Event Details

- **Event**: LUMIERE 2026 - Student Film Festival
- **Theme**: "Stories That Matter: Cinema for Social Change"
- **Dates**: March 20-22, 2026
- **Venue**: PEC Chandigarh

### Competition Categories

| Category | Duration | Fee |
|----------|----------|-----|
| The Northern Ray | 5-20 min | ₹499 |
| Prism Showcase | 5-15 min | ₹599 |
| Lumiere Sprint | 3-7 min | ₹200 |
| Vertical Ray | 60 sec | ₹149 |

## License

MIT License - See [LICENSE](LICENSE) for details.

## Contact

- **Email**: pdc@pec.edu.in
- **Instagram**: [@lumierepec](https://instagram.com/lumierepec)
