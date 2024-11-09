import React, { useState, useEffect } from 'react';
import api from '../api';
import LoadingIndicator from './LoadingIndicator';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../state/UserActions';
import { USER_DATA } from '../constants';
import { Trash2, ShieldOff, ShieldCheck, UserRoundCheck, UserRoundMinus } from 'lucide-react';
import Swal from 'sweetalert2'

const GetUsersForAdmin = () => {
  const adminData = useSelector((state) => state.user_data.user);
  const [loading, setLoading] = useState(false);
  const [residenceUsers, setResidenceUsers] = useState([]);
  const [hovered, setHovered] = useState(null);
  const dispatch = useDispatch();
  const storedUser = localStorage.getItem(USER_DATA);


  useEffect(() => {
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch, storedUser]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/admin/useroperations/');
        setResidenceUsers(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVerifyUser = async (userId) => {
    
    try {
      const result = await Swal.fire({
        title: "Verify this user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Verify"
      });
  
      if (result.isConfirmed) {
        // Perform the API request to verify the user
        const response = await api.patch(`/api/admin/useroperations/${userId}/`, { isVerified: true });
        
        // Update the state to reflect the user's verified status
        setResidenceUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user.id === userId ? { ...user, isVerified: true } : user
          )
        );
        
        console.log('User verified:', response.data);
  
        // Show a success message
        Swal.fire({
          title: "Verified!",
          text: "This User is verified.",
          icon: "success"
        });
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      // Show an error message
      Swal.fire({
        title: "Error!",
        text: "There was an error verifying the user.",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  

  const handleMakeAdmin = async (userId) => {
    try {
      const result = await Swal.fire({
        title: "Make this user ADMIN?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Make Admin"
      });
  
      if (result.isConfirmed) {
        // Perform the API request to verify the user
        const response = await api.patch(`/api/admin/useroperations/${userId}/`, { isAdmin: true });
      setResidenceUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user.id === userId ? { ...user, isAdmin: true } : user
        )
      );
      console.log('User made admin:', response.data);
  
        // Show a success message
        Swal.fire({
          title: "Made Admin",
          text: "This User is now an Admin",
          icon: "success"
        });
      }
      
    } catch (error) {
      console.error('Error verifying user:', error);
      // Show an error message
      Swal.fire({
        title: "Error!",
        text: "Can't make this user Admin",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (userId) => {
    try {
      const result = await Swal.fire({
        title: "Remove this user from Admin?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Remove"
      });
  
      if (result.isConfirmed) {
        // Perform the API request to verify the user
        const response = await api.patch(`/api/admin/useroperations/${userId}/`, { isAdmin: false });
        setResidenceUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user.id === userId ? { ...user, isAdmin: false } : user
        )
      );
      console.log('User removed from admin:', response.data);
  
        // Show a success message
        Swal.fire({
          title: "Removed from Admin",
          text: "This User is not an Admin",
          icon: "success"
        });
      }
      
    } catch (error) {
      console.error('Error verifying user:', error);
      // Show an error message
      Swal.fire({
        title: "Error!",
        text: "Issue in removing from Admin",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };


  const handleUnverifyUser = async (userId) => {
    try {
      const result = await Swal.fire({
        title: "Revoke Verification of this user?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Revoke"
      });
  
      if (result.isConfirmed) {
        // Perform the API request to verify the user
        const response = await api.patch(`/api/admin/useroperations/${userId}/`, { isVerified: false });
        setResidenceUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user.id === userId ? { ...user, isVerified: false } : user
        )
      );
      console.log('User unverified:', response.data);
  
        // Show a success message
        Swal.fire({
          title: "Revoked user verification",
          text: "This User is not verified",
          icon: "success"
        });
      }
      
    } catch (error) {
      console.error('Error verifying user:', error);
      // Show an error message
      Swal.fire({
        title: "Error!",
        text: "Issue in revoking user verification",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteUser = async (userId) => {
    try {
      const result = await Swal.fire({
        title: "Delete this User?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete"
      });
  
      if (result.isConfirmed) {
        // Perform the API request to verify the user
        const response = await api.delete(`/api/admin/useroperations/${userId}/`);
        setResidenceUsers((prevUsers) =>
        prevUsers.filter((user) => user.user.id !== userId)
      );
      console.log('User deleted:', response.data);
  
        // Show a success message
        Swal.fire({
          title: "User Deleted Successfully",
          text: "",
          icon: "success"
        });
      }
      
    } catch (error) {
      console.error('Error verifying user:', error);
      // Show an error message
      Swal.fire({
        title: "Error!",
        text: "Issue in deleting the user",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      {adminData.isAdmin && (
        <div className="flex-1 p-4 m-4 bg-gray-200 border border-gray-200 shadow-lg rounded-lg" >
          {/* Users to be verified Section */}
          <div className="flex justify-center items-center mb-6">
            <h2 className="text-xl font-semibold text-black-700">Users to be verified</h2>
          </div>
          <div className="py-2 px-4 border-b border-gray-400">
            <ul className="w-full">
              {residenceUsers.filter(
                (user) =>
                  user.Pincode === adminData.Pincode &&
                  user.user.id !== adminData.user.id &&
                  !user.isVerified
              ).length > 0 ? (
                residenceUsers.map((user) => {
                  if (
                    user.Pincode === adminData.Pincode &&
                    user.user.id !== adminData.user.id &&
                    !user.isVerified
                  ) {
                    return (
                      <li key={user.user.id} className="flex justify-between py-2 px-4">
                        {/* Left Section: Name */}
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900">
                            {user.user.first_name} {user.user.last_name}
                          </span>
                        </div>

                        {/* Center Section: Username */}
                        <div className="flex-1 text-center">
                          <span className="text-gray-700">{user.user.username}</span>
                        </div>

                        {/* Center Section: Phone Number (conditionally render) */}
                        <div className="flex-1 text-center">
                          <span className="text-gray-700">{user.phonenumber || 'N/A'}</span>
                        </div>

                        {/* Right Section: Verify Button */}
                        <div className="flex-1 flex justify-center items-center">
                          <div className="relative">
                            <button
                              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={() => handleVerifyUser(user.user.id)}
                              onMouseEnter={() => setHovered('verify')}
                              onMouseLeave={() => setHovered(null)}
                            >
                              <ShieldCheck size={20} />
                            </button>
                            {/* {hovered === 'verify' && (
                              <span className="absolute bottom-[-38px] left-1/2 transform -translate-x-1/2 opacity-100 bg-indigo-100 px-4 py-2 rounded-md text-center text-sm text-gray-600 transition-all duration-700 ease-in-out">
                                Verify
                              </span>
                            )} */}
                          </div>
                        </div>
                      </li>
                    );
                  }
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
      )}

      <br />
      {/* Users of the Admin Section */}
      <div className="flex justify-center items-center mb-6">
        <h2 className="text-xl font-semibold text-black-700">
          Users of
          <span className="text-indigo-700 font-bold ml-2">{adminData.Adminresidence}</span>
        </h2>
      </div>
      <div className="py-2 px-4 border-b border-gray-200">
        {/* Render the list of verified users */}
        <ul className="w-full">
          {residenceUsers.length > 0 ? (
            residenceUsers.map((user) => {
              if (user.Pincode === adminData.Pincode && user.isVerified) {
                return (
                  <li key={user.user.id} className="flex justify-between py-3 px-4">
                    {/* Left Section: Name */}
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900">
                        {user.user.first_name} {user.user.last_name}
                      </span>
                    </div>

                    {/* Center Section: Username */}
                    <div className="flex-1 text-center">
                      <span className="text-gray-700">{user.user.username}</span>
                    </div>

                    {/* Center Section: Phone Number */}
                    <div className="flex-1 text-center">
                      <span className="text-gray-700">{user.phonenumber || 'N/A'}</span>
                    </div>

                    {/* Right Section: Admin Buttons */}
                    {(adminData.isAdmin && user.user.id !== adminData.user.id) ? (
                      <div className="flex-1 flex justify-center items-center space-x-2">
                        {/* Make Admin / Remove Admin Button */}
                        <div className="relative">
                          {!user.isAdmin ? (
                            <button
                              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={() => handleMakeAdmin(user.user.id)}
                              onMouseEnter={() => setHovered('makeAdmin')}
                              onMouseLeave={() => setHovered(null)}
                            >
                              <UserRoundCheck size={20} />
                            </button>
                          ) : (
                            <button
                              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={() => handleRemoveAdmin(user.user.id)}
                              onMouseEnter={() => setHovered('removeAdmin')}
                              onMouseLeave={() => setHovered(null)}
                            >
                              <UserRoundMinus size={20} />
                            </button>
                          )}
                          {/* {hovered === 'makeAdmin' && (
                            <span className="absolute bottom-[-38px] left-1/2 transform -translate-x-1/2 opacity-100 bg-indigo-100 px-4 py-2 rounded-md text-center text-sm text-gray-600 transition-all duration-700 ease-in-out">
                              Make Admin
                            </span>
                          )}
                          {hovered === 'removeAdmin' && (
                            <span className="absolute bottom-[-38px] left-1/2 transform -translate-x-1/2 opacity-100 bg-indigo-100 px-4 py-2 rounded-md text-center text-sm text-gray-600 transition-all duration-700 ease-in-out">
                              Remove Admin
                            </span>
                          )} */}
                        </div>

                        {/* Unverify Button */}
                        <div className="relative">
                          <button
                            className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            onClick={() => handleUnverifyUser(user.user.id)}
                            onMouseEnter={() => setHovered('unverify')}
                            onMouseLeave={() => setHovered(null)}
                          >
                            <ShieldOff size={20} />
                          </button>
                          {/* {hovered === 'unverify' && (
                            <span className="absolute bottom-[-38px] left-1/2 transform -translate-x-1/2 opacity-100 bg-yellow-100 px-4 py-2 rounded-md text-center text-sm text-gray-600 transition-all duration-700 ease-in-out">
                              Unverify
                            </span>
                          )} */}
                        </div>

                        {/* Delete Button */}
                        <div className="relative">
                          <button
                            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            onClick={() => handleDeleteUser(user.user.id)}
                            onMouseEnter={() => setHovered('delete')}
                            onMouseLeave={() => setHovered(null)}
                          >
                            <Trash2 size={20} />
                          </button>
                          {/* {hovered === 'delete' && (
                            <span className="absolute bottom-[-38px] left-1/2 transform -translate-x-1/2 opacity-100 bg-red-100 px-4 py-2 rounded-md text-center text-sm text-gray-600 transition-all duration-700 ease-in-out">
                              Delete
                            </span>
                          )} */}
                        </div>
                      </div>
                      ) : (
                        user.user.id === adminData.user.id ? (
                          <div className="flex-1 flex justify-center items-center space-x-2 bg-green-100 rounded-md py-1">
                            <span>You</span> {/* Render "You" when user is the admin */}
                          </div>
                        ) : (
                          user.isAdmin == true ? (
                            <div className="flex-1 flex justify-center items-center bg-red-100 space-x-2 py-1">
                              <span>Admin</span> {/* Render "Others" when user is not the admin */}
                            </div>
                          ) : (
                            <div className="flex-1 flex justify-center items-center space-x-2 py-1">
                              <span></span> {/* Render "Others" when user is not the admin */}
                            </div>
                          )
                        )
                    )}
                  </li>
                );
              }
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
  );
};

export default GetUsersForAdmin;
