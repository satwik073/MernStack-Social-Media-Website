import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../Redux/UserContext';
import io from 'socket.io-client';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import '../Stylesheets/Global.css';
import { FaComment } from 'react-icons/fa';  // Import chat icon (you may need to install react-icons)

const MessagesSection = () => {
  const [allProfiles, setAllProfiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const { userData } = useUser();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (msg) => {
      if (selectedUser === msg.sender || selectedUser === msg.recipient) {
        setConversation((prevConversation) => [...prevConversation, msg]);
      }
    };

    socket.on('addMessageToClient', handleIncomingMessage);

    return () => {
      socket.off('addMessageToClient', handleIncomingMessage);
    };
  }, [selectedUser, socket]);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profiles');
      setAllProfiles(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchMessages = async (loggedInUserId, selectedUserId) => {
    try {
      const messagesResponse = await axios.get(`http://localhost:5000/api/message/${selectedUserId}`);
      const messages = messagesResponse.data.messages;
      setConversation(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleUserClick = async (userId) => {
    setSelectedUser(userId);
    await fetchMessages(userData.userId, userId);
  };

  const handleSendMessage = async () => {
    try {
      await axios.post('http://localhost:5000/api/message', {
        sender: userData.userId,
        recipient: selectedUser,
        text: newMessage,
        media: [],
        call: null,
      });

      socket.emit('addMessage', {
        sender: userData.userId,
        recipient: selectedUser,
        text: newMessage,
      });

      await fetchMessages(userData.userId, selectedUser);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-screen messages-section shadow-xl">
      <div className="w-1/4 max-h-[90vh] hideScroll overflow-y-auto hide-scroll mt-5 bg-white  p-4 sidebar">
        <h1 className="mb-4 text-lg textFlex font-semibold">Users</h1>
        <ul>
          {allProfiles.map((profile) => (
            <li
              key={profile._id}
              onClick={() => handleUserClick(profile._id)}
              className={`flex mb-2 p-2 cursor-pointer hover:bg-blue-500 hover:text-white rounded-md transition duration-300 ease-in-out transform hover:scale-105 ${
                selectedUser === profile._id ? 'bg-blue-500 text-white' : ''
              }`}
            >
              <img src={profile.avatar} className="w-11 h-11 rounded-full mr-2" alt="" />
              <div>
                <p className="text-sm font-semibold text-flex">@{profile.username}</p>
                <p className="text-xs">{profile.fullname}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 p-4 hideScroll bg-white conversation">
        {!selectedUser ? (
          <div className="flex items-center justify-center h-full  space-x-3">
            <FaComment className="text-8xl text-gray-800" />
            <p className='text-5xl textFlex'>Chat Messenger</p>
          </div>
        ) : (
          <>
            <h1 className="mb-4 text-lg font-semibold  textFlex text-gray-800">Conversation</h1>
            <div className='flex items-center justify-between h-[4rem] w-full bg-white p-2 mb-4'>
              <div className='flex items-center'>
                <img src={allProfiles.find((profile) => profile._id === selectedUser)?.avatar} className='w-8 h-8 rounded-full mr-2' alt='' />
                <div>
                  <p className='text-sm font-semibold text-gray-800'>{allProfiles.find((profile) => profile._id === selectedUser)?.username}</p>
                  <p className='text-xs text-gray-500'>{allProfiles.find((profile) => profile._id === selectedUser)?.fullname}</p>
                </div>
              </div>
              <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none' onClick={() => setSelectedUser(null)}>Back</button>
            </div>
            {conversation.length === 0 ? (
              <p className="text-black bg-gray-100 h-[65vh] flex items-center justify-center textFlex">Start a conversation with {allProfiles.find((profile) => profile._id === selectedUser)?.username}</p>
            ) : (
              <ul className="h-[65vh] hideScroll overflow-y-auto p-4 border border-gray-300 rounded hide-scroll bg-gray-100">
                {conversation
                  .slice()
                  .reverse()
                  .map((message) => (
                    <li
                      key={message._id}
                      className={`flex mb-2 ${message.sender === userData.userId ? 'self-end justify-end' : 'self-start'
                        }`}
                    >
                      {message.sender !== userData.userId && (
                        <img
                          src={allProfiles.find((profile) => profile._id === message.sender)?.avatar}
                          className="w-8 h-8 rounded-full mb-1 mr-2"
                          alt=""
                        />
                      )}
                      <div
                        className={`rounded-3xl p-5 max-w-[70%] ${message.sender === userData.userId ? 'rounded-br-none px-8 py-2 textFlexed bg-blue-500 text-white' : 'bg-gray-600 rounded-bl-none text-white px-8 py-2 textFlexed'
                          } shadow-md`}
                      >
                        {message.text}
                      </div>
                      {message.sender === userData.userId && (
                        <img src={userData.avatar} className="w-8 h-8 rounded-full mb-1 ml-2" alt="" />
                      )}
                    </li>
                  ))}
              </ul>
            )}
            <div className="mt-4 flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-3/4 textFlexed p-3 mr-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-gray-100"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesSection;
