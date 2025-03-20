import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { addConnection } from '../redux/features/connectionsSlice'
import { motion } from 'framer-motion'

function Connections() {
  const dispatch = useDispatch()
  const connections = useSelector((state) => state.connections)
  const [isLoading, setIsLoading] = useState(true)

  const fetchConnections = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true
      })
      dispatch(addConnection(res?.data?.data))
    } catch (error) {
      console.log("Error fetching connections", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!connections) {
      fetchConnections()
    } else {
      setIsLoading(false)
    }
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-20vh)] flex justify-center items-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    )
  }

  if (!connections || connections?.length === 0) {
    return (
      <div className="min-h-[calc(100vh-20vh)] flex flex-col justify-center items-center">
        <div className="text-center p-8 max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <h2 className="text-2xl font-bold text-primary mb-2">No Connections Yet</h2>
          <p className="text-gray-400 mb-6">Start matching with other developers to build your network!</p>
          <button className="btn btn-primary">Find Developers</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-20vh)] px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-primary mb-10">Your Connections</h1>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {connections.map((connection, index) => (
          <motion.div
            key={connection._id}
            variants={item}
            className="card card-compact bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <figure className="px-6 pt-6">
              <img 
                src={connection.photoUrl || "https://www.shutterstock.com/shutterstock/photos/1290556063/display_1500/stock-vector-vector-design-of-avatar-and-dummy-sign-collection-of-avatar-and-image-stock-vector-illustration-1290556063.jpg"} 
                alt={`${connection.firstname} ${connection.lastname}`}
                className="rounded-xl h-40 w-40 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-primary">{connection.firstname} {connection.lastname}</h2>
              <div className="badge badge-accent">Developer</div>
              <p className="text-sm text-gray-400 mt-2">
                {connection.about || "This developer hasn't added a bio yet."}
              </p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary btn-sm">Message</button>
                <button className="btn btn-outline btn-sm">View Profile</button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default Connections