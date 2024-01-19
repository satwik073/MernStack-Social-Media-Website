import React, { useState } from 'react';
import axios from 'axios';
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { useUser } from '../Redux/UserContext';
import "../Stylesheets/Global.css"
import FollowingCard from '../Components/FollowingCard';
import FollowersCard from '../Components/FollowersCard';
import LoggedInUserPosts from '../Components/LoggedInUserPost';
import AllPostsDisplayed from '../Components/AllPostsDisplayed';
import SavedPostsLoggedBy from '../Components/SavedPostsLoggedBy';
const FullUserProfile = () => {
  const [showLoggedInUserPosts, setShowLoggedInUserPosts] = useState(true);
  const [showSavedPosts, setShowSavedPosts] = useState(false);

  const handlePostsClick = () => {
    setShowLoggedInUserPosts(true);
    setShowSavedPosts(false);
  };

  const handleSavedPostsClick = () => {
    setShowLoggedInUserPosts(false);
    setShowSavedPosts(true);
  };

  const { userData } = useUser();
  console.log(userData)
  const [editMode, setEditMode] = useState(false);
  const [fli, setFli] = useState(false);
  const [flo, setFlo] = useState(false);
  const [formData, setFormData] = useState({
    coverPhoto:userData.coverPhoto ||'',
    avatar: userData.avatar || '',
    fullname: userData.fullname || '',
    mobile: userData.mobile || '',
    address: userData.address || '',
    story: userData.story || '',
    coverPhoto: userData.coverPhoto || '',
    website: userData.website || '',
    gender: userData.gender || '',
  });
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  // Function to toggle display of FollowersCard
  const handleFollowersClick = () => {
    setShowFollowers(!showFollowers);
    setShowFollowing(false); // Hide FollowingCard if displayed
  };

  // Function to toggle display of FollowingCard
  const handleFollowingClick = () => {
    setShowFollowing(!showFollowing);
    setShowFollowers(false); // Hide FollowersCard if displayed
  };




  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleClose = () => {
    setEditMode(false);
  };
  const handleCloseFli = () => {
    setFli(false);
  };
  const handleCloseFlo = () => {
    setFlo(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedData = formData;
  
      // Check if file is selected for upload
      if (formData.selectedFile) {
        const formDataFile = new FormData();
        formDataFile.append('file', formData.selectedFile); // 'file' should match the key in your backend form
  
        // Make a POST request to upload the file and get its URL
        const fileUploadResponse = await axios.post('YOUR_UPLOAD_ENDPOINT', formDataFile, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Use the uploaded file URL in the form data
        updatedData = {
          ...formData,
          avatar: fileUploadResponse.data.fileURL, // Replace 'avatar' with your appropriate key
        };
      }
  
      // Make a PUT request with updatedData containing either URL or form data
      const response = await axios.put(`http://localhost:5000/api/user/${userData._id}/update`, updatedData);
      console.log(response.data); // Check the structure of the response for the updated user
      setEditMode(false); // Disable edit mode after submitting changes
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  return (
    <div className="  rounded-md max-h-full  overflow-y-auto hideScroll">

      <div className="w-full mx-auto">
        <div className="relative w-full lg:h-72 h-40 flex">
          <img src={userData.coverPhoto} className="w-full h-full  object-center  object-cover rounded-t-md" alt="Cover" />
          <div className="absolute w-full md:px-16 px-12 bottom-0 flex justify-center md:justify-start lg:top-[70%] top-[60%] left-1/2 transform -translate-x-1/2 -mb-8">
            <img
              src={userData.avatar}
              alt="User Avatar"
              className="w-32 h-32 md:w-44 md:h-44 rounded-full border-8 border-white shadow-xl"
            />
          </div>
        </div>
        <div className="bg-white rounded-b-md p-4 md:p-6 flex justify-between">
          <div className="UserDetails md:pt-[7rem] pt-[5rem] px-4 ">
            <div className="md:text-5xl text-3xl font-semibold textFlex">{userData.fullname}</div>
            <div className="md:text-md text-xs text-white mt-5 bg-black w-fit p-2 px-5 rounded-full">@{userData.username}</div>
            <div className="md:text-lg text-sm mt-6 text-gray-600 textFlexed ">{userData.mobile}</div>
            <div className="md:text-lg text-sm text-gray-600  textFlexed">{userData.address}</div>
            <div className="md:text-lg text-sm mt-4 text-gray-600 mb-4 textFlexed">{userData.story}</div>
            <div className="md:text-lg text-sm mt-2 text-gray-600 mb-4 textFlexed">{userData.website}</div>
          </div>

          <div className='md:pt-[7rem] pt-[5rem] px-4 '>
            <button
              onClick={() => setEditMode(true)}
              className=" text-sm bg-black text-white p-4 rounded-full"
            >
              <FiEdit />
            </button>
          </div>
        </div>
        <div className='flex md:px-6 md:w-1/3 w-full px-16 justify-between'>
          <div>
            <div className=' flex justify-center font-bold text-3xl '>{userData.followers.length}</div>
            <div className="text-md font-bold p-2 px-4 rounded-full mb-4 textFlex cursor-pointer" onClick={handleFollowersClick}>
              Followers
            </div>
          </div>
          {showFollowers && (
            <div className="fixed inset-0 z-50 ">
              <div className="blurred-background bg-black ">
                <div className=' w-fit bg-white flex justify-center p-12 rounded-lg shadow-2xl'>
                  <FollowersCard handleClose={handleCloseFlo} />
                </div>
              </div>
            </div>
          )}
          <div>
            <div className=' flex justify-center font-bold text-3xl '>{userData.following.length}</div>
            <div className="text-md font-bold p-2 px-4 rounded-full mb-4 textFlex cursor-pointer" onClick={handleFollowingClick}>
              Following
            </div>
          </div>
          {showFollowing && (

            <div className="fixed inset-0 z-50 ">

              <div className="blurred-background bg-white ">

                <div className=' w-fit bg-white flex justify-center p-12 rounded-lg shadow-2xl'>
                  <div className='flex'>

                    <FollowingCard handleClose={handleCloseFli} />

                  </div>
                </div>
              </div>
            </div>
          )}
        </div>



        {editMode && (
          <div className="fixed inset-0 z-50 ">
            <div className="blurred-background hideScroll overflow-y-auto  ">
              <form onSubmit={handleSubmit} className="p-9 overflow-y-auto textFlexed rounded-md shadow-lg w-[40%] max-h-[70vh] hideScroll  bg-white">
                <button onClick={handleClose} className="text-gray-500 float-right text-xl focus:outline-none">
                  &times;
                </button>
                <div className="mb-8 mt-2">
                  <label htmlFor="avatar" className="block text-sm font-semibold mb-1">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    placeholder="Enter avatar URL"
                  />
                </div>
                <div className="mb-8 mt-2">
                  <label htmlFor="avatar" className="block text-sm font-semibold mb-1">
                    Cover Photo 
                  </label>
                  <input
                    type="text"
                    name="coverPhoto"
                    value={formData.coverPhoto}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    placeholder="Enter avatar URL"
                  />
                </div>
                <div className="mb-8 mt-2">
                  <label htmlFor="fullname" className="block text-sm font-semibold mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="mb-8 mt-2">
                  <label htmlFor="mobile" className="block text-sm font-semibold mb-1">
                    Mobile
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    placeholder="Enter mobile number"
                  />
                </div>
                <div className="mb-8 mt-2">
                  <label htmlFor="address" className="block text-sm font-semibold mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    placeholder="Enter address"
                  />
                </div>
                <div className="mb-8 mt-2">
                  <label htmlFor="story" className="block text-sm font-semibold mb-1">
                    Story
                  </label>
                  <textarea
                    name="story"
                    value={formData.story}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    placeholder="Enter your story"
                  ></textarea>
                </div>
                <div className="mb-8 mt-2">
                  <label htmlFor="website" className="block text-sm font-semibold mb-1">
                    Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    placeholder="Enter website URL"
                  />
                </div>
                <div className="mb-8 mt-2">
                  <label htmlFor="gender" className="block text-sm font-semibold mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button type="submit" className="bg-black hover:bg-white hover:border-[1px] hover:border-black hover:text-black w-full gap-2 flex justify-center text-white py-2 px-4 rounded-md">
                  <span className="flex items-center">
                    Save Changes <IoCheckmarkDoneSharp className="ml-2" />
                  </span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <div className="flex w-full mt-8">
        <div className="w-1/2">
          <h1
            onClick={handlePostsClick}
            className={`flex cursor-pointer justify-center p-5 textFlex  md:text-2xl text-lg ${
              showLoggedInUserPosts ? 'border-b-2 p-5  border-black' : ''
            }`}
          >
            Posts
          </h1>
        </div>
        <div className="w-1/2">
          <h1
            onClick={handleSavedPostsClick}
            className={`flex cursor-pointer justify-center p-5 md:text-2xl text-lg textFlex ${
              showSavedPosts ? 'border-b-2 p-5 border-black' : ''
            }`}
          >
            Saved Posts
          </h1>
        </div>
      </div>
      {showLoggedInUserPosts && <div className='mt-8'><LoggedInUserPosts /></div>}
      {showSavedPosts && <div className='mt-8'> <SavedPostsLoggedBy /></div>}
    </div>


  );
};

export default FullUserProfile;
