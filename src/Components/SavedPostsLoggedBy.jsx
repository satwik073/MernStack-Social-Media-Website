import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUser } from '../Redux/UserContext';
import { BsBookmarkFill, BsThreeDotsVertical } from "react-icons/bs";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { BsBookmarkCheckFill } from "react-icons/bs";
import "../Stylesheets/Global.css"
import { TfiCommentAlt } from "react-icons/tfi";
import { BsBookmark } from "react-icons/bs";
import { PiPaperPlaneTiltLight } from "react-icons/pi";
import ShareModal from '../Pages/ShareModal';
const SavedPostsLoggedBy = () => {
    const { userId } = useParams();
    const [users, setUsers] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const { userData, setUserData } = useUser({ saved: [] });
    console.log(userData)
    const [userProfile, setUserProfile] = useState();
    const [searchedUserPosts, setSearchedUserPosts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
                setUserProfile(response.data.user);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        const fetchSearchedUserPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/Allposts`);
                const filteredPosts = response.data.posts.filter(post => post.loggedInUserId === userId);
                setSearchedUserPosts(filteredPosts);
                console.log(filteredPosts)
            } catch (error) {
                console.error('Error fetching searched user posts:', error);
            }
        };

        if (userId) {
            fetchUserProfile();
            fetchSearchedUserPosts();
        }
    }, [userId]);

    useEffect(() => {
        // Fetch all posts and users when component mounts
        const fetchAllPosts = async () => {
            try {
                const postResponse = await axios.get('http://localhost:5000/api/Allposts');
                setPosts(postResponse.data.posts);
            } catch (error) {
                console.error('Error fetching all posts:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const userResponse = await axios.get('http://localhost:5000/api/profiles');
                setUsers(userResponse.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchAllPosts();
        fetchUsers();
    }, []);
    const [showShareModal, setShowShareModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
  
    const openShareModal = (post) => {
      setCurrentPost(post);
      setShowShareModal(true);
    };
  
    const closeShareModal = () => {
      setShowShareModal(false);
    };
    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const postResponse = await axios.get('http://localhost:5000/api/Allposts');
                const allPosts = postResponse.data.posts;
                console.log(allPosts)
                // Assuming userData contains saved post IDs in userData.saved
                const savedPostIds = userData.saved;
                console.log(savedPostIds)
                // Filter out saved posts from all posts based on matching IDs
                const filteredSavedPosts = allPosts.filter(post => savedPostIds.includes(post._id));

                setSavedPosts(filteredSavedPosts);
                console.log(filteredSavedPosts)
            } catch (error) {
                console.error('Error fetching all posts:', error);
            }
        };

        // Call the function to fetch all posts
        fetchAllPosts();
    }, [userData.saved]); // Add userData.saved to dependencies to re-run the effect when it changes

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

    useEffect(() => {
        const fetchUsersForSavedPosts = async () => {
            try {
                const usersPromises = savedPosts.map(async (post) => {
                    const userResponse = await axios.get(`http://localhost:5000/api/user/${post.loggedInUserId}`);
                    return userResponse.data.user;
                });

                const fetchedUsers = await Promise.all(usersPromises);
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error fetching users for saved posts:', error);
            }
        };

        fetchUsersForSavedPosts();
    }, [savedPosts]);

    return (
        <div>

            {/* Render saved posts here */}

            <div>

                {/* Render saved posts here */}
                <div className="grid md:grid-cols-2  lg:grid-cols-3 gap-4">
                    {savedPosts.map((post, index) => (
                        <div key={post._id} className="bg-white p-4 rounded-md shadow-md">
                            <div className='flex space-x-4 mb-2'>
                                <div className="avatar flex items-center py-1">
                                    <img src={users[index]?.avatar} className="rounded-full h-11 w-11 object-cover" alt="" />
                                </div>
                                <div className="suggestDetails flex items-center justify-between w-full">
                                    <div>
                                        <p className="text-xs font-semibold textFlex">@{users[index]?.username}</p>
                                        <p className="text-xs">{users[index]?.fullname}</p>
                                    </div>
                                    <BsThreeDotsVertical />
                                </div>
                            </div>
                            {/* Render post content */}
                            <img src={post.images} alt="Post" className="w-full h-64 object-cover rounded-md mb-4" />
                            <p className="text-gray-800">{post.content}</p>

                            {/* Buttons */}
                            <div className="flex justify-between items-center mt-4">
                                <div className="p-4 flex justify-between w-full">
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
                                            <span></span>
                                        </button>
                                        <button onClick={() => openShareModal(post)} className="flex items-center space-x-1 text-gray-500">
                                            <PiPaperPlaneTiltLight className="h-6 w-6" />
                                            <span></span>
                                        </button>
                                    </div>
                                    <button onClick={() => handleShare(post._id)} className="flex items-center space-x-1 text-black">
                                        <BsBookmarkCheckFill className="h-6 w-6" />
                                        <span></span>
                                    </button>
                                </div>
                            </div>
                        </div>




                    ))}
                </div>
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

export default SavedPostsLoggedBy;
