import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaTimes, FaUndo } from "react-icons/fa";

import { BASE_URL } from "../utils/constant";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../redux/features/connectionsSlice";
import { removeFeed, removeUserFeed } from "../redux/features/feedSlice";
import { removeUser } from "../redux/features/userSlice";

// Sample profiles data
// const profiles = [
//   { 
//     id: 1, 
//     name: "Emily Johnson", 
//     age: 26, 
//     bio: "Hiking enthusiast, coffee lover, and bookworm",
//     image: "https://images.unsplash.com/photo-1506795660198-e95c77602129?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
//   },
//   { 
//     id: 2, 
//     name: "Michael Smith", 
//     age: 28, 
//     bio: "Travel photographer, foodie, and weekend guitarist",
//     image: "https://plus.unsplash.com/premium_photo-1668165257976-13771a2fea0e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
//   },
//   { 
//     id: 3, 
//     name: "Sophia Chen", 
//     age: 24, 
//     bio: "Tech startup founder, yoga instructor, and dog mom",
//     image: "https://images.unsplash.com/flagged/photo-1563807556028-4ee2b3253dbf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
//   },
//   { 
//     id: 4, 
//     name: "Daniel Taylor", 
//     age: 30, 
//     bio: "Chef, marathon runner, and history buff",
//     image: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
//   }
// ];

function UserCard({profiles}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [history, setHistory] = useState([]);
  const [swipeText, setSwipeText] = useState("");
  const constraintsRef = useRef(null);
  console.log(profiles)
  
  const dispatch = useDispatch()

  const handleSwipe = async(direction) => {
    // Store the current profile in history before changing index
    if (currentIndex < profiles.length) {
      setHistory([...history, currentIndex]);
    }
    
    setDirection(direction);
    setSwipeText(direction === "left" ? "LIKED" : "NOPE");


    let feelings = direction === "right" ? "interested" : "ignored";

    try {
      const res = await axios.post(`${BASE_URL}/request/send/${feelings}/${profiles[currentIndex]._id}`, {},{withCredentials:true})
      console.log("response", res)
      dispatch(removeUserFeed(res?.data?.data))
      setDirection(null);
      setSwipeText("");
    } catch (error) {
      console.log("Error", error)
      setDirection(null);
      setSwipeText("");
    }
    



  };

  const undoLastSwipe = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const getSwipeColor = () => {
    if (swipeText === "LIKED") return "text-green-500";
    if (swipeText === "NOPE") return "text-red-500";
    return "";
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      {/* <h1 className="text-2xl font-bold text-white mb-8">Tinder Clone</h1> */}
      
      <div 
        ref={constraintsRef} 
        className="relative w-full max-w-md h-[540px] mb-8 cursor-pointer"
      >
        <AnimatePresence>
          {currentIndex < profiles.length ? (
            <motion.div
              key={profiles[currentIndex]._id}
              className="absolute w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={(e, info) => {
                if (info.offset.x > 100) {
                  handleSwipe("right");
                } else if (info.offset.x < -100) {
                  handleSwipe("left");
                }
              }}
              animate={{
                x: direction === "left" ? -500 : direction === "right" ? 500 : 0,
                opacity: direction ? 0.5 : 1,
                rotateZ: direction === "left" ? -20 : direction === "right" ? 20 : 0,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.8) 100%), url(${profiles[currentIndex].photoUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              whileDrag={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              {/* Swipe Indicator */}
              {swipeText && (
                <div className={`absolute top-10 left-0 right-0 flex justify-center ${getSwipeColor()}`}>
                  <div className="border-4 border-current px-4 py-2 rounded-lg font-extrabold text-3xl transform rotate-12">
                    {swipeText}
                  </div>
                </div>
              )}

              {/* Profile Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-2xl font-bold mb-1">
                  {profiles[currentIndex].firstname}, {profiles[currentIndex].lastname}
                </h2>
                <p className="text-gray-200 mb-6">{profiles[currentIndex].about}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute w-full h-full rounded-2xl bg-gray-800 flex flex-col justify-center items-center text-white p-8"
            >
              <h2 className="text-2xl font-bold mb-4">No more profiles!</h2>
              <p className="text-gray-300 text-center mb-6">You've viewed all available profiles. Check back later for more matches.</p>
              <button 
                onClick={() => {
                  setCurrentIndex(0);
                  setHistory([]);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Start Over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-6 items-center">
        <button
          className="p-5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition transform hover:scale-110"
          onClick={() => handleSwipe("left")}
          disabled={currentIndex >= profiles.length}
        >
          <FaTimes size={24} />
        </button>

        <button
          className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition transform hover:scale-110"
          onClick={undoLastSwipe}
          disabled={history.length === 0}
        >
          <FaUndo size={20} />
        </button>

        <button
          className="p-5 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition transform hover:scale-110"
          onClick={() => handleSwipe("right")}
          disabled={currentIndex >= profiles.length}
        >
          <FaHeart size={24} />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 flex gap-2">
        {profiles.map((_, index) => (
          <div 
            key={index} 
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 
              index < currentIndex ? 'bg-gray-400' : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default UserCard;