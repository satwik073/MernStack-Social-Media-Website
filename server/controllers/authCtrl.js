const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const { response } = require('express');
const jwt = require('jsonwebtoken');
let loggedInUserId = null;
const authCtrl = {
    register: async (req, res) => {
        try {
            const { fullname, username, email, password, gender } = req.body;
            let newUserName = username.toLowerCase().replace(/ /g, '');

            const user_name = await Users.findOne({ username: newUserName });
            if (user_name) return res.status(400).json({ msg: "This username already exists." });

            const user_email = await Users.findOne({ email });
            if (user_email) return res.status(400).json({ msg: "This email already exists." });

            if (password.length < 6) return res.status(400).json({ msg: "Password must be at least 6 characters." });

            const passwordHash = await bcrypt.hash(password, 12);

            const newUser = new Users({
                fullname,
                username: newUserName,
                email,
                password: passwordHash,
                gender
            });

            const access_token = createAccessToken({ id: newUser._id });
            const refresh_token = createRefreshToken({ id: newUser._id });

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            await newUser.save();

            res.json({
                msg: 'Register Success!',
                access_token,
                user: {
                    ...newUser._doc,
                    password: '',
                    userId: newUser.id
                }
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    login: async (req, res) => {
        try {
          const { email, password } = req.body;
        
          const user = await Users.findOne({ email });
        
          if (!user) return res.status(400).json({ msg: "This email does not exist." });
        
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." });
        
          const access_token = createAccessToken({ id: user._id });
          const refresh_token = createRefreshToken({ id: user._id });
          loggedInUserId = user._id;
          console.log(loggedInUserId)
          // Store tokens in the user's tokens array
          user.tokens = user.tokens.concat(access_token, refresh_token);
          await user.save();
      
          res.cookie('refreshtoken', refresh_token, {
              httpOnly: true,
              path: '/api/refresh_token',
              maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
          });
        
          res.cookie('access_token', access_token, {
              httpOnly: true,
              path: '/',
              maxAge: 24 * 60 * 60 * 1000 // 1 day
          });
        
          // Send response with user details and tokens
          res.json({
              access_token,
              user: {
                ...user._doc,
                password: '',
                userId: user.id
              }
            });
           
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
      },
      
    logout: async (req, res) => {
        try {
            loggedInUserId = null;
            res.clearCookie('refreshtoken', { path: '/api/refresh_token' });
            res.clearCookie('access_token', { path: '/' });
            
            // Log the successful logout message in the console
            console.log('User logged out successfully!');
            
            return res.json({ msg: "Logged out!" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }

        
    },
    
    generateAccessToken: async (req, res) => {
        try {
          const rf_token = req.cookies.refreshtoken;
      
          if (!rf_token) return res.status(400).json({ msg: "Please login now." });
      
          jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
              if (err) return res.status(400).json({ msg: "Please login now." });
      
              const user = await Users.findById(result.id).select("-password")
                  .populate('followers following', 'avatar username fullname followers following');
      
              if (!user) return res.status(400).json({ msg: "This user does not exist." });
      
              const access_token = createAccessToken({ id: result.id });
      
              res.json({
                  access_token,
                  user
              });
          });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
      },
      getLoggedInUserId: () => loggedInUserId, // Exporting the logged-in user's ID
    }


    const createAccessToken = (payload) => {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
      };
      
      const createRefreshToken = (payload) => {
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
      };
module.exports = authCtrl;
