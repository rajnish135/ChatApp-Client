import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken } from "../components/redux/userSlice";

const CheckPassword = () => {
  const [data, setData] = useState({
    password: "",
  });

  const navigate = useNavigate();

  const location = useLocation();
  console.log("Location :", location);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.data?.name) navigate("/email");
  }, [location, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    const { password } = data;

    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/password`,
        { password, user_id: location?.state?.data?._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("res in check password ", res)
      toast.success("User Password verified successfully!");

      // CLEARING THE DATA AFTER SUCCESSFUL LOGIN
      if (res.data.success) {
        dispatch(setToken(res?.data?.token));
        localStorage.setItem("token", res?.data?.token);

        setData({
          password: "",
        });
      }

      navigate("/");
    } catch (error) {
      console.log(error)
      toast.error("Incorrect Password. Check console ");
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-sm overflow-hidden rounded p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col">
          <Avatar
            width={70}
            height={70}
            name={location?.state?.data?.name}
            imageUrl={location?.state?.data?.profile_pic}
          />

          <h2 className="font-semibold text-lg mt-1">{location?.state?.data?.name}</h2>
        </div>

        <h3 className="text-lg font-bold mb-4">Welcome to Chat app!</h3>

        <form className="grid gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your Password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-lg px-4 py-1 hover:bg-green-600 rounded mt-2 font-bold text-white tracking-wide"
          >
            Log In
          </button>
        </form>

        <p className="my-3 text-center">
          <Link to={"/forgot-password"} className="hover:text-primary font-semibold">
            Forgot Password ?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPassword;
