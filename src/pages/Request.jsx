import React, { useEffect, useState } from 'react'
import { addRequest } from '../redux/features/requestSlice';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constant';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Request() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const requests = useSelector((state) => state.requests);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true
      });
      console.log("response", res);
      dispatch(addRequest(res?.data?.data));
    } catch (error) {
      console.log("Error fetching requests", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!requests) {
      fetchRequests();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleRequestAction = async (requestId, action) => {
    console.log("action", action);
    console.log("requestId", requestId);
    try {
      const res = await axios.post(`${BASE_URL}/request/review/${action}/${requestId}`, {}, {
        withCredentials: true
      });
      console.log("response", res);
      // Refresh the requests after action
      fetchRequests();
    } catch (error) {
      console.log("Errorerror sdffsf", );
      console.log(`Error ${action} request`, error);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-20vh)] flex justify-center items-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="min-h-[calc(100vh-20vh)] flex flex-col justify-center items-center">
        <div className="text-center p-8 max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <h2 className="text-2xl font-bold text-primary mb-2">No Connection Requests</h2>
          <p className="text-gray-400 mb-6">You don't have any pending connection requests at the moment.</p>
          <Link to='/'  className="btn btn-primary">Explore Developers</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-20vh)] px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-primary mb-10">Connection Requests</h1>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {requests.map((request) => (
          <motion.div
            key={request._id}
            variants={item}
            className="card bg-base-200 shadow-xl overflow-hidden transition-all duration-300"
          >
            <div className="absolute top-2 right-2">
              <div className="badge badge-primary">
                {request.status === "interested" ? "Interested" : request.status}
              </div>
            </div>
            <div className="p-6 flex flex-col items-center">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={request.senderId.photoUrl || "https://www.shutterstock.com/shutterstock/photos/1290556063/display_1500/stock-vector-vector-design-of-avatar-and-dummy-sign-collection-of-avatar-and-image-stock-vector-illustration-1290556063.jpg"} alt="Profile" />
                </div>
              </div>
              <h2 className="card-title mt-4 text-primary">{request.senderId.firstname} {request.senderId.lastname}</h2>
              <p className="text-sm text-gray-400 mt-2 text-center">
                {request.senderId.about || "This developer hasn't added a bio yet."}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Sent on {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="card-actions justify-center p-4 bg-base-300">
              {request.status === "interested" && (
                <>
                  <button 
                    onClick={() => handleRequestAction(request.senderId._id, 'accepted')}
                    className="btn btn-success btn-sm"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleRequestAction(request.senderId._id, 'rejected')}
                    className="btn btn-error btn-sm"
                  >
                    Decline
                  </button>
                </>
              )}
              {request.status === "accepted" && (
                <button className="btn btn-primary btn-sm">Message</button>
              )}
              {request.status === "rejected" && (
                <span className="text-sm text-gray-400">Request declined</span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Request;