import React, { useState, useEffect } from 'react';
import PetCard from './PetCard';
import { useCookies } from 'react-cookie';

const MyPetsPage = ({ userId }) => {
  const [savedPets, setSavedPets] = useState([]);
  const [userPets, setUserPets] = useState([]);
  const [currentTab, setCurrentTab] = useState('pets');
  const [error, setError] = useState(null);
  const [cookies] = useCookies(['jwt']); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/pets/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${cookies.jwt}` 
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user pets');
        }
        const data = await response.json();
  
        setSavedPets(data.savedPets);
        setUserPets(data.adoptedPets);
      } catch (error) {
        console.error('Error fetching user pets:', error);
        setError(error.message);
      }
    };
  
    fetchData();
  }, [userId, cookies.jwt]); 

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const filteredPets = currentTab === 'saved' ? savedPets : userPets;

  return (
    <div className="container mt-4 text-center">
      <h1 className="mb-4">My Pets Page</h1>
      {error && <p>Error: {error}</p>}
      <div className="btn-group" role="group" aria-label="Basic example" style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          className={`btn btn-primary ${currentTab === 'pets' ? 'active' : ''}`}
          onClick={() => handleTabChange('pets')}
        >
          Pets
        </button>
        <button
          type="button"
          className={`btn btn-primary ${currentTab === 'saved' ? 'active' : ''}`}
          onClick={() => handleTabChange('saved')}
        >
          Saved Pets
        </button>
      </div>

      {filteredPets && filteredPets.length === 0 && (
        <p>You currently don't have any {currentTab === 'pets' ? 'pets' : 'saved pets'}.</p>
      )}

      {filteredPets && (
        <div className="card-deck d-flex flex-row">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="mb-3 me-2">
              <PetCard pet={pet} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPetsPage;
