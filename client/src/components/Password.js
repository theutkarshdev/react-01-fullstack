import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "../helper/validate";
import useFetch from "../hooks/fetch.hook";
import { useAuthStore } from "../store/store";
import { verifyPassword } from "../helper/helper";
import "../styles/username.css";
import Loader from "./Loader";

export default function Password() {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`user/${username}`);

  const formik = useFormik({
    initialValues: {
      password: "admin@123",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const response = await verifyPassword({ username, password: values.password });
        const { token } = response.data;
        localStorage.setItem("token", token);
        toast.success(<b>Login Successful!</b>);
        navigate("/profile");
      } catch (error) {
        toast.error(<b>Password Not Match!</b>);
        console.error(error);
      }
    },
  });

  async function handleFormSubmit(values) {
    try {
      const response = await verifyPassword({ username, password: values.password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      toast.success(<b>Login Successful!</b>);
      navigate("/profile");
    } catch (error) {
      if (error.message === "Incorrect password.") {
        toast.error(<b>Incorrect password.</b>);
      } else {
        toast.error(<b>An error occurred during login.</b>);
        console.error(error);
      }
    }
  }

  if (isLoading) return <Loader />;
  if (serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className="glass">
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Hello {apiData?.firstName || apiData?.username}</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">Explore More by connecting with us.</span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={apiData?.profile || avatar} className="profile_img" alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps("password")} className="inputbox" type="text" placeholder="Password" />
              <button className="btn" type="submit">
                Sign In
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Forgot Password?{" "}
                <Link className="text-red-500" to="/recovery">
                  Recover Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
