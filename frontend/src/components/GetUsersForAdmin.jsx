// This is where Admin is able to view, verify and delete other users.
import React from 'react'
import api from '../api'
import { useState,useEffect } from 'react'
import LoadingIndicator from './LoadingIndicator'
import { useSelector,useDispatch } from 'react-redux'
import { setUser } from '../state/UserActions'
import { USER_DATA } from '../constants'

const GetUsersForAdmin = () => {
    const adminData = useSelector((state) => state.user_data.user)
    const [loading,setLoading] = useState(false)
    const [residenceUsers,setResidenceUsers] = useState("")
    const dispatch = useDispatch()
    const storedUser = localStorage.getItem(USER_DATA)

    useEffect(()=>{
    if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser)))
    }
    },[])

    // useEffect(()=>{
    //     console.log("Inside useEffect",adminData)
    //     setAdminData(localStorage.getItem(USER_DATA))
    //   },[])

    useEffect(() => {
        // Create an async function to handle the API call
        const fetchData = async () => {
            setLoading(true)

            try {
                const response = await api.get('/api/admin/useroperations/')
                setResidenceUsers(response.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()

    }, [])


  return (
    <div>
      {
      adminData.isAdmin && (
        <>
          <div className="flex justify-center items-center mb-6">
            <h2 className="text-xl font-semibold text-black-700">
              Users to be verified
            </h2>
          </div>
          <div className="flex justify-between items-center py-2 px-4 border-b border-gray-200">
            {/* Render the list of users */}
            <ul className="w-full">
              {residenceUsers.length > 0 ? (
                residenceUsers.map((user) => {
                  if (
                    user.Residence === adminData.Residence &&
                    user.user.id !== adminData.user.id &&
                    !user.isVerified
                  ) {
                    return (
                      <li key={user.user.id} className="flex justify-between py-2 px-4">
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900">
                            {user.user.first_name} {user.user.last_name}
                          </span>
                        </div>

                        {/* Center Section: Email */}
                        <div className="flex-1 text-center">
                          <span className="text-gray-700">{user.user.email}</span>
                        </div>
                        
                        {/* Right Section: Verify Button */}
                        <div className="ml-4">
                          <button className="bg-indigo-600 text-white py-1 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            Verify
                          </button>
                        </div>
                      </li>
                    );
                  }
                  return null; // Return null if the user doesn't match
                })
              ) : (
                <p>No users found.</p>
              )}
            </ul>

            {/* Show loading indicator while data is being fetched */}
            {loading && <LoadingIndicator />}
          </div>
        </>
      )
    }


            <div className="flex justify-center items-center mb-6">
            <h2 className="text-xl font-semibold text-black-700">
                Users of 
                <span className="text-indigo-700 font-bold ml-2">{adminData?.Residence}</span>
            </h2>
        </div>
        <div className="flex justify-between items-center py-2 px-4 border-b border-gray-200">
                {/* Render the list of users */}
                <ul className="w-full">
                    {residenceUsers.length > 0 ? (
                        residenceUsers.map((user) => {
                            console.log(user)
                            if (user.Residence === adminData.Residence & user.user.id !== adminData.user.id & user.isVerified) {
                                return (
                                    <li key={user.user.id} className="flex justify-between py-2 px-4">
                                    <div className="flex-1">
                                      <span className="font-semibold text-gray-900">{user.user.first_name} {user.user.last_name}</span>
                                    </div>
                                  
                                    {/* Center Section: Email */}
                                    <div className="flex-1 text-center">
                                      <span className="text-gray-700">{user.user.email}</span>
                                    </div>

                                    {/* Right Section: Verify Button */}
                                    {
                                      adminData.isAdmin && (
                                        <div className="ml-4">
                                          <button className="bg-indigo-100 text-black py-1 px-4 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                            Make Admin
                                          </button>
                                    </div>
                                      )
                                    }
                                  </li>
                                  
                                );
                              }
                              // Return null if user doesn't match
                              return null;
                        })
                    ) : (
                        <p>No users found.</p>
                    )}
                </ul>

                {/* Show loading indicator while data is being fetched */}
                {loading && <LoadingIndicator />}
            </div>
    </div>
  )
}

export default GetUsersForAdmin
