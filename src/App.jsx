import { lazy } from 'react';
import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LoadingProvider } from './contexts/LoadingContext';
import ErrorBoundary from './components/ErrorBoundary';
import LazyLoad from './components/LazyLoad';
import Header from './components/Header';
import Home from './pages/Home';
import { Spinner } from './components/ui';
import AdminProtected from './components/admin/AdminProtected';
import ScrollToTop from "./components/ScrollToTop";


// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Submit = lazy(() => import('./pages/Submit'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Payment = lazy(() => import('./pages/Payment'));
const About = lazy(() => import('./pages/About'));
const Categories = lazy(() => import('./pages/Categories'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Guidelines = lazy(() => import('./pages/Guidelines'));
const FAQ = lazy(() => import('./pages/FAQ'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const Registrations = lazy(() => import('./pages/admin/Registrations'));
const ManageEvents = lazy(() => import('./pages/admin/ManageEvents'));
const Events = lazy(() => import('./pages/admin/Events'));
const Discounts = lazy(() => import('./pages/admin/Discounts'));

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size="large" label="Loading..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <LazyLoad>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/submit" 
          element={
            <ProtectedRoute>
              <Submit />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment" 
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <AdminProtected>
              <AdminDashboard />
            </AdminProtected>
          } 
        />
        <Route 
          path="/admin/registrations" 
          element={
            <AdminProtected>
              <Registrations />
            </AdminProtected>
          } 
        />
        <Route 
          path="/admin/submission-events" 
          element={
            <AdminProtected>
              <Events />
            </AdminProtected>
          } 
        />
        <Route 
          path="/admin/events" 
          element={
            <AdminProtected>
              <ManageEvents />
            </AdminProtected>
          } 
        />
        <Route 
          path="/admin/discounts" 
          element={
            <AdminProtected>
              <Discounts />
            </AdminProtected>
          } 
        />
      </Routes>
    </LazyLoad>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ScrollToTop />
        <NotificationProvider>
          <LoadingProvider>
            <AuthProvider>
              <AdminProvider>
                <StarfieldBackground />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <Header />
                  <AppRoutes />
                </div>
              </AdminProvider>
            </AuthProvider>
          </LoadingProvider>
        </NotificationProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

// Starfield Background Component
function StarfieldBackground() {
  const canvasRef = React.useRef(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const stars = [];
    const starCount = 200;
    
    // Create stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01
      });
    }
    
    let animationFrame;
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        // Twinkle effect
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0.3) {
          star.twinkleSpeed *= -1;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });
      
      animationFrame = requestAnimationFrame(animate);
    }
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}
