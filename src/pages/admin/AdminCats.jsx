import React, { useState, useEffect } from 'react';
import { catsAPI } from '../../services/api';
import Modal from '../../components/Modal';
import FormInput from '../../components/FormInput';
import './AdminPages.css';

const AdminCats = () => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({
    name: '',
    breed: '',
    age: '',
    gender: 'male',
    description: '',
    adoptionFee: '',
    energyLevel: 'moderate',
    maintenanceLevel: 'moderate',
    goodWithKids: false,
    personality: 'social'
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadCats();
  }, []);

  const loadCats = async () => {
    try {
      setLoading(true);
      const res = await catsAPI.getAllCats();
      setCats(res.data);
    } catch (error) {
      console.error('Error loading cats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCatForm({
      ...catForm,
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
      formData.append('name', catForm.name);
      formData.append('breed', catForm.breed);
      formData.append('age', catForm.age);
      formData.append('gender', catForm.gender);
      formData.append('description', catForm.description);
      formData.append('adoptionFee', catForm.adoptionFee || '0');
      formData.append('traits', JSON.stringify({
        energyLevel: catForm.energyLevel,
        maintenanceLevel: catForm.maintenanceLevel,
        goodWithKids: catForm.goodWithKids,
        personality: catForm.personality
      }));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingCat) {
        await catsAPI.updateCat(editingCat._id, formData);
      } else {
        await catsAPI.createCat(formData);
      }

      setShowModal(false);
      setEditingCat(null);
      resetForm();
      loadCats();
    } catch (error) {
      console.error('Error saving cat:', error);
      alert('Failed to save cat. Please try again.');
    }
  };

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setCatForm({
      name: cat.name,
      breed: cat.breed,
      age: cat.age,
      gender: cat.gender,
      description: cat.description,
      adoptionFee: cat.adoptionFee || '',
      energyLevel: cat.traits.energyLevel,
      maintenanceLevel: cat.traits.maintenanceLevel,
      goodWithKids: cat.traits.goodWithKids,
      personality: cat.traits.personality
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cat?')) {
      try {
        await catsAPI.deleteCat(id);
        loadCats();
      } catch (error) {
        console.error('Error deleting cat:', error);
        alert('Failed to delete cat.');
      }
    }
  };

  const resetForm = () => {
    setCatForm({
      name: '',
      breed: '',
      age: '',
      gender: 'male',
      description: '',
      adoptionFee: '',
      energyLevel: 'moderate',
      maintenanceLevel: 'moderate',
      goodWithKids: false,
      personality: 'social'
    });
    setImageFile(null);
  };

  const openAddModal = () => {
    setEditingCat(null);
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
        <h1><i className="fas fa-paw"></i> Manage Cats</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="fas fa-plus"></i> Add New Cat
        </button>
      </div>

      <div className="admin-table-container card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Breed</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Personality</th>
              <th>Adoption Fee</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cats.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty-state">No cats found</td>
              </tr>
            ) : (
              cats.map(cat => (
                <tr key={cat._id}>
                  <td>
                    <img 
                      src={`/uploads/${cat.image}`} 
                      alt={cat.name}
                      className="table-thumb"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50/9b5de5/ffffff?text=Cat';
                      }}
                    />
                  </td>
                  <td><strong>{cat.name}</strong></td>
                  <td>{cat.breed}</td>
                  <td>{cat.age}y</td>
                  <td className="capitalize">{cat.gender}</td>
                  <td className="capitalize">{cat.traits.personality}</td>
                  <td>RM{cat.adoptionFee?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`status-badge ${cat.isAdopted ? 'status-rejected' : 'status-approved'}`}>
                      {cat.isAdopted ? 'Adopted' : 'Available'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(cat)}
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(cat._id)}
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
          setEditingCat(null);
          resetForm();
        }}
        title={editingCat ? 'Edit Cat' : 'Add New Cat'}
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            type="text"
            name="name"
            value={catForm.name}
            onChange={handleInputChange}
            required
          />

          <FormInput
            label="Breed"
            type="text"
            name="breed"
            value={catForm.breed}
            onChange={handleInputChange}
            required
          />

          <FormInput
            label="Age"
            type="number"
            name="age"
            value={catForm.age}
            onChange={handleInputChange}
            required
            min="0"
          />

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              value={catForm.gender}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <FormInput
            label="Description"
            type="textarea"
            name="description"
            value={catForm.description}
            onChange={handleInputChange}
            required
          />

          <FormInput
            label="Adoption Fee (RM)"
            type="number"
            name="adoptionFee"
            value={catForm.adoptionFee}
            onChange={handleInputChange}
            min="0"
            step="0.01"
          />

          <div className="form-group">
            <label className="form-label">Energy Level</label>
            <select
              name="energyLevel"
              value={catForm.energyLevel}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Maintenance Level</label>
            <select
              name="maintenanceLevel"
              value={catForm.maintenanceLevel}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Personality</label>
            <select
              name="personality"
              value={catForm.personality}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="playful">Playful</option>
              <option value="calm">Calm</option>
              <option value="independent">Independent</option>
              <option value="social">Social</option>
            </select>
          </div>

          <FormInput
            label="Good with Kids"
            type="checkbox"
            name="goodWithKids"
            value={catForm.goodWithKids}
            onChange={handleInputChange}
          />

          <div className="form-group">
            <label className="form-label">Cat Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            {editingCat ? 'Update Cat' : 'Add Cat'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCats;

