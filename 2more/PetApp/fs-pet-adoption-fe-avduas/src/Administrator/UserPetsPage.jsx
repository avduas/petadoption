import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserInfo = ({ user }) => {
  const { id, email, firstName, lastName, phone, role } = user;

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">User Information</h3>
        <p>ID: {id}</p>
        <p>Email: {email}</p>
        <p>Name: {firstName} {lastName}</p>
        <p>Phone: {phone}</p>
        <p>Role: {role}</p>
      </div>
    </div>
  );
};

const UserPetsPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userPets, setUserPets] = useState([]);
  const [expandedPetId, setExpandedPetId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        const { token, password, ...userInfo } = userData;
        setUser(userInfo);
        setUserPets(userInfo.pets);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const toggleExpand = (petId) => {
    setExpandedPetId(expandedPetId === petId ? null : petId);
  };

  return (
    <div className="container mt-4">
      {user && (
        <div>
          <UserInfo user={user} />
          <h2>User {userId} Pets</h2>
          <ul className="list-group">
            {userPets.map((pet) => (
              <li key={pet.id} className="list-group-item">
                <div className="card" style={{ cursor: 'pointer' }} onClick={() => toggleExpand(pet.id)}>
                  <div className="card-body">
                    <p>ID: {pet.id}</p>
                    <p>Name: {pet.name}</p>
                  </div>
                </div>
                {expandedPetId === pet.id && (
                  <div className="card mt-2">
                    <div className="card-body">
                      <p>Type: {pet.type}</p>
                      <p>Status: {pet.adoption_status}</p>
                      <p>Height: {pet.height}</p>
                      <p>Weight: {pet.weight}</p>
                      <p>Color: {pet.color}</p>
                      <p>Bio: {pet.bio}</p>
                      <p>Hypoallergenic: {pet.hypoallergenic ? 'Yes' : 'No'}</p>
                      <p>Dietary Restrictions: {pet.dietary_restrictions}</p>
                      <p>Breed: {pet.breed}</p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserPetsPage;
