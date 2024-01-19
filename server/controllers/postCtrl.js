const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')
const Users = require('../models/userModel')
const auth = require("../controllers/authCtrl");
const authCtrl = require('../controllers/authCtrl');

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const postCtrl = {
    getAllPosts: async (req, res) => {
        try {
            // const features = new APIfeatures(Posts.find(), req.query).paginating();
            // const allPosts = await features.query.sort("-createdAt");
            const allPosts = await Posts.find().sort({ createdAt: -1 });;
            res.json({
                result: allPosts.length,
                posts: allPosts
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    createPost: async (req, res) => {
        try {
            const { content, images } = req.body;

            if (images.length === 0)
                return res.status(400).json({ msg: "Please add your photo." });

            const loggedInUserId = auth.getLoggedInUserId(); // Fetch logged-in user's ID

            const newPost = new Posts({
                content,
                images,
                user: loggedInUserId, // Assign logged-in user's ID to the post
                loggedInUserId: loggedInUserId // If needed, save the logged-in user's ID in the post schema
            });
            
            await newPost.save();

            res.json({
                msg: 'Created Post!',
                newPost: {
                    ...newPost._doc,
                    user: req.user
                }
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getPosts: async (req, res) => {
        try {
            const loggedInUserId = authCtrl.getLoggedInUserId(); 
            console.log("logged", loggedInUserId)// Get the logged-in user's ID
            const features = new APIfeatures(Posts.find({
                $or: [
                    { user: { $in: [...req.user.following, req.user._id] } }, // Include existing condition if needed
                    { loggedInUserId: loggedInUserId } // Filter by loggedInUserId field
                ]
            }), req.query).paginating();
    
            const posts = await features.query.sort('-createdAt')
                .populate("user likes", "avatar username fullname followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                });
    
            res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updatePost: async (req, res) => {
        try {
            const { content, images } = req.body

            const post = await Posts.findOneAndUpdate({_id: req.params.id}, {
                content, images
            }).populate("user likes", "avatar username fullname")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })

            res.json({
                msg: "Updated Post!",
                newPost: {
                    ...post._doc,
                    content, images
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    likePost: async (req, res) => {
        try {
          const userId = req.body.userId; // Extract the user ID from the request body
          const post = await Posts.find({ _id: req.params.id, likes: userId });
      
          if (post.length > 0) {
            return res.status(400).json({ msg: "You liked this post." });
          }
      
          const like = await Posts.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { likes: userId } },
            { new: true }
          );
      
          if (!like) {
            return res.status(400).json({ msg: 'This post does not exist.' });
          }
      
          res.json({ msg: 'Liked Post!' });
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
      unLikePost: async (req, res) => {
        try {
          const userId = req.body.userId; // Extract the user ID from the request body
      
          const like = await Posts.findOneAndUpdate(
            { _id: req.params.id },
            { $pull: { likes: userId } },
            { new: true }
          );
      
          if (!like) {
            return res.status(400).json({ msg: 'This post does not exist.' });
          }
      
          res.json({ msg: 'Unliked Post!' });
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
    getUserPosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({user: req.params.id}), req.query)
            .paginating()
            const posts = await features.query.sort("-createdAt")

            res.json({
                posts,
                result: posts.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getPost: async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id)
            .populate("user likes", "avatar username fullname followers")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })

            if(!post) return res.status(400).json({msg: 'This post does not exist.'})

            res.json({
                post
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getPostsDicover: async (req, res) => {
        try {

            const newArr = [...req.user.following, req.user._id]

            const num  = req.query.num || 9

            const posts = await Posts.aggregate([
                { $match: { user : { $nin: newArr } } },
                { $sample: { size: Number(num) } },
            ])

            return res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

        deletePost: async (req, res) => {
            try {
                const post = await Posts.findOneAndDelete({ _id: req.params.id, user: authCtrl.getLoggedInUserId() });
    
                // Check if the post exists
                if (!post) {
                    return res.status(404).json({ msg: 'Post not found' });
                }
    
                res.json({
                    msg: 'Deleted Post!',
                    newPost: {
                        ...post,
                        user: req.user
                    }
                });
    
            } catch (err) {
                console.error('Error deleting post:', err);
                return res.status(500).json({ msg: err.message });
            }
        },
    savePost: async (req, res) => {
        try {
          const { userId } = req.body; // Assuming userId is sent from the frontend
          const loggedInUserId = userId; // Use userId from the frontend
      
          // Check if the post is already saved by the user
          const user = await Users.find({ _id: loggedInUserId, saved: req.params.id });
          if (user.length > 0) return res.status(400).json({ msg: "You saved this post." });
      
          // Update the logged-in user's saved array with the new post ID
          const save = await Users.findOneAndUpdate(
            { _id: loggedInUserId },
            { $push: { saved: req.params.id } },
            { new: true }
          );
          if (!save) return res.status(400).json({ msg: 'This user does not exist.' });
      
          res.json({ msg: 'Saved Post!' });
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
      
      unSavePost: async (req, res) => {
        try {
          const { userId } = req.body; // Assuming userId is sent from the frontend
          const loggedInUserId = userId; // Use userId from the frontend
      
          // Remove the post ID from the logged-in user's saved array
          const save = await Users.findOneAndUpdate(
            { _id: loggedInUserId },
            { $pull: { saved: req.params.id } },
            { new: true }
          );
      
          if (!save) return res.status(400).json({ msg: 'This user does not exist.' });
      
          res.json({ msg: 'Unsaved Post!' });
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
      
    //   getAllPosts: async (req, res) => {
    //     try {
    //       const allPosts = await Posts.find(); // Fetch all posts
      
    //       // Assuming req.user contains the saved post IDs for the logged-in user
    //       const savedPostIds = req.user.saved;
      
    //       // Filter out saved posts from all posts
    //       const savedPosts = allPosts.filter(post => savedPostIds.includes(post._id));
      
    //       res.json({
    //         savedPosts,
    //         result: savedPosts.length
    //       });
    //     } catch (err) {
    //       return res.status(500).json({ msg: err.message });
    //     }
    //   },
      
}

module.exports = postCtrl