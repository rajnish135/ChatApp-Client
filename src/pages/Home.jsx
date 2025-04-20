import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../components/redux/userSlice';
import Sidebar from './Sidebar';
import logo from '../assets/logo.png';
import { io } from 'socket.io-client';

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const socketConnection = io(`${import.meta.env.VITE_BACKEND_URL}/`, {
      auth: {
        token: localStorage.getItem('token'),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setSocketConnection(socketConnection));

    socketConnection.on('onlineUser', (data) => {
      console.log('Online User:', data);
      dispatch(setOnlineUser(data));
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token") || "";

const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user-details`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      console.log("res", res)
      console.log('Logged in UserDetails: ', res.data.data);
      dispatch(setUser(res.data.data));
      if (res.data.data.logout) {
        dispatch(logout());
        navigate('/email');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const basePath = location.pathname === '/';

  return (
    <div className='max-w-full mx-auto flex h-screen max-h-screen'>
      {/* Sidebar */}
      <section className={`bg-white ${!basePath && 'hidden'} lg:block`}>
        <Sidebar />
      </section>

      {/* Message component */}
      <section className={`${basePath && 'hidden'} flex-1`}>
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basePath ? 'hidden' : 'md:flex'
        }`}
      >
        <div>
          <img src={logo} width={250} alt='logo' />
        </div>
        <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
      </div>
    </div>
  );
};

export default Home;
