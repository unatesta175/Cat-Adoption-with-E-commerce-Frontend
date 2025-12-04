import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import CatDetails from './pages/CatDetails';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import AdminCats from './pages/admin/AdminCats';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminAdoptions from './pages/admin/AdminAdoptions';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdoptionCheckout from './pages/AdoptionCheckout';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={adminOnly ? "/admin/login" : "/login"} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout wrapper to conditionally render navbar
const Layout = ({ children, isAdminRoute }) => {
  const { isAdmin } = useAuth();
  
  return (
    <div className="app">
      {isAdminRoute || isAdmin ? <AdminNavbar /> : <Navbar />}
      {children}
    </div>
  );
};

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with User Navbar */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/browse" element={<Layout><Browse /></Layout>} />
        <Route path="/cats/:id" element={<Layout><CatDetails /></Layout>} />
        <Route path="/shop" element={<Layout><Shop /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Layout isAdminRoute><AdminLogin /></Layout>} />

        {/* Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/checkout"
          element={
            <Layout>
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/orders"
          element={
            <Layout>
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/adopt/:id/checkout"
          element={
            <Layout>
              <ProtectedRoute>
                <AdoptionCheckout />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminDashboardHome />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cats"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminCats />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/adoptions"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminAdoptions />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

