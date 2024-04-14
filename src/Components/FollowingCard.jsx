import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../Redux/UserContext';
import Logout from '../Authentication/Auth/Logout';
import { useNavigate } from 'react-router-dom';
import "../Stylesheets/Global.css"
const FollowingCard = ({ handleClose }) => {
    const [followedUsers, setFollowedUsers] = useState([]);
    const [followerUsernames, setFollowerUsernames] = useState([]);
    const [followingUsernames, setFollowingUsernames] = useState([]);
    const { userData } = useUser();
    const [users, setUsers] = useState([]);
    const handleUnfollow = async (userId) => {
        try {
            const response = await axios.patch(
                `http://localhost:5000/api/user/${userId}/unfollow`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );

            const updatedUsers = users.map((user) =>
                user._id === userId ? { ...user, followers: response.data.newUser.followers, isFollowing: false } : user
            );
            setUsers(updatedUsers);
            console.log('Unfollowed successfully');
        } catch (error) {
            console.log('Error unfollowing user: Already unfollowing the user');
        }
    };
    const navigate = useNavigate();
    // console.log(userData)
    const handleFollow = async (userId) => {
        try {
          const response = await axios.patch(
            `http://localhost:5000/api/user/${userId}/follow`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
            }
          );
    
          const updatedUsers = users.map((user) =>
            user._id === userId ? { ...user, followers: response.data.newUser.followers, isFollowing: true } : user
          );
          setUsers(updatedUsers);
          console.log(updatedUsers)
          console.log('Followed successfully');
        } catch (error) {
          console.log('Error following user: Already following the user');
        }
      };
    const getUserDetails = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
            const followers = response.data.user.followers;
            const following = response.data.user.following;

            const followersData = await Promise.all(
                followers.map(async (followerId) => {
                    const Flwrid = followerId._id
                    const followerResponse = await axios.get(`http://localhost:5000/api/user/${Flwrid}`);
                    // console.log(followerResponse.data.user.username);
                    return followerResponse.data.user;
                })
            );

            const followingData = await Promise.all(
                following.map(async (followingId) => {
                    const Flwid = followingId._id
                    const followingResponse = await axios.get(`http://localhost:5000/api/user/${Flwid}`);
                    return followingResponse.data.user;
                })
            );

            setFollowerUsernames(followersData);
            console.log(followersData)
            setFollowingUsernames(followingData);
            console.log(followingData)
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleUserClick = async (userId) => {
        console.log(`User clicked: ${userId}`);
        navigate(`/user-profiles/${userId}`);
    };
    const [followingProfiles, setFollowingProfiles] = useState([]);
    const [followedProfiles, setFollowedProfiles] = useState([]);
    useEffect(() => {
        getUserDetails(userData.userId);
    }, [userData.userId]);


    return (
        <div className="header px-8 w-full ">
             <button onClick={handleClose} className="text-gray-500 top-0 float-right text-xl focus:outline-none">
        &times;
      </button>
            {/* <Logout /> */}
            {/* <h1 className="mt-2 mb-6 font-semibold md:text-lg text-sm textFlex">My Friends</h1> */}
            <h1 className='text-xl textFlex mb-6'>People You Follow</h1>
            <div className="FriendsList  max-h-[60vh] md:w-[60vh] w-[50vh]  overflow-y-auto hideScroll ">
                {/* <div className="followers-list">
          <ul>
            {followerUsernames.map((followerData, index) => (
              <li key={index}>
                <div className="flex items-center space-x-3 mb-3 ">
                  <img src={followerData.avatar} className="rounded-full h-11 w-11 object-cover" alt="" />
                  <div>
                    <p className=' text-xs'>@{followerData.username}</p>
                    <p className=' text-xs'>{followerData.fullname}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div> */}
                <div className="following-list">
                    <ul>
                        {followingUsernames.map((followingData, index) => (
                            <div  onClick={()=>handleUserClick(followingData._id)}>
                            <li key={index}>
                                <div className="flex items-center space-x-6 mb-4 mt-6 w-full justify-between">
                                    <div className='flex space-x-3 items-center'>

                                    <img src={followingData.avatar} className="rounded-full h-16 w-16 object-cover" alt="" />
                                    <div>
                                        <p className='text-xs textFlex'>@{followingData.username}</p>
                                        <p className='text-xs'>{followingData.fullname}</p>
                                    </div>
                                    </div>
                                    <div className="FollowBtn md:block hidden">
                                        {followingData.isFollowing ? (
                                          <button className="text-white text-xs hover:bg-white hover:text-black hover:border-[1px] hover:border-black bg-black px-3 py-1 rounded-full" onClick={() => handleFollow(followingData._id)}>
                                          Follow
                                      </button>
                                        ) : (
                                            
                                              <button className="bg-red-900 text-xs text-white px-3 py-1 rounded-full" onClick={() => handleUnfollow(followingData._id)}>
                                              Unfollow
                                          </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
            {/* <h1 className="mt-6 -pb-3 font-semibold md:text-lg text-sm textFlex">Suggestions for you</h1>
      <ul className="mt-7 max-h-[29rem] overflow-y-auto ComponentsWrappedFlex" style={{ scrollbarWidth: 'none' }}>
        {users.map((user) => (
          user._id !== userData.userId &&
          !followerUsernames.some((follower) => follower._id === user._id) &&
          !followingUsernames.some((following) => following._id === user._id) && (
            <li key={user._id} className="flex items-center justify-between mb-2 rounded-lg hover:bg-gray-100 p-1">
              <div onClick={() => handleUserClick(user._id)} className="flex items-center space-x-1">
                <div className="avatar flex items-center py-1">
                  <img src={user.avatar} className="rounded-full h-11 w-11 object-cover" alt="" />
                </div>
                <div className="suggestDetails">
                  <p className="text-xs font-semibold textFlex">@{user.username}</p>
                  <p className="text-xs">{user.fullname}</p>
                </div>
              </div>
              <div className="FollowBtn md:block hidden">
                {user.isFollowing ? (
                  <button className="bg-red-900 text-xs text-white px-3 py-1 rounded-full" onClick={() => handleUnfollow(user._id)}>
                    Unfollow
                  </button>
                ) : (
                  <button className="text-white text-xs hover:bg-white hover:text-black hover:border-[1px] hover:border-black bg-black px-3 py-1 rounded-full" onClick={() => handleFollow(user._id)}>
                    Follow
                  </button>
                )}
              </div>
            </li>)
        ))}
      </ul> */}


            {/* Display Followers and Following */}

            {/* Friends section */}
            {/* <div className="friends-section">
        <h2 className="py-4 font-semibold text-lg">Friends</h2>
        <div className="following-profiles">
          <h3>Following Profiles:</h3>
          <ul>
            {followingProfiles.map((profile) => (
              <li key={profile._id}>
                <p>@{profile.username}</p>
         \
              </li>
            ))}
          </ul>
        </div>
        <div className="followed-profiles">
          <h3>Followed Profiles:</h3>
          <ul>
            {followedProfiles.map((profile) => (
              <li key={profile._id}>
                <p>@{profile.username}</p>
             
              </li>
            ))}
          </ul>
        </div>
      </div> */}
        </div>
    );
};

export default FollowingCard;
