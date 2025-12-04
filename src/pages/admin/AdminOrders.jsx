import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import './AdminPages.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await ordersAPI.getAllOrders();
      setOrders(res.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await ordersAPI.updateOrderStatus(id, status);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      processing: '#2196f3',
      shipped: '#9c27b0',
      delivered: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#999';
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1><i className="fas fa-shopping-cart"></i> Order Management</h1>
          <div className="filter-group" style={{ marginTop: '1rem' }}>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-table-container card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">No orders found</td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order._id}>
                  <td><strong>#{order._id.slice(-8).toUpperCase()}</strong></td>
                  <td>
                    <div>
                      <strong>{order.user?.name || 'Unknown'}</strong>
                      <br />
                      <small>{order.user?.email || ''}</small>
                    </div>
                  </td>
                  <td>{order.items.length} item(s)</td>
                  <td><strong>RM{order.totalAmount?.toFixed(2)}</strong></td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      {order.status === 'pending' && (
                        <button
                          className="btn-icon btn-success"
                          onClick={() => handleStatusUpdate(order._id, 'processing')}
                          title="Mark as Processing"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button
                          className="btn-icon btn-info"
                          onClick={() => handleStatusUpdate(order._id, 'shipped')}
                          title="Mark as Shipped"
                        >
                          <i className="fas fa-shipping-fast"></i>
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          className="btn-icon btn-success"
                          onClick={() => handleStatusUpdate(order._id, 'delivered')}
                          title="Mark as Delivered"
                        >
                          <i className="fas fa-check-circle"></i>
                        </button>
                      )}
                      {!['delivered', 'cancelled'].includes(order.status) && (
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                          title="Cancel Order"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;

