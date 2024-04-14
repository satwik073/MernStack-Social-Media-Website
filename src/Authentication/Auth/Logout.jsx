import React from 'react';
import axios from 'axios';
import { SlLogout } from "react-icons/sl";
const Logout = () => {
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout');

      // Clear any stored tokens in local storage or cookies
      localStorage.removeItem('access_token');
      console.log("logout success")
      // Redirect to the login page or any other appropriate page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
    
      <button onClick={handleLogout}><SlLogout className='text-gray-500 hover:text-black'/></button>
    </div>
  );
};

export default Logout;
