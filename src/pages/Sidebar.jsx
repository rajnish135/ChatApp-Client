import React, { useEffect, useState } from 'react';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { FaUserPlus } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import Avatar from '../components/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { FiArrowUpLeft } from 'react-icons/fi';
import axios from 'axios';
import SearchUser from '../components/SearchUser';
import { FaImage } from 'react-icons/fa6';
import { FaVideo } from 'react-icons/fa6';
import { logout } from '../components/redux/userSlice';

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [curentUserConversationData, setCurrentUserConversationData] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const socketConnection = useSelector((state) => state?.user?.socketConnection);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {

    if(socketConnection) {
      socketConnection?.emit('sidebar', user?._id);

      socketConnection.on('conversation',(data) => {
        
        console.log("All conversation data b/w loggedIn user and any other user", data);
      
        const conversationUserData = data?.map((conversationUser,index)=>
        {
          //logged in user is both sender & reciever
          if(conversationUser?.sender?._id === conversationUser?.receiver?._id)
          {
              return{
                  ...conversationUser,
                  userDetails : conversationUser?.sender
              }
          }
          //logged in user is sender,so to show reciver on sidebar an extra property userDetails is added.
          else if( user?._id !== conversationUser?.receiver?._id )
          {
              return{
                  ...conversationUser,
                  userDetails : conversationUser?.receiver
              }
          }
          //logged in user is reciever,so to show sender on sidebar an extra property userDetails is added. 
          else if(user?._id === conversationUser?.receiver?._id )
          {
              return{
                  ...conversationUser,
                  userDetails : conversationUser?.sender
              }
          }
      })

      setCurrentUserConversationData(conversationUserData)
        
      });
    }
   
    return () => {
      if(socketConnection) {
        socketConnection?.off('conversation');
      }
    };
  }, [socketConnection, user]);


  const handleLogout = async () => {
    await axios.get('http://localhost:8000/api/logout', { withCredentials: true });
    dispatch(logout());
    navigate('/email');
    localStorage.clear();
  };
  

  return (
    <div className="w-full h-full grid grid-cols-[48px_1fr] bg-white">
      {/* Left Sidebar */}
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
                isActive && 'bg-slate-200'
              }`
            }
            title="chat"
          >
            <IoChatbubbleEllipses size={20} />
          </NavLink>

          <div
            title="add friend"
            onClick={() => setOpenSearchUser(true)}
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
          >
            <FaUserPlus size={20} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="mx-auto cursor-pointer"
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>
          <button
            title="logout"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            onClick={handleLogout}
          >
            <span className="-ml-2">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-full bg-slate-200">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-800">Message</h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>

        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {curentUserConversationData.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to start a conversation with.
              </p>
            </div>
          )
          }

          {
              curentUserConversationData.map((conv,index)=>{
                   return(
                    <NavLink to={"/" + conv?.userDetails?._id} key={conv?.id} className='flex items-center gap-2 px-2 py-3 border border-transparent hover:border-green-300 hover:bg-slate-100 rounded cursor-pointer'>
                        <div>
                           <Avatar 
                              imageUrl={conv?.userDetails?.profile_pic}
                              name={conv?.userDetails?.name}
                              width={40}
                              height={40}
                           />
                        </div>
                        <div>
                          <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv?.userDetails?.name}</h3>
                          
                          <div className='text-xs text-slate-500 flex items-center gap-2'>
                              <div className='flex items-center gap-1'>
                                {
                                   conv?.lastMsg?.imageUrl && (
                                    <div className='flex items-center gap-1'>
                                      <span><FaImage/></span>
                                      {!conv?.lastMsg?.text && <span>Image</span>}
                                    </div>
                                   )
                                }

                                {
                                   conv?.lastMsg?.videoUrl && (
                                    <div className='flex items-center gap-1'>
                                      <span><FaVideo/></span>
                                      {!conv?.lastMsg?.text && <span>Video</span>}
                                    </div>
                                   )
                                }
                              </div>
                             <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                          </div>
                        </div>
                          
                        {
                            Boolean(conv?.unseenMsg)  && <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-green-500 text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>

                        }
                        
                    </NavLink>
                   )

              })
          }

          
        </div>
      </div>

      {/* Edit User Details */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/* Search User */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;