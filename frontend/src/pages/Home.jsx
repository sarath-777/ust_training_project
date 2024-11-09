import React from 'react'
import LeftSideNavbar from '../components/LeftSideNavbar'
import { useDispatch,useSelector } from "react-redux"
import { setUser } from '../state/UserActions'
import { useEffect } from 'react'
import { USER_DATA } from '../constants'
import { Outlet } from 'react-router-dom'

const Home = () => {
  const userdata = useSelector((state) => state.user_data.user)
  const dispatch = useDispatch()
  const storedUser = localStorage.getItem(USER_DATA)
useEffect(()=>{
  console.log("Inside useEffect",storedUser)
  if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)))
  }
},[])

  // useEffect(() => {
  //   const storedUser = localStorage.getItem(USER_DATA)
  //   console.log("Inside useEffect",storedUser)
  //   if (storedUser) {
  //       dispatch(setUser(JSON.parse(storedUser)))
  //   }
  // }, [])

  console.log('user--->', userdata);


  return (
    <>
    <div className="flex h-screen bg-gray-400">
      <div className=" lg:w-64 z-2">
          <LeftSideNavbar />
      </div>
      {/* Main Content Area */}
      <div className="flex-1 p-4 m-4 bg-white border border-gray-200 shadow-lg rounded-lg">
          <main className="w-full h-full p-6 bg-white rounded-lg overflow-y-auto custom-scrollbar">
            <Outlet />
          </main>
      </div>
    </div>
    </>
  )
}

export default Home
