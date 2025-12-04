import React, { useState, useEffect } from 'react';
import { catsAPI, adoptionsAPI, ordersAPI, productsAPI } from '../../services/api';
import './AdminPages.css';

const AdminDashboardHome = () => {
  const [stats, setStats] = useState({
    totalCats: 0,
    totalAdoptions: 0,
    totalProducts: 0,
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentAdoptions, setRecentAdoptions] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [catsRes, adoptionsRes, ordersRes, productsRes] = await Promise.all([
        catsAPI.getAllCats(),
        adoptionsAPI.getAllRequests(),
        ordersAPI.getAllOrders(),
        productsAPI.getAllProducts()
      ]);

      const cats = catsRes.data;
      const adoptions = adoptionsRes.data;
      const orders = ordersRes.data;
      const products = productsRes.data;

      // Calculate revenue
      const totalRevenue = adoptions.reduce((sum, a) => sum + (a.adoptionFee || 0), 0) +
                          orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      // Monthly revenue (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthlyRevenue = adoptions
        .filter(a => new Date(a.createdAt) >= thirtyDaysAgo)
        .reduce((sum, a) => sum + (a.adoptionFee || 0), 0) +
        orders
        .filter(o => new Date(o.createdAt) >= thirtyDaysAgo)
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      setStats({
        totalCats: cats.length,
        totalAdoptions: adoptions.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        activeOrders: orders.filter(o => ['pending', 'processing'].includes(o.status)).length,
        totalRevenue,
        monthlyRevenue
      });

      // Recent orders and adoptions
      setRecentOrders(orders.slice(0, 5).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setRecentAdoptions(adoptions.slice(0, 5).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-home">
      <div className="page-header">
        <h1><i className="fas fa-chart-line"></i> Dashboard</h1>
        <p>Overview of your shelter operations</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon revenue">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-info">
            <h3>RM{stats.totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
            <span className="stat-sub">RM{stats.monthlyRevenue.toFixed(2)} this month</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon cats">
            <i className="fas fa-paw"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalCats}</h3>
            <p>Total Cats</p>
            <span className="stat-sub">{stats.totalAdoptions} adopted</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon orders">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
            <span className="stat-sub">{stats.activeOrders} active</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon products">
            <i className="fas fa-box"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Products</p>
            <span className="stat-sub">In catalog</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-grid">
        <div className="dashboard-card card">
          <h2><i className="fas fa-clock"></i> Recent Orders</h2>
          <div className="recent-list">
            {recentOrders.length === 0 ? (
              <p className="empty-state">No orders yet</p>
            ) : (
              recentOrders.map(order => (
                <div key={order._id} className="recent-item">
                  <div className="recent-info">
                    <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                    <span>{order.items.length} items</span>
                  </div>
                  <div className="recent-meta">
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                    <span className="recent-amount">RM{order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card card">
          <h2><i className="fas fa-heart"></i> Recent Adoptions</h2>
          <div className="recent-list">
            {recentAdoptions.length === 0 ? (
              <p className="empty-state">No adoptions yet</p>
            ) : (
              recentAdoptions.map(adoption => (
                <div key={adoption._id} className="recent-item">
                  <div className="recent-info">
                    <strong>{adoption.catId?.name || 'Unknown Cat'}</strong>
                    <span>{adoption.userId?.name || 'Unknown User'}</span>
                  </div>
                  <div className="recent-meta">
                    <span className={`status-badge status-${adoption.status}`}>
                      {adoption.status}
                    </span>
                    <span className="recent-amount">RM{adoption.adoptionFee?.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;

