import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/features/userSlice";
import { BASE_URL } from "../utils/constant";

const AuthForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to toggle between login and signup
  const [isLogin, setIsLogin] = useState(true);

  // Form data state
  const [formData, setFormData] = useState({
    email: "simran@gmail.com",
    password: "Simran@123",
    firstname: "",
    lastname: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!isLogin) {
      if (!formData.firstname.trim()) {
        newErrors.firstname = "First name is required";
      }

      if (!formData.lastname.trim()) {
        newErrors.lastname = "Last name is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setAuthError("");

    try {
      let res;
      if (isLogin) {
        // Login request
        res = await axios.post(
          `${BASE_URL}/signin`,
          { email: formData.email, password: formData.password },
          { withCredentials: true }
        );
      } else {
        // Signup request
        res = await axios.post(`${BASE_URL}/signup`, formData, {
          withCredentials: true,
        });
      }

      const data = res?.data;

      if (data.success) {
        dispatch(addUser(data?.data));
        navigate("/profile");
      } else {
        setAuthError(
          data.message ||
            `Failed to ${isLogin ? "log in" : "sign up"}. Please try again.`
        );
      }
    } catch (error) {
      setAuthError(
        `Failed to ${isLogin ? "log in" : "sign up"}. ${
          error.response?.data?.message || "Please try again."
        }`
      );
      console.error(`${isLogin ? "Login" : "Signup"} error:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setAuthError("");

    // Reset form data when switching modes
    setFormData({
      email: isLogin ? "" : "simran@gmail.com",
      password: isLogin ? "" : "Simran@123",
      firstname: "",
      lastname: "",
    });
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md bg-base-300 py-6 rounded-t-lg shadow-lg"
      >
        <Link to="/">
          <h2 className="text-center text-3xl font-extrabold text-base-content">
            DevTinder
          </h2>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-base-content">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </h2>
        <p className="mt-2 text-center text-sm text-base-content opacity-70">
          {isLogin ? "New to DevTinder? " : "Already have an account? "}
          <button
            onClick={toggleMode}
            className="font-medium text-primary hover:text-primary-focus"
          >
            {isLogin ? "Create an account" : "Sign in"}
          </button>
        </p>
      </motion.div>

      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md bg-base-300 p-6 rounded-b-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        key={isLogin ? "login" : "signup"} // Forces re-animation when switching modes
      >
        {authError && (
          <div className="alert alert-error mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First and last name fields - only shown on signup */}
          {!isLogin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">First name</span>
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="Sung"
                  className={`input input-bordered w-full ${
                    errors.firstname ? "input-error" : ""
                  }`}
                />
                {errors.firstname && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.firstname}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Last name</span>
                </label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Jinwoo"
                  className={`input input-bordered w-full ${
                    errors.lastname ? "input-error" : ""
                  }`}
                />
                {errors.lastname && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.lastname}
                    </span>
                  </label>
                )}
              </div>
            </div>
          )}

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email address</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="simran1@gmail.com"
              className={`input input-bordered w-full ${
                errors.email ? "input-error" : ""
              }`}
            />
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.email}
                </span>
              </label>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Simran@123"
              className={`input input-bordered w-full ${
                errors.password ? "input-error" : ""
              }`}
            />
            {errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.password}
                </span>
              </label>
            )}
          </div>

          {isLogin && (
            <div className="flex items-center justify-between mt-4">
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    id="remember-me"
                    name="remember-me"
                  />
                  <span className="label-text">Remember me</span>
                </label>
              </div>

              <div>
                <a
                  href="#"
                  className="text-sm text-primary hover:text-primary-focus"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn btn-primary w-full ${
                isSubmitting ? "loading" : ""
              }`}
            >
              {isSubmitting
                ? isLogin
                  ? "Signing in..."
                  : "Creating account..."
                : isLogin
                ? "Sign in"
                : "Sign up"}
            </button>
          </div>
        </form>

        <div className="divider my-6">Or continue with</div>

        <div className="grid grid-cols-2 gap-3">
          <button className="btn btn-outline">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 2.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.378.203 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.42 20 10c0-5.523-4.477-10-10-10z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-2">GitHub</span>
          </button>

          <button className="btn btn-outline">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
            </svg>
            <span className="ml-2">Twitter</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
