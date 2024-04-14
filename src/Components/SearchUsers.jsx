import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RiNotificationLine } from 'react-icons/ri';
import { IoCreateOutline } from 'react-icons/io5';
import { FaAngleDown } from 'react-icons/fa';
import "../Stylesheets/Global.css"
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { VscDiffAdded } from "react-icons/vsc";
import CreatePost from './CreatePost';
import "../Stylesheets/Global.css"
import { Link } from 'react-router-dom';
import { useUser } from '../Redux/UserContext';
const SearchUsers = () => {
  const navigate = useNavigate();
  const {userData}= useUser()
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [noUserFound, setNoUserFound] = useState(false);

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

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedUsers(filtered);
    setNoUserFound(filtered.length === 0); // Set state based on filtered users
  }, [searchTerm, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setInputFocused(false);
    }, 1000);
  };

  const handleUserClick = (userId) => {
    console.log(`User clicked: ${userId}`);
    navigate(`/user-profiles/${userId}`);
  };
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleCreatePostClick = () => {
    setShowCreatePost(true);
  };

  const closeCreatePostModal = () => {
    setShowCreatePost(false);
  };
  return (
    <div className="w-full justify-between flex relative">
      <div className=" flex  w-96 items-center ">
        <input
          type="text"
          placeholder="Search here ..."
          value={searchTerm}
          onChange={handleSearch}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className=" py-2.5 px-12 textFlexed outline-none rounded-full w-full  border-[1px] border-gray-300 focus:outline-none focus:border-[#0D76E3]   transition-all bg-[#f8f8fa] duration-300 ease-in-out"
        
        />
        <IoSearchOutline className="absolute left-4  textFlexed text-xl text-black pointer-events-none " />
      </div>
      {inputFocused && searchTerm && (
        <ul className="absolute top-full w-96 mt-2 border  p-2 overflow-y-auto bg-white rounded-2xl shadow-2xl z-10 max-h-[60vh] hideScroll">
          <h1 className='px-3 text-xs textFlex text-gray-500 py-3'>Recent Searches</h1>
          {noUserFound ? (
            <li className="px-4 text-red-700 textFlexed py-2">User not found</li>
            ) : (
              displayedUsers.map((user) => (
                <li
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className="px-4 py-1.5 cursor-pointer"
                >
                <div className='flex space-x-3 py-2.5 px-4 hover:bg-[#0D76E3] hover:text-white rounded-lg'>
                  <img src={user.avatar} className="rounded-full h-10  w-10 object-cover" alt="" />
                  <div className='flex items-center px-2'>
                    <div>
                      <p className='text-xs textFlex'>{user.fullname}</p>
                      <p className='text-[10px] textFlexed'>@{user.username}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
        <div className='Wrapped flex md:w-1/4 justify-between items-center'>
          <div className='Icons flex items-center justify-end space-x-3'>
            <div className='flex bg-gray-100 p-2 rounded-md items-center'>
                <Link to={"/chat"}>
              <IoChatbubbleEllipsesOutline className='text-3xl p-1 cursor-pointer' />
                </Link>
            </div>
            <div className='flex bg-gray-100 p-2 rounded-md items-center'>

              <IoCreateOutline
                className='text-3xl p-1 cursor-pointer'
                onClick={handleCreatePostClick}
              />
              {showCreatePost && (
                <div className='fixed inset-0 flex justify-center items-center bg-gray-900 blurred-background2 bg-opacity-50 z-50'>
                  <div className='bg-white rounded-md p-7'>
                    <button
                      onClick={closeCreatePostModal}
                      className='float-right top-0 text-black -mt-4 px-4 py-2 rounded-md'
                    >
                      &times;
                    </button>
                    <CreatePost />
                  </div>
                </div>
              )}
            </div>
          </div>
         
        </div>
     
    </div>
  );
};

export default SearchUsers;
