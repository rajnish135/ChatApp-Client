import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    profile_pic: ''
  });

  const [uploadPhoto, setUploadPhoto] = useState('');
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadPhoto(file);
    }
  };

  const handleClearUpUploadPhoto = () => {
    setUploadPhoto('');
    setFileInputKey(Date.now());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = data;

    try {
      let res;
      if (uploadPhoto) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("profile_pic", uploadPhoto);

        res = await axios.post(import.meta.env.VITE_BACKEND_URL + `/api/register`, formData,  {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } 
      else {
        res = await axios.post(import.meta.env.VITE_BACKEND_URL + `/api/register`, {
          name,
          email,
          password,
          profile_pic: ""
        },{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }

      toast.success("User Registration successful!");

      if (res.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: ""
        });
        navigate("/email");
      }

    } catch (err) {
      console.error(err);
      toast.error("Failed to register. Check console");
    }
  };

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-sm overflow-hidden rounded p-4 mx-auto'>
        <h3 className='text-lg font-bold mb-4'>Welcome to Chat app!</h3>

        <form className='grid gap-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Enter your name'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label>Photo:</label>
            {
              uploadPhoto ? (
                <div className="h-14 bg-slate-200 flex justify-between items-center border px-2">
                  <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>{uploadPhoto.name}</p>
                  <button type="button" onClick={handleClearUpUploadPhoto} className='text-lg ml-2'>
                    <IoClose className="cursor-pointer" />
                  </button>
                </div>
              ) : (
                <label htmlFor="profile_pic">
                  <div className="h-14 bg-slate-200 flex justify-center items-center border hover:border-primary cursor-pointer px-2">
                    <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>Upload profile photo</p>
                  </div>
                </label>
              )
            }

            <input
              key={fileInputKey}
              type='file'
              id='profile_pic'
              name='profile_pic'
              className='hidden'
              accept='image/*'
              onChange={handleUploadPhoto}
            />
          </div>

          <button
            type='submit'
            className='bg-green-500 text-lg px-4 py-1 hover:bg-green-600 rounded mt-2 font-bold text-white tracking-wide'
          >
            Register
          </button>
        </form>

        <p className='my-3 text-center'>
          Already have an account?{" "}
          <Link to={"/email"} className='hover:text-primary font-semibold'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
