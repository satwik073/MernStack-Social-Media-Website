import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShareModal from '../Pages/ShareModal';
import { FaHeart, FaShareSquare } from 'react-icons/fa';
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import "../Stylesheets/Global.css"
import { TfiCommentAlt } from "react-icons/tfi";
import { BsBookmark } from "react-icons/bs";
import { PiPaperPlaneTiltLight } from "react-icons/pi";
import { useUser } from '../Redux/UserContext';
import { BsBookmarkCheckFill } from "react-icons/bs";
import { FacebookShareButton, TwitterShareButton } from 'react-share';

const AllPostsDisplayed = () => {
  // State variables for posts, users, saved posts
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  // Access userData and setUserData from the UserContext
  const { userData, setUserData } = useUser();


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
  const isPostSaved = (postId) => savedPosts.includes(postId);
  const isPostSavedByUser = (postId) => userData.saved.includes(postId);
  // Function to check if a post is saved by the user
  const handleSavePost = async (postId) => {
    try {
      const updatedSavedPosts = [...savedPosts, postId];
      setSavedPosts(updatedSavedPosts);

      // Make an API call to save the post for the user
      await axios.post(`http://localhost:5000/api/savePost/${postId}`, { userId: userData.userId });

      // Update UI to show the post as saved
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return { ...post, savedByUser: true };
        }
        return post;
      });
      setPosts(updatedPosts);
      console.log("saved")
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  // Function to handle unsaving a post
  const handleUnsavePost = async (postId) => {
    try {
      const updatedSavedPosts = savedPosts.filter((savedPostId) => savedPostId !== postId);
      setSavedPosts(updatedSavedPosts);

      // Make an API call to unsave the post for the user
      await axios.post(`http://localhost:5000/api/unSavePost/${postId}`, { userId: userData.userId });

      // Update UI to show the post as unsaved
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return { ...post, savedByUser: false };
        }
        return post;
      });
      setPosts(updatedPosts);
      console.log("unsaved")
      document.getElementById('')
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };

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
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});
  useEffect(() => {
    const fetchCommentsForAllPosts = async () => {
      try {
        const promises = posts.map(async (post) => {
          const response = await axios.get(`http://localhost:5000/api/post/${post._id}/comments`);
          return { postId: post._id, comments: response.data.comments };
        });

        const commentsForPosts = await Promise.all(promises);

        const updatedComments = {};
        commentsForPosts.forEach((item) => {
          updatedComments[item.postId] = item.comments;
        });

        setComments(updatedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchCommentsForAllPosts();
  }, [posts]);
  // useEffect to fetch comments for each post


  const handleComment = async (postId) => {
    try {
      // Make a POST request to add a comment to a post using the newComment state value
      await axios.post(`http://localhost:5000/api/post/${postId}/comment`, {
        postId: postId,
        content: newComment, // Use the newComment state value for the comment content
        avatar: userData.avatar,
        tag: null,
        reply: null,
        username: userData.username, // Include the username from userData
        postUserId: userData.userId,
      });

      // Clear the input field after posting the comment
      setNewComment(""); // Reset the input field after posting
      // Update the UI or perform any necessary actions upon successful comment posting
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };
  // State variable for comments
  const handleShare = (postId) => {
    // Placeholder function to handle sharing posts
    console.log(`Shared post with ID: ${postId}`);
  };

  const filteredPosts = posts.filter(post =>
    users.some(user => user._id === post.loggedInUserId)
  );
  // const fetchSavedPosts = async () => {
  //   try {
  //     const savedResponse = await axios.get('http://localhost:5000/api/getSavePosts');
  //     setSavedPosts(savedResponse.data.savedPosts);
  //   } catch (error) {
  //     console.error('Error fetching saved posts:', error);
  //   }
  // };

  // useEffect(() => {

  //   fetchSavedPosts(); // Fetch saved posts on component mount
  // }, []);
  const [showComments, setShowComments] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyingToComment, setReplyingToComment] = useState(null); // Track the comment being replied to

  const handleReply = async (commentId, postId, replyContent) => {
    try {
      await axios.post(`http://localhost:5000/api/comment/${commentId}/reply`, {
        parentId: commentId,
        content: replyContent,
        userId: userData.userId,
        username: userData.username,
        avatar: userData.avatar,
      });

      // Upon successful reply, reset replyContent and replyingToComment
      setReplyContent('');
      setReplyingToComment(null);

      // Fetch comments again or update UI as needed
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const openShareModal = (post) => {
    setCurrentPost(post);
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
  };
  // Function to toggle comment visibility for a post
  const toggleComments = (postId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };
  const getTimeDifference = (commentDate) => {
    const currentTime = new Date();
    const commentTime = new Date(commentDate);
    const difference = currentTime.getTime() - commentTime.getTime();
    const minutes = Math.floor(difference / 60000);

    if (minutes < 1) {
      return 'Just now';
    } else if (minutes === 1) {
      return '1 minute ago';
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else {
      const hours = Math.floor(minutes / 60);
      if (hours === 1) {
        return '1 hour ago';
      } else if (hours < 24) {
        return `${hours} hours ago`;
      } else {
        const days = Math.floor(hours / 24);
        if (days === 1) {
          return '1 day ago';
        } else {
          return `${days} days ago`;
        }
      }
    }
  };
  const handleLikeComment = async (postId, commentId, isLiked) => {
    try {
      console.log(commentId);
      console.log(postId)
      if (!isLiked) {
        // Like the comment
        await axios.patch(`http://localhost:5000/api/comment/${commentId}/like`, {
          userId: userData.userId, // Assuming userData contains the user ID
        });
      } else {
        // Unlike the comment
        await axios.patch(`http://localhost:5000/api/comment/${commentId}/unlike`, {
          userId: userData.userId, // Assuming userData contains the user ID
        });
      }

      // Update UI after successfully liking/unliking the comment
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          const updatedComments = post.comments.map((comment) => {
            if (comment._id === commentId) {
              if (!isLiked) {
                return { ...comment, likes: [...comment.likes, userData.userId] };
              } else {
                return {
                  ...comment,
                  likes: comment.likes.filter((like) => like !== userData.userId),
                };
              }
            }
            return comment;
          });
          return { ...post, comments: updatedComments };
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error liking/unliking comment:', error);
    }
  };
  return (

    <div className="container mt-8">
      <h1 className="text-xl textFlex font-bold mb-6">All Posts</h1>
      <div className="xl:p-11 lg:p-7 pt-0">
        {posts.map((post) => {

          const isSaved = userData.saved.includes(post._id);

          const user = users.find((user) => user._id === post.loggedInUserId);

          return (
            <div key={post._id} className="bg-white border rounded-2xl mb-7 overflow-hidden">
              <div className="flex items-center p-4 px-5">
                <img
                  src={user?.avatar}
                  alt=""
                  className="rounded-full h-10 w-10 object-cover mr-2"
                />
                <div className='flex justify-between w-full items-center pr-5'>
                  <div>
                    <p className="font-semibold textFlex text-sm">@{user?.username}</p>
                    <p className="font-semibold textFlexed text-sm">{user?.fullname}</p>
                  </div>
                  <p className="text-gray-600 text-xs py-1">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <img src={post.images} alt="" className="w-full  md:p-4 p-0 object-cover" style={{ height: '400px' }} />
              <div className="p-4 flex items-center">
                <img
                  src={user?.avatar}
                  alt=""
                  className="rounded-full h-10 w-10 object-cover mr-2"
                />
                {/* <h2 className="text-lg font-semibold mb-2">{post.title}</h2> */}
                <p className="text-gray-700">{post.content}</p>
              </div>
              <div className="p-4 flex justify-between">
                <div className=' flex space-x-4'>
                  {post.likes.includes(userData.userId) ? (
                    <button onClick={() => handleUnlike(post._id)} className="flex items-center space-x-1 text-gray-500">
                      <GoHeartFill id={`likeIcon_${post._id}`} className="h-6 w-6" style={{ color: 'red' }} />
                      <p> {post.likes.length} </p>
                      <span></span>
                    </button>
                  ) : (
                    <button onClick={() => handleLike(post._id)} className="flex items-center space-x-1 text-gray-500">
                      <GoHeart id={`likeIcon_${post._id}`} className="h-6 w-6" style={{ color: 'black' }} />
                      <p>{post.likes.length}</p>
                      <span></span>
                    </button>
                  )}
                  <button
                    onClick={() => toggleComments(post._id)} // Toggle comment visibility for this post
                    className="flex items-center space-x-1 text-gray-500"
                  >
                    <TfiCommentAlt className="h-6 w-6" />
                    <p>{post.comments.length}</p>
                    <span></span>
                  </button>
                  <button onClick={() => openShareModal(post)}>
                    <PiPaperPlaneTiltLight className="h-6 w-6" />
                  </button>

                </div>
                <button
                  onClick={() => {
                    // Toggle between saving and unsaving based on the current saved status
                    if (isPostSaved(post._id)) {
                      handleUnsavePost(post._id); // Unsave the post
                    } else {
                      handleSavePost(post._id); // Save the post
                    }
                  }}
                  className="flex items-center space-x-1 text-gray-500"
                >
                  {/* Update the icon based on saved/unsave status */}
                  {isPostSavedByUser(post._id) ? (
                    <BsBookmarkCheckFill className="h-6 w-6 text-black" />
                  ) : (
                    <BsBookmark className="h-6 w-6" />
                  )}
                  <span></span>
                </button>

              </div>
              <div className="p-4 ">
                {showComments[post._id] && (
                  <div className="p-4 ">
                    {comments[post._id] && comments[post._id].length > 0 ? (
                      comments[post._id].map((comment) => (
                        <div key={comment._id} className="flex mb-4 items-center  rounded-lg px-3 py-1">
                          <p className='w-full p-3'>
                            <span className="font-semibold textFlex flex text-xs w-full justify-between ">

                              <div className='flex space-x-3 items-center'>
                                <img
                                  src={comment.avatar}
                                  alt=""
                                  className="rounded-full h-8 w-8 object-cover mr-2"
                                />
                                @{comment.username}
                                <p className=' font-extralight textFlexed px-2  space-x-3'>
                                  commented on this Post
                                </p>
                              </div>

                              <span className='text-xs textFlexed text-gray-800 flex items-center'>{getTimeDifference(comment.createdAt)}</span>


                            </span>
                            <p className='w-full p-3 flex justify-between'>
                        
{/* 
                              <button onClick={() => setReplyingToComment(comment._id)}>
                                Reply
                              </button>

                         
                              {replyingToComment === comment._id && (
                                <div className="reply-input">
                                  <input
                                    type="text"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Type your reply..."
                                  />
                                  <button onClick={() => handleReply(comment._id, post._id, replyContent)}>
                                    Post Reply
                                  </button>
                                </div>
                              )}

                        
                              <div className="replies">
                                {comment.replies.map((reply) => (
                                  <div key={reply._id} className="reply">
                                    <p>{comment.username} replied to comment</p>
                                    <p>{reply.content}</p>
                                   
                                  </div>
                                ))}
                              </div> */}
                              <p className='textFlexed mt-2'>{comment.content}</p>
                              
                              {/* Like/Unlike button for comments */}
                              <div className='flex items-center space-x-1'>
                                <button onClick={() => handleLikeComment(post._id, comment._id, comment.likes.includes(userData.userId))}>
                                  {comment.likes.includes(userData.userId) ? (
                                    <GoHeartFill className="h-4 w-4 " style={{ color: 'red' }} /> // Liked icon (solid heart)
                                  ) : (
                                    <GoHeart className="h-4 w-4" /> // Not liked icon (outlined heart)
                                  )}
                                  {comment.likes.includes(userData.userId)}
                                </button>

                                <span>{comment.likes.length} </span>
                              </div>
                            </p>

                          </p>
                          {/* Add other comment details as needed */}
                        </div>
                      ))
                    ) : (
                      <p className='textFlexed'>No comments yet</p>
                    )}
                    <div className="p-4 ">
                      {/* Input field for new comment */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="border rounded-lg p-2 w-full textFlexed"
                        />
                        <button
                          onClick={() => handleComment(post._id)}
                          className="bg-black text-white py-2  px-6 rounded-md hover:bg-white hover:text-black hover:border-[1px] hover:border-black focus:outline-none "
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

      </div>

      {/* Display ShareModal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={closeShareModal}
        shareUrl={currentPost ? `http://localhost:5000/api/posts/${currentPost._id}` : ''}
        title={currentPost ? 'Check out this post!' : ''}
      />
    </div>
  );
};

export default AllPostsDisplayed;
