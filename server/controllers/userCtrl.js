const Users = require('../models/userModel')
const authCtrl  = require('./authCtrl')
const userCtrl = {
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({username: {$regex: req.query.username}})
            .limit(10).select("fullname username avatar")
            
            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id).select('-password')
            .populate("followers following", "-password")
            if(!user) return res.status(400).json({msg: "User does not exist."})
            
            res.json({user})
            console.log(user._id)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async (req, res) => {
      try {
        const { avatar, fullname, mobile, address, story, website, gender, coverPhoto } = req.body;
        if (!fullname) {
          return res.status(400).json({ msg: 'Please provide full name.' });
        }
    
        const loggedUserId = req.params.id; // Use the ID from the request parameters
    
        const updatedFields = { avatar, fullname, mobile, address, story, website, gender, coverPhoto };
    
        const updatedUser = await Users.findByIdAndUpdate(
          loggedUserId,
          updatedFields,
          { new: true }
        );
    
        if (!updatedUser) {
          return res.status(400).json({ msg: 'User not found or update failed.' });
        }
    
        res.json({ msg: 'Update Success!', user: updatedUser });
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    },
    
    
    // follow: async (req, res) => {
    //     try {
    //         const user = await Users.find({_id: req.params.id, followers: req.user._id})
    //         if(user.length > 0) return res.status(500).json({msg: "You followed this user."})

    //         const newUser = await Users.findOneAndUpdate({_id: req.params.id}, { 
    //             $push: {followers: req.user._id}
    //         }, {new: true}).populate("followers following", "-password")

    //         await Users.findOneAndUpdate({_id: req.user._id}, {
    //             $push: {following: req.params.id}
    //         }, {new: true})

    //         res.json({newUser})
    //         console.log("followed")
    //     } catch (err) {
    //         return res.status(500).json({msg: err.message})
    //     }
    // },
    // unfollow: async (req, res) => {
    //     try {

    //         const newUser = await Users.findOneAndUpdate({_id: req.params.id}, { 
    //             $pull: {followers: req.user._id}
    //         }, {new: true}).populate("followers following", "-password")

    //         await Users.findOneAndUpdate({_id: req.user._id}, {
    //             $pull: {following: req.params.id}
    //         }, {new: true})

    //         res.json({newUser})

    //     } catch (err) {
    //         return res.status(500).json({msg: err.message})
    //     }
    // },
    suggestionsUser: async (req, res) => {
        try {
            const newArr = [...req.user.following, req.user._id]

            const num  = req.query.num || 10

            const users = await Users.aggregate([
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
            ]).project("-password")

            return res.json({
                users,
                result: users.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}


module.exports = userCtrl