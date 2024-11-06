import React from 'react'
import LeftSideNavbar from '../components/LeftSideNavbar'
import { useDispatch,useSelector } from "react-redux"

const Home = () => {
  const username = useSelector(state=>state.user.username)
  const phoneNumber = useSelector(state=>state.user.phoneNumber)

  return (
    <>
    <div className="flex">
      <div className=" lg:w-64 z-2">
          <LeftSideNavbar />
      </div>
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        

        {/* Main Content Area */}
        <div className="flex-1 p-4 bg-green-200">
          <h1 className="text-2xl font-bold">Hello, {username}</h1>
          <p>{phoneNumber}</p>
          {/* Your other content goes here */}
        </div>
        <div>Message</div>
      </div>
    </div>
    </>
  )
}

export default Home
