import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaUserTie } from "react-icons/fa";


const CheckEmail = () => {
  const [data, setData] = useState({
    email: "",
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    const formData = new FormData();
    formData.append("email", data.email);

    e.preventDefault();

    try {
      console.log("backend api", import.meta.VITE_BACKEND_URL)
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/email`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("User Email verified successfully!");

      if (res.data.success) {
        setData({
          email: "",
        });
      }

      navigate("/password", {
        state: res?.data,
      });
    } catch (error) {
      toast.error("Incorrect Email. Check console ");
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-sm overflow-hidden rounded p-4 mx-auto">
        <div className="mb-4">
          <FaUserTie size={70} className="mx-auto" />
        </div>

        <h3 className="text-lg font-bold mb-4">Welcome to Chat app!</h3>

        <form className="grid gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-lg px-4 py-1 hover:bg-green-600 rounded mt-2 font-bold text-white tracking-wide"
          >
            Let's go
          </button>
        </form>

        <p className="my-3 text-center">
          New User ?{" "}
          <Link to={"/register"} className="hover:text-primary font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmail;
