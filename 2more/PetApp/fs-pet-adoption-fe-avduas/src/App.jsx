import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogOutScreen from './Homepage (Logged out)/LogOutScreen';
import ProfileSettings from './Profile/Profile';
import MyPetsPage from './Pet/MyPetsPage';
import SinglePetPage from './Pet/SinglePetPage';
import SearchPage from './SearchPage/SearchPage';
import UserPetsPage from './Administrator/UserPetsPage';
import EditPetPage from './Administrator/EditPetPage';
import Dashboard from './Administrator/Dashboard';
import Navbar from './NavBar/Navbar';
import useCurrentUser from './useCurrentUser';
import AddPetPage from './Administrator/AddPetPage';

const AppRouter = () => {
  const currentUser = useCurrentUser();
  console.log('currentUser:', currentUser); 

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LogOutScreen />} />
        <Route path='/search' element={<SearchPage />} />
        {currentUser && (
          <>
            <Route path='/profile-settings' element={<ProfileSettings userId={currentUser.id} />} />
            <Route path='/my-pets' element={<MyPetsPage userId={currentUser.id} />} />
            <Route
              path='/pets/:petId'
              element={<SinglePetPage user={currentUser} />}
            />
            {currentUser.role === 'admin' && (
              <>
                <Route path='/user-pets/:userId' element={<UserPetsPage />} />
                <Route path='/edit-pet/:petId' element={<EditPetPage />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/add-pet' element={<AddPetPage />} />
              </>
            )}
          </>
        )}
      </Routes>
    </>
  );
};

export default AppRouter;
