import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { addFeed } from '../redux/features/feedSlice'
import UserCard from '../components/UserCard'
function Feed() {
  const dispatch = useDispatch()
  const feed = useSelector((state) => state.feed)
  const getFeed = async () => {
    if(feed) return
    try {
      const res = await axios.get(`${BASE_URL}/user/feed`,{withCredentials:true})
      // console.log(res)
      dispatch(addFeed(res?.data?.data))

    } catch (error) {
      console.log("Error", error)
    }
  }
  useEffect(() => {
    getFeed()
  }, []) 
  return (
    feed && (
      <div>
      <UserCard profiles={feed}
      />
    </div>
    )
  )
}

export default Feed