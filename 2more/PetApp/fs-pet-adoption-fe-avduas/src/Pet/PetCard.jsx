import React from 'react';
import { Link } from 'react-router-dom';

const PetCard = ({ pet }) => {
  const { id, name, type, adoption_status, picture_url } = pet;

  return (
    <div className="card" style={{ width: '200px' }}>
      <img
        src={picture_url ? `https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/${picture_url}` : 'https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/uploads/istockphoto-931785704-612x612.jpg'}
        className="card-img-top"
        alt={name}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">Type: {type}</p>
        <p className="card-text">Status: {adoption_status}</p>
        <Link to={`/pets/${id}`} className="btn btn-primary">
          See more
        </Link>
      </div>
    </div>
  );
};

export default PetCard;
