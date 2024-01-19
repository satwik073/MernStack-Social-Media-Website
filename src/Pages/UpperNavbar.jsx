import React from 'react'
import { Logo } from '../assets'
import SearchUsers from '../Components/SearchUsers'
import { useUser } from '../Redux/UserContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import "../Stylesheets/Global.css"
import { RiNotificationLine } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa6";
import axios from 'axios'
import { Link } from 'react-router-dom'
import { IoCreateOutline } from "react-icons/io5";
import { useEffect } from 'react'
import CreatePost from '../Components/CreatePost'
import { VscDiffAdded } from 'react-icons/vsc'
const UpperNavbar = () => {
    const { userData } = useUser();
    const navigate = useNavigate();
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
        <div className='flexCard flex flex-col md:flex-row w-full py-2 justify-between items-center'>
        <div className='flex items-center justify-center md:justify-start md:w-1/4'>
          <div className='LogoFlex flex items-center'>

            <img src={Logo} alt='' className='w-[160px] p-2' />
          </div>
        </div>
        <div className='flex md:w-2/3 items-center justify-center'>
          <div className='searchInput w-full md:w-3/4 flex items-center'>
            <SearchUsers />
          </div>
        </div>
        <div className='Wrapped flex md:w-1/4 justify-between items-center'>
          <div className='Icons flex items-center justify-end space-x-3'>
            <div className='flex bg-gray-100 p-2 rounded-md items-center'>
                <Link to={"/chat"}>
              <RiNotificationLine className='text-3xl p-1 cursor-pointer' />
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
          <div className='UserShowCase '>
            <Link to={`/profile/details/${userData.userId}`}>
              <div className='LoggedInProfile flex items-center space-x-3 rounded-lg'>
                <div className='avatar flex items-center p-2'>
                  <img
                    src={userData.avatar}
                    className='rounded-full h-11 w-11 object-cover'
                    alt=''
                  />
                </div>
                <div className='userDetail lg:flex hidden items-center'>
                  <div className='collected'>
                    <div className='font-semibold md:text-md textFlex text-xs items-center flex'>
                      <p>@{userData.username}</p>
                      <FaAngleDown className='ml-2' />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
}

export default UpperNavbar
