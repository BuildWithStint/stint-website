import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TeamProvider } from './contexts/TeamContext';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import {
  CustomCursor,
  Nav,
  Hero,
  Ticker,
  Manifesto,
  Services,
  Work,
  Team,
  WhyUs,
  Contact,
  FeedbackTicker,
  Footer,
} from "./components";

function HomePage() {
  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden cursor-none">
      <CustomCursor />
      <Nav />
      <Hero />
      <Ticker />
      <Manifesto />
      <Services />
      <Work />
      <Team />
      <WhyUs />
      <Contact />
      <FeedbackTicker />
      <Footer />
    </div>
  );
}

// Component to handle /admin redirect logic
function AdminRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  // If user is logged in and is admin, redirect to dashboard
  if (user && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If not logged in or not admin, redirect to login
  return <Navigate to="/admin/login" replace />;
}

export function App() {
  return (
    <AuthProvider>
      <TeamProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminRedirect />} />
            <Route path="/admin/" element={<AdminRedirect />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </TeamProvider>
    </AuthProvider>
  );
}
