import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <i className="fas fa-cat"></i>
          <span>Purrfect Match</span>
        </div>
        <div className="admin-badge">
          <i className="fas fa-user-shield"></i>
          <span>Admin</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/admin/dashboard" 
          end
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <i className="fas fa-chart-line"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/admin/cats" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <i className="fas fa-paw"></i>
          <span>Cats</span>
        </NavLink>

        <NavLink 
          to="/admin/products" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <i className="fas fa-box"></i>
          <span>Products</span>
        </NavLink>

        <NavLink 
          to="/admin/orders" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <i className="fas fa-shopping-cart"></i>
          <span>Orders</span>
        </NavLink>

        <NavLink 
          to="/admin/adoptions" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <i className="fas fa-heart"></i>
          <span>Adoptions</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

