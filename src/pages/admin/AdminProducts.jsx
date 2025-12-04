import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import Modal from '../../components/Modal';
import FormInput from '../../components/FormInput';
import './AdminPages.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'food',
    stock: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productsAPI.getAllProducts();
      setProducts(res.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm({
      ...productForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('stock', productForm.stock);
      formData.append('isActive', productForm.isActive);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingProduct) {
        await productsAPI.updateProduct(editingProduct._id, formData);
      } else {
        await productsAPI.createProduct(formData);
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      isActive: product.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'food',
      stock: '',
      isActive: true
    });
    setImageFile(null);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

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
        <h1><i className="fas fa-box"></i> Manage Products</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="fas fa-plus"></i> Add New Product
        </button>
      </div>

      <div className="admin-table-container card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">No products found</td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product._id}>
                  <td>
                    <img 
                      src={`/uploads/${product.image}`} 
                      alt={product.name}
                      className="table-thumb"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50/9b5de5/ffffff?text=Product';
                      }}
                    />
                  </td>
                  <td><strong>{product.name}</strong></td>
                  <td className="capitalize">{product.category}</td>
                  <td>RM{product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-badge ${product.isActive ? 'status-approved' : 'status-rejected'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(product)}
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(product._id)}
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
          resetForm();
        }}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            type="text"
            name="name"
            value={productForm.name}
            onChange={handleInputChange}
            required
          />

          <FormInput
            label="Description"
            type="textarea"
            name="description"
            value={productForm.description}
            onChange={handleInputChange}
            required
          />

          <FormInput
            label="Price (RM)"
            type="number"
            name="price"
            value={productForm.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
          />

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              value={productForm.category}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="food">Food</option>
              <option value="toys">Toys</option>
              <option value="accessories">Accessories</option>
              <option value="grooming">Grooming</option>
              <option value="health">Health</option>
              <option value="furniture">Furniture</option>
            </select>
          </div>

          <FormInput
            label="Stock"
            type="number"
            name="stock"
            value={productForm.stock}
            onChange={handleInputChange}
            required
            min="0"
          />

          <FormInput
            label="Active"
            type="checkbox"
            name="isActive"
            value={productForm.isActive}
            onChange={handleInputChange}
          />

          <div className="form-group">
            <label className="form-label">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProducts;

