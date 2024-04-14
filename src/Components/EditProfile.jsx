import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../Redux/UserContext';

const EditProfile = () => {
  const { userData } = useUser();
  const [formData, setFormData] = useState({
    fullname: userData.fullname || '',
    username: userData.username || '',
    email: userData.email || '',
    gender: userData.gender || '',
    mobile: userData.mobile || '',
    address: userData.address || '',
    story: userData.story || '',
    website: userData.website || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch('/api/updateUser', formData); // Assuming the endpoint for updating user data is '/api/updateUser'
      console.log(response.data);
      // Optionally, you can handle success messages or update the user context after a successful update
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullname">Full Name</label>
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
        />
        {/* Add other input fields for username, email, gender, mobile, address, story, website */}
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;
