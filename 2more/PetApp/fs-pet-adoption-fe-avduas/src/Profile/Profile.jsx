import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
  });

  const [cookies] = useCookies(['jwt']);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.phone || !formData.bio) {
      console.error('All fields are required.');
      return;
    }

    try {
      const userId = cookies.jwt;
      const response = await fetch(`https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.jwt}`
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };



  return (
    <div className="container mt-4">
      <h1 className="mb-4">Profile Settings</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>First Name:</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Last Name:</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Phone Number:</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Bio:</label>
          <textarea
            className="form-control"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
