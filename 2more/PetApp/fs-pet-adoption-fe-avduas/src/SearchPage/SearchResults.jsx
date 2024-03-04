import React from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const SearchResults = ({ results }) => {
  const [cookies] = useCookies(['jwt']);
  const userId = cookies.jwt; 

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {results.map((pet) => (
        <div key={pet.id} className="col">
          <div className="card" style={{ width: '200px', height: '350px' }}>
            <img
              src={pet.picture_url ? `https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/${pet.picture_url}` : 'https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/uploads/istockphoto-931785704-612x612.jpg'}
              className="card-img-top"
              alt={pet.name}
              style={{ objectFit: 'cover', width: '100%', height: '200px' }}
            />
            <div className="card-body">
              <h5 className="card-title">{pet.name}</h5>
              <p className="card-text">Status: {pet.adoption_status}</p>
              {userId ? ( 
                <Link to={`/pets/${pet.id}`} className="btn btn-primary">
                  See more
                </Link>
              ) : (
                <Link to="/" className="btn btn-primary"> 
                  Sign-up
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
