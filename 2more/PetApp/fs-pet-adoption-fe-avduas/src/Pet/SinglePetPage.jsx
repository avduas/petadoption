import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const SinglePetPage = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [cookies] = useCookies(['jwt']);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await fetch(`https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/pets/${petId}`, {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`
          }
        });
        if (!response.ok) {
          throw new Error('Pet not found');
        }
        const petData = await response.json();
        console.log('Server respond:', petData); 
        setPet(petData);
        if ('isOwner' in petData) {
          setIsOwner(petData.isOwner);
        }
      } catch (error) {
        console.error('Error fetching pet:', error.message);
      }
    };
  
    fetchPet();
  }, [petId, cookies.jwt]);

  const handleAdopt = async () => {
    try {
      const response = await fetch(`https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/pets/${petId}/adopt`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.jwt}`,
        },
        body: JSON.stringify({ type: 'Adopted' }),
      });
      if (!response.ok) {
        throw new Error('Failed to adopt pet');
      }
      setIsOwner(true);
      navigate(`/pets/${petId}`);
    } catch (error) {
      console.error('Error adopting pet:', error.message);
    }
  };

  
  const handleFoster = async () => {
    try {
      const response = await fetch(`https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/pets/${petId}/adopt`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.jwt}`,
        },
        body: JSON.stringify({ type: 'Fostered' }),
      });
      if (!response.ok) {
        throw new Error('Failed to foster pet');
      }
      setIsOwner(true);
      navigate(`/pets/${petId}`);
    } catch (error) {
      console.error('Error fostering pet:', error.message);
    }
  };
  
  const handleReturnToAdoptionCenter = async () => {
    try {
      const response = await fetch(`https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/${petId}/return`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to return pet to adoption center');
      }
      setIsOwner(false);
      navigate(`/pets/${petId}`);
    } catch (error) {
      console.error('Error returning pet to adoption center:', error.message);
    }
  };
  

  const handleSaveForLater = async () => {
    try {
      const response = await fetch(`https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/pets/${petId}/save`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.jwt}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to save pet for later');
      }
      setPet((prevPet) => ({ ...prevPet, isSaved: true }));
      localStorage.setItem(`savedPet-${petId}`, true);
      console.log(`Pet with ID ${petId} saved for later.`);
    } catch (error) {
      console.error('Error saving pet for later:', error.message);
    }
  };

  const handleUnsave = async () => {
    try {
      const response = await fetch(`https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/pets/${petId}/unsave`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to unsave pet');
      }
      setPet((prevPet) => ({ ...prevPet, isSaved: false }));
      localStorage.removeItem(`savedPet-${petId}`);
      console.log(`Pet with ID ${petId} removed from saved list.`);
    } catch (error) {
      console.error('Error unsaving pet:', error.message);
    }
  };

  const handleButtonClick = () => {
    setPet((prevPet) => {
      if (prevPet.isSaved) {
        handleUnsave();
        return { ...prevPet, isSaved: false };
      } else {
        handleSaveForLater();
        return { ...prevPet, isSaved: true };
      }
    });
  };

  if (!pet) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-4 text-center">
      <h1 className="mb-4">{pet.name}</h1>

      <div className="card mb-4">
        <img
          src={pet.picture_url ? `https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/${pet.picture_url}` : 'https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/uploads/istockphoto-931785704-612x612.jpg'}
          className="card-img-top mx-auto"
          alt={pet.name}
          style={{ width: '50%', height: '50%' }}
        />
        <div className="card-body">
          <p className="card-text">Type: {pet.type}</p>
          <p className="card-text">Adoption Status: {pet.adoption_status}</p>
          <p className="card-text">Height: {pet.height}</p>
          <p className="card-text">Weight: {pet.weight}</p>
          <p className="card-text">Color: {pet.color}</p>
          <p className="card-text">Bio: {pet.bio}</p>
          <p className="card-text">Hypoallergenic: {pet.hypoallergenic ? 'Yes' : 'No'}</p>
          <p className="card-text">Breed: {pet.breed}</p>
          <p className="card-text">Dietary Restrictions: {pet.dietary_restrictions}</p>

          {!isOwner && (
            <>
              {pet.adoption_status !== 'Adopted' && (
                <>
                  <button className="btn btn-success" onClick={handleAdopt}>
                    Adopt
                  </button>
                  <button className="btn btn-primary" onClick={handleFoster}>
                    Foster
                  </button>
                </>
              )}

              <button
                className="btn btn-warning"
                onClick={handleButtonClick}
              >
                {pet.isSaved ? 'Unsave' : 'Save for Later'}
              </button>

            </>
          )}

          {isOwner && (
            <button className="btn btn-success" onClick={handleReturnToAdoptionCenter}>
              Return to Adoption Center
            </button>
          )}
        </div>
      </div>
    </div >
  );
};

export default SinglePetPage;
