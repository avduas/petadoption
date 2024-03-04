import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Dashboard = () => {
  const [cookies, setCookie] = useCookies(['jwt']);
  const [data, setData] = useState({ users: [], pets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/users/all', {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        });
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [cookies.jwt]);

  const { users, pets } = data;

  return (
    <div className="container mt-4">
      <h1>Dashboard</h1>

      <div className="mt-4">
        <h2>Users</h2>
        <table className="table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.role}</td>
                <td>
                  <Link to={`/user-pets/${user.id}`} className="btn btn-primary">
                    View Pets
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <h2>Pets</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Pet ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Adoption Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet.id}>
                <td>{pet.id}</td>
                <td>{pet.name}</td>
                <td>{pet.type}</td>
                <td>{pet.adoption_status}</td>
                <td>
                  <Link to={`/edit-pet/${pet.id}`} className="btn btn-warning">
                    Edit Pet
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
