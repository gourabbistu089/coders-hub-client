import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import axios from "axios";
import { removeUser } from "../redux/features/userSlice";
import { removeFeed } from "../redux/features/feedSlice";
import { removeRequest } from "../redux/features/requestSlice";

function Navbar() {
  const user = useSelector((state) => state.user);

  const feed = useSelector((state)=>state.feed);
  
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/signout`,
        {},
        {
          withCredentials: true,
        }
      );
      // console.log(res);
      if(res.status === 200){
        dispatch(removeUser());
        dispatch(removeFeed());
        dispatch(removeRequest());

        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      // redirected Error Page
    }
  };
  return (
    <div className="navbar bg-base-300 shadow-sm px-8">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          DevTinder❤️
        </Link>
      </div>
      <div className="flex gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            {user && (
              <div className="w-10 rounded-full">
                <img src={user.photoUrl} alt="User Photo" />
              </div>
            )}
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/profile" className="justify-between">
                Profile 
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <Link to="/connections">Connections</Link>
            </li>
            <li>
              <Link to="/requests">Connection Requests</Link>
            </li>
            <li>
              <span onClick={handleLogout}>Logout</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
