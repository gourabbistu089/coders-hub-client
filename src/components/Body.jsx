import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import {BASE_URL} from '../utils/constant'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import {addUser} from '../redux/features/userSlice'
function Body() {
  const userData = useSelector((state) => state.user)
  // console.log(userData)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const fetchUser = async() =>{
    if(userData && userData._id) return;  // Only return if we have actual user data

    console.log("This is testing", Math.random())
    try {
      const res = await axios.get(`${BASE_URL}/profile/view`,{
        withCredentials:true
      })
      // console.log("response", res)
      dispatch(addUser(res.data.data))
    } catch (error) {
      console.log("Error", error)
      if(error.status == 401)
        navigate('/login')
      else{
        console.log(error)
      }
    }
  }
  useEffect(()=>{
   fetchUser()
  },[])
  return (
    <>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default Body