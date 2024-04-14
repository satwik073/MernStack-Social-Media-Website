// MainHeader.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../Stylesheets/Global.css"
import { useUser } from '../Redux/UserContext';
import Logout from '../Authentication/Auth/Logout';
import { useNavigate } from 'react-router-dom';
import Suggestions from '../Pages/Suggestions';
const LoggedInUserProfile = () => {
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
        <div className="header bg-white px-6  py-2 rounded-t-lg">
            <div className='flex justify-between'>
            <Link to={`/profile/details/${userData.userId}`}>
                <div className='LoggedInProfile flex items-center space-x-3  rounded-lg'>
                    <div className="avatar flex items-center p-2">
                        <img
                            src={userData.avatar}
                            className="rounded-full md:h-14 md:w-14 h-11 w-11 object-cover"
                            alt=""
                        />
                    </div>
                    <div className="userDetail flex items-center">
                        <div className="collected">
                            <div className='font-semibold md:text-md textFlex text-xs'>@{userData.username}</div>
                            <div className='md:text-sm text-xs'>{userData.fullname}</div>
                        </div>
                    </div>
                </div>
            </Link>
            <div className='flex items-center'>

                    <Logout/>
            </div>
                    </div>
            <Suggestions/>

                {/* <div className='font-extrabold text-[5vw]'>{userData.userId}</div> */}


            {/* <ul>
        <Logout />
        {users.map((user) => (
          <li key={user._id}>
            <p>ID: {user._id}</p>
            <p>Name: {user.fullname}</p>
            <p>@{user.username}</p>
            <button onClick={() => handleFollow(user._id)}>Follow</button>
            <button onClick={() => handleUnfollow(user._id)}>Unfollow</button>
            <button onClick={() => handleUserClick(user._id)}>View Profile</button>
          </li>
        ))}
      </ul> */}
        </div>
    );
};

export default LoggedInUserProfile;
