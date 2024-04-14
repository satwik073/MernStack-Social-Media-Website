import React, { useState } from 'react';
import axios from 'axios';
import '../Stylesheets/Global.css';
import { useUser } from '../Redux/UserContext';
import EmojiPicker from 'emoji-picker-react';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [message, setMessage] = useState('');
  const { userData } = useUser();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  console.log(userData);

  const handlePostCreation = async () => {
    try {
      const postData = {
        content,
        images: imageUrls.split(',').map(url => url.trim()), // Pass image URLs instead of files
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Add your token logic here
        },
      };

      const response = await axios.post('http://localhost:5000/api/posts', postData, config);

      setMessage(response.data.msg); // Set success message if needed
      // Clear form fields after successful post creation
      setContent('');
      setImageUrls('');
      console.log('Post Created Successfully');
    } catch (error) {
      console.error('Error creating post:', error);
      // Handle error scenarios and set appropriate messages or behaviors
    }
  };
  const addEmoji = (event, emojiObject) => {
    if (emojiObject && emojiObject.emoji) {
      const emoji = emojiObject.emoji;
      setContent(prevContent => prevContent + emoji);
    }
  };

  return (
    <div className="bg-white rounded-md p-4 w-[70vh] mx-auto my-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePostCreation();
        }}
        className="flex flex-col space-y-4"
      >
        <div className=' flex space-x-4 mb-2'>
          <div className="avatar flex items-center py-1">
            <img src={userData.avatar} className="rounded-full h-11 w-11 object-cover" alt="" />
          </div>
          <div className="suggestDetails flex items-center">
            <div>
              <p className="text-xs font-semibold textFlex">@{userData.username}</p>
              <p className="text-xs">{userData.fullname}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <textarea
            id="postContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your post content"
            className="border border-gray-300 textFlexed w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>
          {/* <EmojiPicker onEmojiClick={addEmoji} /> */}

        <label htmlFor="imageUrls" className="text-lg font-semibold textFlex">
          Add Your Image Url
        </label>
        <input
          id="imageUrls"
          type="text"
          value={imageUrls}
          onChange={(e) => setImageUrls(e.target.value)}
          placeholder="Enter image URLs separated by commas"
          className="border border-gray-300 textFlexed rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-black text-white py-2 rounded-md hover:bg-white hover:text-black hover:border-[1px] hover:border-black focus:outline-none "
        >
          Create Post
        </button>
      </form>
      {message && <p className="text-green-600">{message}</p>}
    </div>
  );
};

export default CreatePost;
