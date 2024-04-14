// MainHeader.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '../Redux/UserContext';
import Logout from '../Authentication/Auth/Logout';
import { useNavigate } from 'react-router-dom';
import LoggedInUserProfile from '../Components/LoggedinUserProfile';
import Suggestions from './Suggestions';
import PostsCompiled from './PostsCompiled';
import "../Stylesheets/Global.css"
import SearchUsers from '../Components/SearchUsers';
import UpperNavbar from './UpperNavbar';
const MainHeader = () => {
  const { userData } = useUser();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profiles');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleFollow = async (userId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/user/${userId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, followers: response.data.newUser.followers } : user
      );
      setUsers(updatedUsers);
      console.log("followed successfuly")
    } catch (error) {
      console.log('Error following user: Already following the user');
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/user/${userId}/unfollow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, followers: response.data.newUser.followers } : user
      );
      setUsers(updatedUsers);
      console.log("unfollowed successfuly")
    } catch (error) {
      console.log('Error unfollowing user: Already unfollowing the user');
    }
  };

  const getUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
      const data = response.data;
      console.log(data);
      // Do something with user details, e.g., set in state to display or use in UI
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Handle error - maybe display an error message
    }
  };
  const handleUserClick = async (userId) => {
    console.log(`User clicked: ${userId}`);
    navigate(`/user-profiles/${userId}`);
  };
  return (
    <div>
      {/* <UpperNavbar/> */}
    <div className="header  bg-white flex w-full rounded-lg h-[100vh]  ">
      <div className="PostConfig bg-gray-50 md:w-3/4 w-full">
        <div className="Centered  px-0 w-full">
          {/* <SearchUsers /> */}
          <PostsCompiled />
        </div>
      </div>

      <div>

        <div className="rounded-lg w-full sm:block hidden bg-white ">
          <LoggedInUserProfile />
          {/* <Suggestions /> */}
        </div>
      </div>
    </div>
    </div>
  );
};

export default MainHeader;
