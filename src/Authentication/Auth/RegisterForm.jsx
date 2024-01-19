import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Redux/UserContext';
import "../../Stylesheets/Global.css"
import { Link } from 'react-router-dom';
import "../../Stylesheets/Global.css"
const RegisterForm = () => {
  const { setUserData } = useUser(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    gender: '',
  });

  const { fullname, username, email, password, gender } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      const userData = response.data;
      if (userData.user) {
        setUserData(userData.user);
        navigate(`/login`);
      } else {
        console.error('User data not available in response');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex md:justify-center items-center min-h-screen">
    <form onSubmit={handleSubmit} className="lg:w-1/3 md:w-1/2 w-full p-12 rounded-lg bg-gray-50">
      <h2 className="text-2xl mb-4 font-bold text-center textFlex">Register</h2>
      <div className="mb-4">
        <label htmlFor="fullname" className="block mb-2 textFlex text-sm">Full Name</label>
        <input
          type="text"
          name="fullname"
          id="fullname"
          value={fullname}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 mb-4 rounded-md textFlexed text-xs py-3 "
        />
        <label htmlFor="username" className="block mb-2  text-sm textFlex">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full p-2 mb-4 rounded-md textFlexed text-xs py-3 "
        />
        <label htmlFor="email" className="block mb-2  text-sm textFlex">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 mb-4 rounded-md textFlexed text-xs py-3 "
        />
        <label htmlFor="password" className="block mb-2  text-sm textFlex">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 mb-4 textFlexed text-xs py-3 rounded-md border border-red-500"
        />
        <label htmlFor="gender" className="block mb-2  text-sm textFlex">Gender</label>
        <input
          type="text"
          name="gender"
          id="gender"
          value={gender}
          onChange={handleChange}
          placeholder="Gender"
          className="w-full p-2 mb-4 rounded-md textFlexed text-xs py-3 "
        />
        <button type="submit" className="w-full bg-black text-white py-2 rounded-md">
          Signup
        </button>
        <p className='textFlexed pt-3'>Already have an Account ? <Link to={'/login'}> <span className='text-blue-700 cursor-pointer'>Login</span></Link></p>
      </div>
      </form>
    </div>
    
    
  );
};

export default RegisterForm;
