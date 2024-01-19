const router = require('express').Router();
const auth = require("../middleware/auth");
const userCtrl = require("../controllers/userCtrl");
const User = require('../models/userModel');
const authCtrl = require('../controllers/authCtrl');

router.get('/search', auth, userCtrl.searchUser);

router.get('/user/:id', userCtrl.getUser);

router.patch('/user/:id/follow', async (req, res) => {
  try {
    const loggedUserId = authCtrl.getLoggedInUserId();  // Assuming you have access to the logged-in user ID
    console.log(loggedUserId)
    
    if (loggedUserId === req.params.id) {
      return res.status(500).json({ msg: "Cannot follow yourself" });
    }

    const user = await User.find({ _id: req.params.id, followers: loggedUserId });
    if (user.length > 0) return res.status(500).json({ msg: "You followed this user." });

    const newUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { followers: loggedUserId }
      },
      { new: true }
    ).populate("followers following", "-password");

    await User.findOneAndUpdate(
      { _id: loggedUserId },
      {
        $push: { following: req.params.id }
      },
      { new: true }
    );

    res.json({ newUser });
    console.log("followed");
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.patch('/user/:id/unfollow', async (req, res) => {
  try {
    const loggedUserId =authCtrl.getLoggedInUserId(); // Assuming you have access to the logged-in user ID

    const newUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { followers: loggedUserId }
      },
      { new: true }
    ).populate("followers following", "-password");

    await User.findOneAndUpdate(
      { _id: loggedUserId },
      {
        $pull: { following: req.params.id }
      },
      { new: true }
    );

    res.json({ newUser });
    console.log("unfollowed")
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});
router.get('/followingProfiles', async (req, res) => {
  try {
    const loggedInUserId = auth.getLoggedInUserId();

    // Find the logged-in user to get their following array
    const loggedInUser = await User.findById(loggedInUserId).select('following');

    if (!loggedInUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fetch profiles of users the logged-in user is following
    const followingProfiles = await User.find({ _id: { $in: loggedInUser.following } }).select('-password');

    res.json({ followingProfiles });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// Get profiles following the authenticated user
router.get('/followersProfiles',  async (req, res) => {
  try {
    const loggedInUserId = auth.getLoggedInUserId();
    console.log(loggedInUserId)
    // Find the logged-in user to get their followers array
    const loggedInUser = await User.findById(loggedInUserId).select('followers');

    if (!loggedInUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fetch profiles of users following the logged-in user
    const followersProfiles = await User.find({ _id: { $in: loggedInUser.followers } }).select('-password');

    res.json({ followersProfiles });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    // Access req.user for the authenticated user's information
    res.json({ user: req.user });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.put('/user/:id/update', userCtrl.updateUser);

router.get('/suggestionsUser', auth, userCtrl.suggestionsUser);

module.exports = router;
