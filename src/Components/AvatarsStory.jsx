import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const AvatarsStory = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profiles');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    console.log(`User clicked: ${userId}`);
    navigate(`/user-profiles/${userId}`);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Number of avatars displayed at once
    slidesToScroll: 1,
    variableWidth: true, // Enables variable width slides
    swipeToSlide: true, // Allows swiping to slide
    focusOnSelect: true, // Focuses on slide when selected
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className='w-full mt-5'>
        <h1 className='font-semibold text-xl textFlex'>Stories Section</h1>
    <Slider className=' w-full mt-5' {...settings}>
      {users.map((user) => (
       <div key={user._id} className="md:mx-2 mx-1 w-full" style={{ width: 'auto' }}>
       <div className='md:border-[1px] border-[1px] md:h-20 md:w-20 h-16 w-16 border-[#0D76E3] rounded-full overflow-hidden'>
      
         <img
           src={user.avatar}
           className="rounded-full h-full w-full p-1 object-cover cursor-pointer"
           alt=""
           onClick={() => handleUserClick(user._id)}
         />
        
       </div>
     </div>
      ))}
    </Slider>
    </div>
  );
};

export default AvatarsStory;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// const AvatarsStory = () => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [isVideoCallOpen, setVideoCallOpen] = useState(false);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/profiles');
//         setUsers(response.data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleUserClick = (userId) => {
//     console.log(`User clicked: ${userId}`);
//     // Open the video call
//     setVideoCallOpen(true);
//     // Open the camera
//     openCamera();
//     // Navigate to the user profile (optional)
//     navigate(`/user-profiles/${userId}`);
//   };

//   const closeVideoCall = () => {
//     // Close the video call
//     setVideoCallOpen(false);
//     // Close the camera
//     closeCamera();
//   };

//   const openCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });

//       // Create a video element for the camera stream
//       const cameraVideo = document.createElement('video');
//       cameraVideo.srcObject = stream;
//       cameraVideo.autoplay = true;
//       cameraVideo.setAttribute('playsinline', 'true');
//       cameraVideo.setAttribute('id', 'camera-video');
//       document.body.appendChild(cameraVideo);
//     } catch (error) {
//       console.error('Error accessing camera:', error);
//     }
//   };

//   const closeCamera = () => {
//     // Remove the video element
//     const cameraVideo = document.getElementById('camera-video');
//     if (cameraVideo) {
//       cameraVideo.srcObject.getTracks().forEach((track) => track.stop());
//       cameraVideo.parentNode.removeChild(cameraVideo);
//     }
//   };

//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3, // Number of avatars displayed at once
//     slidesToScroll: 1,
//     variableWidth: true, // Enables variable width slides
//     swipeToSlide: true, // Allows swiping to slide
//     focusOnSelect: true, // Focuses on slide when selected
//     responsive: [
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 2,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//     ],
//   };

//   return (
//     <div className='w-full mt-5'>
//       <h1 className='font-semibold text-xl textFlex'>Stories Section</h1>
//       <Slider className='w-full mt-5' {...settings}>
//         {users.map((user) => (
//           <div key={user._id} className='md:mx-2 mx-1 w-full' style={{ width: 'auto' }}>
//             <div className='md:border-[1px] border-[1px] md:h-20 md:w-20 h-16 w-16 border-[#0D76E3] rounded-full overflow-hidden'>
//               <img
//                 src={user.avatar}
//                 className='rounded-full h-full w-full p-1 object-cover cursor-pointer'
//                 alt=''
//                 onClick={() => handleUserClick(user._id)}
//               />
//             </div>
//           </div>
//         ))}
//       </Slider>

//       {isVideoCallOpen && (
//         <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
//           <div className='relative max-w-screen-md w-full bg-white p-4 rounded-lg'>
//             <button
//               className='absolute top-2 right-2 text-black text-2xl cursor-pointer'
//               onClick={closeVideoCall}
//             >
//               Close
//             </button>
//             <div className='w-full h-full flex items-center justify-center'>
//               <video
//                 className='rounded-lg'
//                 autoPlay
//                 playsInline
//                 id='video-call'
//               ></video>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AvatarsStory;
