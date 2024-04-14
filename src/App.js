import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterForm from './Authentication/Auth/RegisterForm';
import LoginForm from './Authentication/Auth/loginForm';
import MainHeader from './Pages/MainHeader';
import UserProfilesAll from './Pages/UserProfilesAll';
import { UserProvider } from './Redux/UserContext';
import FullUserProfile from './Pages/FullUserProfile';
import SidebarSection from './Components/SidebarSection';
import ExploreSection from './Pages/ExploreSection';
import MessagesSection from './Pages/MessagesSection';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const setUser = (userData) => {
    setLoggedInUser(userData);
    console.log(userData);
  };

  return (
    <div className="App w-full h-screen flex">
      <Router>
      <UserProvider>
        <div className="flex w-full">
          <div className=" lg:w-1/12">
            <SidebarSection />
          </div>
          <div className="w-11/12">
        <Routes>
          <Route
            path='/'
            element={loggedInUser ? <Navigate to={`/profile/${loggedInUser.userId}`} /> : <RegisterForm />}
          />
          <Route
            path='/login'
            element={<LoginForm setUser={setUser} setLoggedInUser={setUser} />}
          />
          <Route
            path='/profile/:userId'
            element={<MainHeader loggedInUser={loggedInUser} />}
          />
        <Route path='/profile/details/:userId' element={<FullUserProfile/>}/>
        <Route path='/user-profiles/:userId' element={<UserProfilesAll/>}/>
        <Route path='/Explore' element={<ExploreSection/>}/>
        <Route path='/chat' element={<MessagesSection/>}/>
        </Routes>
      </div>
      </div>
      </UserProvider>
      </Router>
    </div>
  );
};

export default App;
