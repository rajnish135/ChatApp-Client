import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

const Logout = () => {
  const navigate = useNavigate();
  const socketConnection = useSelector(state => state?.user?.socketConnection)

  useEffect(() => {
    const logout = async () => {

      try {

        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
          auth: {
            token: localStorage.getItem('token'),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );

        navigate('/email');
      } 

      catch(err){
        console.error('Logout failed', err.message);
      }
    };

    logout();
  });

};

export default Logout;
