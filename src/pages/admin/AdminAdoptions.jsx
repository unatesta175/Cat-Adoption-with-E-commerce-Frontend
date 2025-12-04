import React, { useState, useEffect } from 'react';
import { adoptionsAPI } from '../../services/api';
import './AdminPages.css';

const AdminAdoptions = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadAdoptions();
  }, []);

  const loadAdoptions = async () => {
    try {
      setLoading(true);
      const res = await adoptionsAPI.getAllRequests();
      setAdoptions(res.data);
    } catch (error) {
      console.error('Error loading adoptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adoptionsAPI.updateStatus(id, status);
      loadAdoptions();
    } catch (error) {
      console.error('Error updating adoption status:', error);
      alert('Failed to update adoption status.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      paid: '#2196f3',
      processing: '#9c27b0',
      completed: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#999';
  };

  const filteredAdoptions = filterStatus === 'all' 
    ? adoptions 
    : adoptions.filter(adoption => adoption.status === filterStatus);

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
          <h1><i className="fas fa-heart"></i> Adoption Management</h1>
          <div className="filter-group" style={{ marginTop: '1rem' }}>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-table-container card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cat</th>
              <th>Adopter</th>
              <th>Adoption Fee</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdoptions.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">No adoptions found</td>
              </tr>
            ) : (
              filteredAdoptions.map(adoption => (
                <tr key={adoption._id}>
                  <td>
                    <div className="table-cat-info">
                      <img 
                        src={`/uploads/${adoption.catId?.image || 'default-cat.jpg'}`} 
                        alt={adoption.catId?.name}
                        className="table-thumb"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50/9b5de5/ffffff?text=Cat';
                        }}
                      />
                      <div>
                        <strong>{adoption.catId?.name || 'Unknown'}</strong>
                        <br />
                        <small>{adoption.catId?.breed || ''}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>{adoption.userId?.name || 'Unknown'}</strong>
                      <br />
                      <small>{adoption.userId?.email || ''}</small>
                    </div>
                  </td>
                  <td><strong>RM{adoption.adoptionFee?.toFixed(2) || '0.00'}</strong></td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(adoption.status) }}
                    >
                      {adoption.status}
                    </span>
                  </td>
                  <td>{new Date(adoption.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      {adoption.status === 'paid' && (
                        <button
                          className="btn-icon btn-success"
                          onClick={() => handleStatusUpdate(adoption._id, 'processing')}
                          title="Mark as Processing"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      {adoption.status === 'processing' && (
                        <button
                          className="btn-icon btn-success"
                          onClick={() => handleStatusUpdate(adoption._id, 'completed')}
                          title="Mark as Completed"
                        >
                          <i className="fas fa-check-circle"></i>
                        </button>
                      )}
                      {!['completed', 'cancelled'].includes(adoption.status) && (
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleStatusUpdate(adoption._id, 'cancelled')}
                          title="Cancel Adoption"
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

export default AdminAdoptions;

