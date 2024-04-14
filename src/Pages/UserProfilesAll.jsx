import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GoHeartFill } from 'react-icons/go';
import { FiEdit } from 'react-icons/fi'; // Import FiEdit icon here
import LoggedInUserPosts from '../Components/LoggedInUserPost';
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoHeart } from "react-icons/go";
import "../Stylesheets/Global.css"
import { TfiCommentAlt } from "react-icons/tfi";
import { BsBookmark } from "react-icons/bs";
import { PiPaperPlaneTiltLight } from "react-icons/pi";
import { useUser } from '../Redux/UserContext';
import ShareModal from './ShareModal';
const UserProfilesAll = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState();
  const [searchedUserPosts, setSearchedUserPosts] = useState([])
  const {userData}= useUser();
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
      } catch (error) {
        console.error('Error fetching searched user posts:', error);
      }
    };

    if (userId) {
      fetchUserProfile();
      fetchSearchedUserPosts();
    }
  }, [userId]);
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  const openShareModal = (post) => {
    setCurrentPost(post);
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
  };

  return (
    <div className='max-h-full  overflow-y-auto hideScroll'>
      {userProfile ? (
        <div className="  rounded-md max-h-full  overflow-y-auto hideScroll">

          <div className="w-full mx-auto">
            <div className="relative w-full lg:h-72 h-40 flex">
              <img
                src={userProfile.coverPhoto}
                className="w-full h-full object-center object-cover rounded-t-md"
                alt="Cover"
              />
              <div className="absolute w-full md:px-16 px-12 bottom-0 flex justify-center md:justify-start lg:top-[70%] top-[60%] left-1/2 transform -translate-x-1/2 -mb-8">
                <img
                  src={userProfile.avatar}
                  alt="User Avatar"
                  className="w-32 h-32 md:w-44 md:h-44 rounded-full border-8 border-white shadow-xl"
                />
              </div>
            </div>
            <div className="bg-white rounded-b-md p-4 md:p-6 flex justify-between">
              <div className="UserDetails md:pt-[7rem] pt-[5rem] px-4 ">
                <div className="md:text-5xl text-3xl font-semibold textFlex">{userProfile.fullname}</div>
                <div className="md:text-md text-xs text-white mt-5 textFlexed bg-black w-fit p-2 px-5 rounded-full">
                  @{userProfile.username}
                </div>
                <div className="md:text-lg text-sm mt-6 text-gray-600 textFlexed">{userProfile.mobile}</div>
                <div className="md:text-lg text-sm text-gray-600 textFlexed">{userProfile.address}</div>
                <div className="md:text-lg text-sm mt-4 text-gray-600 mb-4 textFlexed">{userProfile.story}</div>
                <div className="md:text-lg text-sm mt-2 text-gray-600 mb-4 textFlexed">{userProfile.website}</div>
              </div>

              <div className="md:pt-[7rem] pt-[5rem] px-4">

              </div>
            </div>
            <div className="flex md:px-6 md:w-1/3 w-full px-16 justify-between">
              <div>
                <div className="flex justify-center font-bold text-3xl">
                  {userProfile.followers.length}
                </div>
                <div className="text-md font-bold p-2 px-4 rounded-full mb-4 textFlex cursor-pointer">
                  Followers
                </div>
              </div>
              <div>
                <div className="flex justify-center font-bold text-3xl">
                  {userProfile.following.length}
                </div>
                <div className="text-md font-bold p-2 px-4 rounded-full mb-4 textFlex cursor-pointer">
                  Following
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col  mt-8">
            <h1 className="md:text-xl text-lg textFlex font-bold mb-6 px4 md:px-11">Posts</h1>
            <div className="grid grid-cols-1 p-4 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {searchedUserPosts.map((post) => (
                <div key={post._id} className="bg-white p-4 rounded-md shadow-md">
                  <div className=' flex space-x-4 mb-2'>

                    <div className="avatar flex items-center py-1">
                      <img src={userProfile.avatar} className="rounded-full h-11 w-11 object-cover" alt="" />
                    </div>
                    <div className="suggestDetails flex items-center justify-between w-full">
                      <div>

                        <p className="text-xs font-semibold textFlex">@{userProfile.username}</p>
                        <p className="text-xs">{userProfile.fullname}</p>
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
                </div>



              ))}
            </div>
          </div>
        </div>
      ) : (
        <p></p>
      )}
       <ShareModal
        isOpen={showShareModal}
        onClose={closeShareModal}
        shareUrl={currentPost ? `http://localhost:5000/api/posts/${currentPost._id}` : ''}
        title={currentPost ? 'Check out this post!' : ''}
      />
    </div>

  );
};

export default UserProfilesAll;
