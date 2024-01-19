const Comments = require('../models/commentModel')
const Posts = require('../models/postModel')
const mongoose = require('mongoose');
const authCtrl=require("../controllers/authCtrl")
const commentCtrl = {
    createComment: async (req, res) => {
        try {
            const { postId, content, tag, reply, userId , username, avatar} = req.body;
            console.log(req.body)
            // Check if postId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).json({ msg: "Invalid postId." });
            }

            const post = await Posts.findById(postId);
            if (!post) {
                return res.status(400).json({ msg: "This post does not exist." });
            }
    
            const newComment = new Comments({
                user: userId, // Use the user ID passed from the frontend
                username: username, 
                avatar:avatar,
                content,
                tag,
                reply,
                postId, // Reference to the post
                postUserId: post.user // Reference to the post's user
            });
    
            await newComment.save();

            // Add the comment's ID to the post's comments array
            await Posts.findByIdAndUpdate(
                postId,
                { $push: { comments: newComment._id } },
                { new: true }
            );
    
            res.json({ newComment });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updateComment: async (req, res) => {
        try {
            const { content } = req.body
            
            await Comments.findOneAndUpdate({
                _id: req.params.id, user: authCtrl.getloggedInUserId()
            }, {content})

            res.json({msg: 'Update Success!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    likeComment: async (req, res) => {
        try {
            console.log(req.params.id)
            console.log(authCtrl.getLoggedInUserId())
          const comment = await Comments.findById(req.params.id);
          if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
          }
      
          if (comment.likes.includes(authCtrl.getLoggedInUserId())) {
            return res.status(400).json({ msg: 'You already liked this comment.' });
          }
      
          comment.likes.push(authCtrl.getLoggedInUserId());
          await comment.save();
      
          res.json({ msg: 'Liked Comment!' });
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
      
      unLikeComment: async (req, res) => {
        try {
          const comment = await Comments.findById(req.params.id);
          if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
          }
      
          if (!comment.likes.includes(authCtrl.getLoggedInUserId())) {
            return res.status(400).json({ msg: 'You have not liked this comment.' });
          }
      
          comment.likes = comment.likes.filter((like) => like.toString() !== authCtrl.getLoggedInUserId().toString());
          await comment.save();
      
          res.json({ msg: 'Unliked Comment!' });
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
      
    deleteComment: async (req, res) => {
        try {
            const comment = await Comments.findOneAndDelete({
                _id: req.params.id,
                $or: [
                    {user: authCtrl.getloggedInUserId()},
                    {postUserId: authCtrl.getloggedInUserId()}
                ]
            })

            await Posts.findOneAndUpdate({_id: comment.postId}, {
                $pull: {comments: req.params.id}
            })

            res.json({msg: 'Deleted Comment!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getCommentsByPostId: async (req, res) => {
        try {
          const { id } = req.params; // Extract the post ID from the request parameters
    
          // Retrieve comments associated with the specified post ID
          const comments = await Comments.find({ postId: id });
    
          res.json({ comments });
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
      createReply: async (req, res) => {
        try {
            const { content, parentId, userId, username, avatar } = req.body;
    
            const parentComment = await Comments.findById(parentId);
            if (!parentComment) {
                return res.status(400).json({ msg: 'Parent comment not found' });
            }
    
            const newReply = new Comments({
                content,
                reply: parentId, // Reference to parent comment
                user: userId,
                username,
                avatar,
                postId: parentComment.postId,
                postUserId: parentComment.postUserId,
            });
    
            await newReply.save();
    
            // Add the reply's ID to the parent comment's replies array
            await Comments.findByIdAndUpdate(
                parentId,
                { $push: { replies: newReply._id } },
                { new: true }
            );
    
            res.json({ newReply });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    
    // Like a reply
    likeReply: async (req, res) => {
        try {
            const reply = await Comments.findById(req.params.replyId);
            if (!reply) {
                return res.status(404).json({ msg: 'Reply not found' });
            }
    
            if (reply.likes.includes(authCtrl.getloggedInUserId())) {
                return res.status(400).json({ msg: 'You already liked this reply' });
            }
    
            reply.likes.push(authCtrl.getloggedInUserId());
            await reply.save();
    
            res.json({ msg: 'Liked Reply!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    
    // Unlike a reply
    unlikeReply: async (req, res) => {
        try {
            const reply = await Comments.findById(req.params.replyId);
            if (!reply) {
                return res.status(404).json({ msg: 'Reply not found' });
            }
    
            if (!reply.likes.includes(authCtrl.getloggedInUserId())) {
                return res.status(400).json({ msg: 'You have not liked this reply' });
            }
    
            reply.likes = reply.likes.filter((like) => like.toString() !== authCtrl.getloggedInUserId().toString());
            await reply.save();
    
            res.json({ msg: 'Unliked Reply!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
}


module.exports = commentCtrl