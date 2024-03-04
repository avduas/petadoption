import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PetForm from './PetForm';

const AddPetPage = () => {
  const navigate = useNavigate();

  const handleAddPet = async (newPetData) => {
    try {
      console.log("JSON being sent:", newPetData); 

      const response = await fetch('https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPetData),
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
    <div className="container mt-4">
      <h1 className="mb-4">Add Pet</h1>
      <PetForm onSubmit={handleAddPet} />
    </div>
  );
};

export default AddPetPage;
