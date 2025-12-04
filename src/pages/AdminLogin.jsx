import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import './Auth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const user = await login(formData.email, formData.password);
      
      // Check if user is actually an admin
      if (user.role !== 'admin') {
        setError('Access denied. Admin credentials required.');
        return;
      }
      
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page py-5">
      <div className="container">
        <div className="auth-container">
          <div className="auth-header">
            <i className="fas fa-user-shield"></i>
            <h1>Admin Login</h1>
            <p>Access the shelter management dashboard</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <FormInput
              label="Admin Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              required
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
              {loading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Are you an adopter? <Link to="/login">Login here</Link></p>
          </div>

          <div className="demo-credentials">
            <p><strong>Demo Admin:</strong></p>
            <p>Email: ilyas@gmail.com | Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;




