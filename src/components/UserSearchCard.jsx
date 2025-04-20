


import React from 'react';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserSearchCard = ({ user, onClose }) => {
  const navigate = useNavigate();
  const LoggedInUser = useSelector(state => state.user);

  const handleClick = () => {
    //here user._id is Reciver's id
    // if(user._id === LoggedInUser._id) {
    //   alert("You can't message yourself!");
    //   return;
    // }
    navigate(`/${user._id}`);
    onClose();
  };

  return (
    <div
      onClick={handleClick}
      className='flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border hover:border-primary rounded cursor-pointer'
    >
      <div>
        <Avatar
          width={50}
          height={50}
          name={user?.name}
          imageUrl={user?.profile_pic}
          userId={user?._id}
        />
      </div>
      <div>
        <div className='font-semibold text-ellipsis line-clamp-1'>
          {user?.name}
        </div>
        <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
      </div>
    </div>
  );
};

export default UserSearchCard;