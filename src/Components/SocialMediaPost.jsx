import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShareSquare, FaBookmark } from 'react-icons/fa';
import CreatePost from './CreatePost';

const SocialMediaPost = ({ username, avatar, image, caption }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md shadow-md p-4 max-w-md mx-auto my-4">
      {/* <div className="flex items-center mb-4">
        <img src={avatar} alt={`${username}'s avatar`} className="h-8 w-8 rounded-full mr-2" />
        <span className="font-semibold">{username}</span>
      </div>
      <div className="mb-4">
        <img src={image} alt="Posted content" className="w-full rounded-md" />
      </div>
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <button onClick={handleLike}>
            {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
          <FaComment />
          <FaShareSquare />
        </div>
        <div>
          <button onClick={handleSave}>
            {isSaved ? <FaBookmark className="text-blue-500" /> : <FaBookmark />}
          </button>
        </div>
      </div>
      <div className="mb-2">
        <span className="font-semibold">{username}</span>
        <span className="ml-1">{caption}</span>
      </div>
      <div>
        <span>{likesCount} likes</span>
  </div>*/}
      {/* <CreatePost/> */}
    </div> 
  );
};

export default SocialMediaPost;
