import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PetForm = ({ onSubmit }) => {
  const [petData, setPetData] = useState({
    type: '',
    name: '',
    adoption_status: '',
    picture_url: '',
    height: '',
    weight: '',
    color: '',
    bio: '',
    hypoallergenic: false,
    dietary_restrictions: '',
    breed: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPetData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('type', petData.type);
      formData.append('name', petData.name);
      formData.append('adoption_status', petData.adoption_status);
      formData.append('height', petData.height);
      formData.append('weight', petData.weight);
      formData.append('color', petData.color);
      formData.append('bio', petData.bio);
      formData.append('hypoallergenic', petData.hypoallergenic);
      formData.append('dietary_restrictions', petData.dietary_restrictions);
      formData.append('breed', petData.breed);
      formData.append('picture_url', selectedFile);

      const response = await fetch('https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/pets', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Pet added successfully');
        navigate('/dashboard');
      } else {
        console.error('Failed to add pet');
      }
    } catch (error) {
      console.error('Error adding pet:', error);
    }
  };


  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="mb-3">
        <label className="form-label">Type:</label>
        <input
          type="text"
          className="form-control"
          name="type"
          value={petData.type}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Name:</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={petData.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Adoption Status:</label>
        <select
          className="form-select"
          name="adoption_status"
          value={petData.adoption_status}
          onChange={handleInputChange}
        >
          <option value="">Select Adoption Status</option>
          <option value="Adopted">Adopted</option>
          <option value="Fostered">Fostered</option>
          <option value="Available">Available</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Picture:</label>
        <input
          type="file"
          className="form-control"
          name="picture_url"
          onChange={(e) => {
            handleInputChange(e);
            handleImageChange(e);
          }}
          accept="image/*"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Pet Preview"
            className="img-fluid mt-2"
            style={{ maxHeight: '300px' }}
          />
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Height (cm):</label>
        <input
          type="text"
          className="form-control"
          name="height"
          value={petData.height}
          onChange={handleInputChange}
          pattern="[0-9]*"
          placeholder="Only numbers"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Weight (kg):</label>
        <input
          type="text"
          className="form-control"
          name="weight"
          value={petData.weight}
          onChange={handleInputChange}
          pattern="[0-9.]*"
          placeholder="Only numbers"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Color:</label>
        <input
          type="text"
          className="form-control"
          name="color"
          value={petData.color}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Bio:</label>
        <input
          type="text"
          className="form-control"
          name="bio"
          value={petData.bio}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          name="hypoallergenic"
          checked={petData.hypoallergenic}
          onChange={handleInputChange}
        />
        <label className="form-check-label">Hypoallergenic</label>
      </div>
      <div className="mb-3">
        <label className="form-label">Dietary Restrictions:</label>
        <input
          type="text"
          className="form-control"
          name="dietary_restrictions"
          value={petData.dietary_restrictions}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Breed:</label>
        <input
          type="text"
          className="form-control"
          name="breed"
          value={petData.breed}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Add Pet
      </button>
    </form>
  );

};

export default PetForm;
