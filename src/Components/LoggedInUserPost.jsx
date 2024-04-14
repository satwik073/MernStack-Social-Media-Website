// LoggedInUserPosts.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../Redux/UserContext'; // Replace with the appropriate path to your useUser hook
import { FaThumbsUp, FaComment, FaShare, FaBookmark } from 'react-icons/fa';
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from 'react-icons/go';
import "../Stylesheets/Global.css"
import { TfiCommentAlt } from "react-icons/tfi";
import { BsBookmark } from "react-icons/bs";
import { PiPaperPlaneTiltLight } from "react-icons/pi";
import { BsThreeDotsVertical } from "react-icons/bs";
import ShareModal from '../Pages/ShareModal';
const LoggedInUserPosts = () => {
    const { userData } = useUser(); // Assuming useUser provides userData with user details including userID
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    const handleLike = async (postId) => {
        try {
            // Check if the post is already liked
            const isLiked = posts.find((post) => post._id === postId)?.likes.includes(userData.userId);

            if (!isLiked) {
                // Make a PATCH request to like the post by its ID
                await axios.patch(`http://localhost:5000/api/post/${postId}/like`, { userId: userData.userId });

                // Update the UI by changing the heart icon color to red
                const updatedPosts = posts.map((post) => {
                    if (post._id === postId) {
                        return { ...post, likes: [...post.likes, userData.userId] };
                    }
                    return post;
                });
                setPosts(updatedPosts);
                console.log("Post Liked")
            } else {
                // If already liked, unlike the post
                handleUnlike(postId);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };
    const [showShareModal, setShowShareModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
  
    const openShareModal = (post) => {
      setCurrentPost(post);
      setShowShareModal(true);
    };
  
    const closeShareModal = () => {
      setShowShareModal(false);
    };

    const handleUnlike = async (postId) => {
        try {
            // Make a PATCH request to unlike the post by its ID
            await axios.patch(`http://localhost:5000/api/post/${postId}/unlike`, { userId: userData.userId });

            // Update the UI by changing the heart icon color to black
            const updatedPosts = posts.map((post) => {
                if (post._id === postId) {
                    return { ...post, likes: post.likes.filter((like) => like !== userData.userId) };
                }
                return post;
            });
            setPosts(updatedPosts);
            console.log("Post UnLiked")
        } catch (error) {
            console.error('Error unliking post:', error);
        }
    };

    const handleComment = (postId) => {
        // Handle comment functionality, e.g., open a modal to add comments
    };

    const handleShare = (postId) => {
        // Implement the logic for sharing a post, e.g., open a share dialog
    };

    const handleSave = async (postId) => {
        try {
            // Make a POST request to your backend endpoint for saving a post
            const response = await axios.post(`http://localhost:5000/api/posts/${postId}/save`);

            // Handle successful save, maybe show a success message
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };
    const [showComments, setShowComments] = useState({});

    // Function to toggle comment visibility for a post
    const toggleComments = (postId) => {
        setShowComments((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));
    };

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/Allposts`); // Adjust the endpoint according to your backend route
                const filteredPosts = response.data.posts.filter(post => post.loggedInUserId === userData.userId);
                setPosts(filteredPosts);
                console.log(filteredPosts);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        if (userData.userId) {
            fetchUserPosts();
        }
    }, [userData.userId]);

    return (
        <div className="flex flex-col  mt-8">

            <div className="grid grid-cols-1 p-4 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <div key={post._id} className="bg-white p-4 rounded-md shadow-md">
                        <div className=' flex space-x-4 mb-2'>

                            <div className="avatar flex items-center py-1">
                                <img src={userData.avatar} className="rounded-full h-11 w-11 object-cover" alt="" />
                            </div>
                            <div className="suggestDetails flex items-center w-full justify-between">
                                <div>

                                    <p className="text-xs font-semibold textFlex">@{userData.username}</p>
                                    <p className="text-xs">{userData.fullname}</p>
                                </div>
                                <BsThreeDotsVertical />
                            </div>
                        </div>
                        <img
                            src={post.images}
                            alt="Post"
                            className="w-full h-64 object-cover rounded-md mb-4"
                        />
                        <p className="text-gray-800 textFlexed">{post.content}</p>

                        {/* Buttons */}
                        <div className="p-4 flex justify-between">
                            <div className=' flex space-x-4'>
                                {post.likes.includes(userData.userId) ? (
                                    <button onClick={() => handleUnlike(post._id)} className="flex items-center space-x-1 text-gray-500">
                                        <GoHeartFill id={`likeIcon_${post._id}`} className="h-6 w-6" style={{ color: 'red' }} />
                                        <p>{post.likes.length}</p>
                                        <span></span>
                                    </button>
                                ) : (
                                    <button onClick={() => handleLike(post._id)} className="flex items-center space-x-1 text-gray-500">
                                        <GoHeart id={`likeIcon_${post._id}`} className="h-6 w-6" style={{ color: 'black' }} />
                                        <p>{post.likes.length}</p>
                                        <span></span>
                                    </button>
                                )}
                                <button onClick={() => handleLike(post._id)} className="flex items-center space-x-1 text-gray-500">
                                    <TfiCommentAlt className="h-6 w-6" />
                                    <p>{post.comments.length}</p>
                                    <span></span>
                                </button>
                                <button onClick={() => openShareModal(post)} className="flex items-center space-x-1 text-gray-500">
                                    <PiPaperPlaneTiltLight className="h-6 w-6" />
                                    <span></span>
                                </button>
                            </div>
                            <button onClick={() => handleShare(post._id)} className="flex items-center space-x-1 text-gray-500">
                                <BsBookmark className="h-6 w-6" />
                                <span></span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <ShareModal
        isOpen={showShareModal}
        onClose={closeShareModal}
        shareUrl={currentPost ? `http://localhost:5000/api/posts/${currentPost._id}` : ''}
        title={currentPost ? 'Check out this post!' : ''}
      />
        </div>
    );
};

export default LoggedInUserPosts;
