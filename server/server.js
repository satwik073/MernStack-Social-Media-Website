require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
// const SocketServer = require('../socket/socket')
const { ExpressPeerServer } = require('peer')
const path = require('path')
// const useUser = require("../client/src/Redux/UserContext")
const User = require('./models/userModel');
const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())


// Socket
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', socket => {
    SocketServer(socket)
})

// Create peer server
ExpressPeerServer(http, { path: '/' })


// Routes
app.use('/api', require('./routes/authRouter'))
app.use('/api', require('./routes/userRouter'))
app.put('/api/user/:id/update', async (req, res) => {
    try {
      const { avatar, fullname, mobile, address, story, website, gender } = req.body;
      const userId = req.params.id; // Extract the user ID from the URL params
      
      if (!userId || !fullname) {
        return res.status(400).json({ msg: 'Please provide user ID and full name.' });
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatar, fullname, mobile, address, story, website, gender },
        { new: true } // To get the updated user data
      );
  
      if (!updatedUser) {
        return res.status(400).json({ msg: 'User not found or update failed.' });
      }
  
      res.json({ msg: 'Update Success!', user: updatedUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  });
  // const {userData}= useUser();
  app.put('/api/user/:id/follow', async (req, res) => {
    try {
      const userId = req.params.id;
      console.log(userData.userId);
      const loggedInUserId = req.user._id;
      console.log(loggedInUserId); 
      const userToFollow = await User.findOne({ _id: userId, followers: loggedInUserId });
      if (userToFollow) {
        return res.status(500).json({ msg: 'You are already following this user.' });
      }
  
      const updatedUserToFollow = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { followers: loggedInUserId } },
        { new: true }
      ).populate('followers following', '-password');
  
      await User.findOneAndUpdate(
        { _id: loggedInUserId },
        { $push: { following: userId } },
        { new: true }
      );
  
      res.json({ msg: 'Followed user successfully!', user: updatedUserToFollow });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  });
  app.put('/api/user/:id/unfollow', async (req, res) => {
    try {
      const userId = req.params.id;
      const loggedInUserId = req.user._id;
  
      const updatedUserToUnfollow = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { followers: loggedInUserId } },
        { new: true }
      ).populate('followers following', '-password');
  
      await User.findOneAndUpdate(
        { _id: loggedInUserId },
        { $pull: { following: userId } },
        { new: true }
      );
  
      res.json({ msg: 'Unfollowed user successfully!', user: updatedUserToUnfollow });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  });
    
  app.get('/api/profiles', async (req, res) => {
    try {
      const users = await User.find({}, '-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
app.use('/api', require('./routes/postRouter'))
app.use('/api', require('./routes/commentRouter'))
app.use('/api', require('./routes/notifyRouter'))
app.use('/api', require('./routes/messageRouter'))


const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('Connected to mongodb')
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}


const port = process.env.PORT || 5000
http.listen(port, () => {
    console.log('Server is running on port', port)
})