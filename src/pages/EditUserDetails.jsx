
import React, { useRef, useState } from 'react';
import Avatar from '../components/Avatar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../components/redux/userSlice';
import Divider from './Divider';

const EditUserDetails = ({ onClose, user }) => {
  const dispatch = useDispatch();
  const uploadPhotoRef = useRef();

  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic,
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const triggerFileInput = (e) => {
    e.preventDefault();
    uploadPhotoRef.current.click();
  };

  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    console.log('Uploaded file is :', file);

    if (file) {
      setData((prev) => ({
        ...prev,
        file,
        profile_pic: URL.createObjectURL(file), // show preview of uploaded image by creating local url
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.file) formData.append('profile_pic', data.file);
      const token =  localStorage.getItem('token')

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/update-user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res?.data?.message);

        // Update state with Cloudinary URL from response
        setData((prev) => ({
          ...prev,
          profile_pic: res.data.data.profile_pic, // Cloudinary URL
        }));

        dispatch(setUser(res.data.data));
        onClose();
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
      <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
        <h2 className='font-semibold'>Profile Details</h2>
        <p className='text-sm'>Edit user details</p>

        <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              name='name'
              id='name'
              value={data.name}
              onChange={handleOnChange}
              className='w-full py-1 px-2 focus:outline-primary border-0.5'
            />
          </div>

          <div>
            <div>Photo:</div>
            <div className='my-1 flex items-center gap-4'>
              <Avatar width={40} height={40} imageUrl={data.profile_pic} name={data.name} />
              <button className='font-semibold' onClick={triggerFileInput}>
                Change Photo
              </button>
              <input
                type='file'
                accept='image/*'
                ref={uploadPhotoRef}
                onChange={handleUploadPhoto}
                className='hidden'
              />
            </div>
          </div>

          <Divider />

          <div className='flex gap-2 w-fit ml-auto'>
            <button
              type='button'
              onClick={onClose}
              className='border-primary border text-primary px-4 py-1 rounded text-black bg-green-400 hover:bg-green-500 hover:text-white'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='border-primary bg-primary border px-4 py-1 rounded  text-black bg-green-400 hover:bg-green-500 hover:text-white'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetails);
