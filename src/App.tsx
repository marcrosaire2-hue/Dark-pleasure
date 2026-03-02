import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/Login';
import ShopPage from './pages/Shop';
import AdminDashboard from './pages/Admin';
import ProfilePage from './pages/Profile';
import ProductDetailPage from './pages/ProductDetail';
import LandingPage from './pages/Landing';
import CGVPage from './pages/CGV';
import ConfidentialityPage from './pages/Confidentiality';
import ContactPage from './pages/Contact';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-erotic-black">
        <Loader2 className="w-12 h-12 animate-spin text-erotic-gold" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={role === 'admin' ? '/admin' : '/shop'} />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cgv" element={<CGVPage />} />
        <Route path="/confidentiality" element={<ConfidentialityPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Protected Routes */}
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={user && role === 'admin' ? <AdminDashboard /> : <Navigate to="/shop" />} />
      </Routes>
    </Router>
  );
}
