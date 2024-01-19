import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Redux/UserContext';

const LoginForm = () => {
  const { setUserData } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false); // State to handle show/hide password
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword); // Toggle show/hide password
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      const { access_token, user } = response.data;
      localStorage.setItem('access_token', response.data.access_token);

      setUserData(user);
      console.log(user)
      navigate(`/profile/${user.userId}`);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form onSubmit={handleLogin} className="w-full md:w-1/2 bg-white rounded-lg p-8">
        <h2 className="text-xl font-semibold mb-6 text-center">Login in to Your Account</h2>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute inset-y-0 right-0 px-4 py-3 text-gray-600 focus:outline-none"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button type="submit" className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
