import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  const categories = [
    { value: '', label: 'All Products' },
    { value: 'food', label: 'Food' },
    { value: 'toys', label: 'Toys' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'grooming', label: 'Grooming' },
    { value: 'health', label: 'Health' },
    { value: 'furniture', label: 'Furniture' }
  ];

  useEffect(() => {
    loadProducts();
  }, [category, search]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      
      const res = await productsAPI.getAllProducts(params);
      setProducts(res.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Show a quick notification
    const btn = document.querySelector(`[data-product-id="${product._id}"]`);
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = 'Added!';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('added');
      }, 1000);
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
    <div className="shop-page">
      <div className="shop-hero">
        <h1><i className="fas fa-shopping-bag"></i> Cat Supplies Shop</h1>
        <p>Everything your feline friend needs</p>
      </div>

      <div className="container">
        <div className="shop-filters">
          <div className="filter-group">
            <label htmlFor="search">
              <i className="fas fa-search"></i> Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="category">
              <i className="fas fa-filter"></i> Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="products-grid">
         
          {products.length === 0 ? (
            <div className="no-products">
              <i className="fas fa-box-open"></i>
              <p>No products found</p>
            </div>
          ) : (
            products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img
                    src={`/uploads/${product.image}`}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300/9b5de5/ffffff?text=Product';
                    }}
                  />
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="low-stock-badge">Only {product.stock} left!</span>
                  )}
                  {product.stock === 0 && (
                    <span className="out-of-stock-badge">Out of Stock</span>
                  )}
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">RM{product.price.toFixed(2)}</span>
                    <button
                      className="btn btn-primary btn-sm"
                      data-product-id={product._id}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <i className="fas fa-cart-plus"></i> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
           <br />
        </div>
      </div>
    </div>
  );
};

export default Shop;

