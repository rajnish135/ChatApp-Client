import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { FaAngleLeft, FaImage, FaVideo } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa6';
import axios from 'axios';
import Loading from '../components/Loading';
import wallapaper from '../assets/wallapaper.jpeg';
import { IoMdSend } from 'react-icons/io';
import moment from 'moment';
import { IoMdCheckmark } from "react-icons/io";
import { PiChecksBold } from "react-icons/pi";

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector((state) => state?.user?.socketConnection);
  const user = useSelector((state) => state?.user);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profile_pic: '',
    online: false,
    _id: '',
  });
  const [message, setMessage] = useState({
    text: '',
    imageUrl: '',
    videoUrl: '',
  });
  const [allMessages, setAllmessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const photoref = useRef();
  const videoref = useRef();
  const currentMessage = useRef();
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

  useEffect(() => {
    if (socketConnection) {
      
      socketConnection.emit('message-page', params.userId);
  
      const handleMessageUser = (payload) => {
        setUserData(payload);
      };

      socketConnection.on('message-user', handleMessageUser);

      const handleConversationMessages = ({targetUserId,messages}) => {
       // Only set messages if they're for THIS conversation
      if (targetUserId === params.userId || targetUserId === user._id) {
        setAllmessages(messages);
      } }

      socketConnection.on('message', handleConversationMessages);

      return () => {
        socketConnection.off('message-user', handleMessageUser);
      };
    }
  }, [socketConnection, params, user,userData?._id]);


  //useEffect to handle seen messages 
    useEffect(() => {
      if (socketConnection && allMessages.length > 0) {
        
        // Check if the last message is from the other user and unseen
        const lastMsg = allMessages[allMessages.length - 1];

        if (lastMsg.senderId === params.userId && !lastMsg.seen) {
          socketConnection.emit('seen', params.userId);
        }
      }
    }, [allMessages, socketConnection, params.userId]);


  // Move to the latest message
  useEffect(() => {
    if (currentMessage.current ) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allMessages]);

  // Update online/offline status
  useEffect(() => {
    if (socketConnection) {
      const handleUserStatusChange = ({ userId, online }) => {
        if (userId === params.userId) {
          setUserData((prev) => ({ ...prev, online }));
        }
      };

      socketConnection.on('user-status-change', handleUserStatusChange);

      return () => {
        socketConnection.off('user-status-change', handleUserStatusChange);
      };
    }
  }, [socketConnection, params]);

  const handlePhotoClick = (e) => {
    e.preventDefault();
    photoref.current.click();
  };

  const handleVideoClick = (e) => {
    e.preventDefault();
    videoref.current.click();
  };

  const handleUploadImage = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) return;
    setOpenImageVideoUpload(false);
    await handleSendFile(file);
    setLoading(false);
  };

  const handleUploadVideo = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) return;
    setOpenImageVideoUpload(false);
    await handleSendFile(file);
    setLoading(false);
  };

  const handleSendFile = async (file) => {
    try {
      const formData = new FormData();
      if (file) formData.append('imageUrl', file);

      const res = await axios.post(
        `216.24.60.0/24` + `api/file-upload`,
        formData,
        {
          auth: {
            token: localStorage.getItem('token'),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage((prev) => ({ ...prev, imageUrl: '', videoUrl: '' }));

      if (imageExtensions.includes(res.data.extension)) {
        setMessage((prev) => ({ ...prev, imageUrl: res.data.data }));
      } else {
        setMessage((prev) => ({ ...prev, videoUrl: res.data.data }));
      }
    } catch (err) {
      console.log('Error is occurred:', err);
    }
  };

  const handleClearPhoto = () => {
    setMessage((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleClearVideo = () => {
    setMessage((prev) => ({ ...prev, videoUrl: '' }));
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setMessage((prev) => ({
      ...prev,
      text: value,
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const senderId = user?._id;
    const receiverId = params?.userId;

    if (!senderId || !receiverId) {
      console.error('Missing sender/receiver ID');
      return;
    }

    // if (senderId === receiverId) {
    //   alert('Cannot message yourself!');
    //   return;
    // }

    if (message.text || message.imageUrl || message.videoUrl) {
      socketConnection?.emit('new-message', {
        sender: senderId,
        receiver: receiverId,
        text: message?.text,
        imageUrl: message?.imageUrl,
        videoUrl: message?.videoUrl,
      });

      setMessage({
        text: '',
        imageUrl: '',
        videoUrl: '',
      });
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${wallapaper})` }}
      className="bg-no-repeat bg-cover min-h-screen w-full"
    >
      {/* Header */}
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={userData?.profile_pic}
              name={userData?.name}
              userId={userData?._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {userData?.name}
            </h3>
            <p className="-my-2 text-sm">
              {userData.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
      </header>

      {/* Messages Section */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
        
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          
          { allMessages.length>0 && allMessages?.map( (msg, index) => (
            <div
              key={index}
              className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                user._id === msg.senderId
                  ? 'ml-auto bg-teal-100'
                  : 'bg-white'
              }`}
            >
              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  className="w-full h-full object-scale-down"
                  alt="message"
                />
              )}

              {msg.videoUrl && (
                <video
                  src={msg.videoUrl}
                  className="w-full h-full object-scale-down"
                  controls
                />
              )}
               
              <p className="px-2 flex items-center gap-1.5">
                  
                  {msg.text}

                  {
                    msg.seen && params.userId !== msg.senderId ? 
                     (
                    <PiChecksBold className='text-blue-500'/>  
                     ) : 
                    (userData.online && params.userId !== msg.senderId) ? 
                        (
                        <PiChecksBold/>  
                        ) : 
                          (
                            params.userId !== msg.senderId && <IoMdCheckmark/>
                          )
                  }

              </p>
          
              <p className="text-xs ml-auto w-fit">
                {moment(msg.createdAt).format('hh:mm')}
              </p>
              
            </div>
          ))}
        </div>

        {/* Upload Image Display */}
        {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700/60 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearPhoto}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                alt="uploadImage"
              />
            </div>
          </div>
        )}

        {/* Upload Video Display */}
        {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700/60 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearVideo}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

      {/* Send Message Section */}
      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative">
          <button
            onClick={() => setOpenImageVideoUpload((prev) => !prev)}
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-green-500"
          >
            <FaPlus size={20} />
          </button>

          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
              <button onClick={handlePhotoClick}     
               className='flex items-center p-2 gap-3 px-3 cursor-pointer hover:bg-slate-200'>
               <div className='text-green-400'>
               <FaImage size={18}/>
               </div>
               <p>Image</p>
               </button>

                <input
                  type="file"
                  id="uploadImage"
                  ref={photoref}
                  onChange={handleUploadImage}
                  className="hidden"
                />

              <button onClick={handleVideoClick}     
               className='flex items-center p-2 gap-3 px-3 cursor-pointer hover:bg-slate-200'>
               <div className='text-purple-400'>
               <FaImage size={18}/>
               </div>
               <p>Video</p>
               </button>

                <input
                  type="file"
                  id="uploadVideo"
                  ref={videoref}
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          className="h-full w-full flex gap-2"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            placeholder="Type here message..."
            className="py-1 px-4 outline-none w-full h-full"
            value={message?.text}
            onChange={handleOnChange}
          />
          <button className="text-primary hover:text-green-500">
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;







/*NOTE:
params.userId is the ID of the user you are chatting with — i.e., the person whose chat you're viewing.
This makes params.userId the receiverId (from the perspective of the logged-in user).
*/
