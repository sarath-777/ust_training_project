import React from 'react'
import SideNavbar, { SidebarItem } from '../components/SideNavbar'
import { useLocation,useNavigate } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { clearUser } from '../state/UserActions'
import Swal from 'sweetalert2'
import {
    CircleFadingPlus,
  Receipt,
  Boxes,
  Package,
  UserCircle,
  MessageCircle,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react"



const LeftSideNavbar = () => {
    const location = useLocation()
    const isActive = (path) => location.pathname === path
    const isAdmin = useSelector(state=>state.user_data.user.isAdmin)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleDashboard = () => {
      navigate("/dashboard")
    }

    const handleViewUsers = () => {
      navigate("/view-users")
    }

    const handleLogout = () => {
      console.log("Logging out")
      localStorage.clear()
      dispatch(clearUser())
      navigate("/login")
    }

    const handleAddEvent = async (userId) => {
      try {
        const { value: formValues } = await Swal.fire({
          title: "Add Alerts/Events",
          html: `
            <input id="event-title" type="text" class="swal2-input" placeholder="Title of Alert/Event" required>
            <br/><br/>
            <!-- Radio input for selecting Alert or Event -->
            <div>
              <label><strong>Type</strong></label><br>
              <div style="display : flex; justify-content:space-around">
                <div>
                  <input type="radio" id="alert" name="type" value="false">
                  <label for="alert">Alert</label><br>
                </div>
                <div>
                  <input type="radio" id="event" name="type" value="true">
                  <label for="event">Event</label>
                </div>
              </div>
            </div>
            <br/>
            <div>
              <label><strong>Date</strong></label>
              <input id="event-date" type="date" class="swal2-input" placeholder="Date" required>
            </div>
            <div>
              <label><strong>Time</strong></label>
              <input id="event-time" type="time" class="swal2-input" placeholder="Time" required>
            </div>
            <input id="event-venue" type="text" class="swal2-input" placeholder="Venue">
            <input id="event-description" type="text" class="swal2-input" placeholder="Description">
            
          `,
          focusConfirm: false,
          preConfirm: () => {
            const title = document.getElementById("event-title").value;
            const description = document.getElementById("event-description").value;
            const date = document.getElementById("event-date").value;
            const time = document.getElementById("event-time").value;
            const venue = document.getElementById("event-venue").value;
            
            // Get the selected radio option (either "Alert" or "Event")
            const type = document.querySelector('input[name="type"]:checked') ? document.querySelector('input[name="type"]:checked').value : null;
    
            return { title, description, date, time, venue, type }; // Return all form values
          }
        });

        if (formValues) {
          // Show the selected type (Alert or Event)
          Swal.fire({
            title: "Form Submitted",
            html: `You added a ${formValues.type === "true" ? "Event" : "Alert"} titled: <strong>${formValues.title}</strong><br>Details: ${JSON.stringify(formValues)}`
          });
    
        // if (result.isConfirmed) {
        //   // Perform the API request to verify the user
        //   const response = await api.patch(`/api/admin/useroperations/${userId}/`, { isVerified: false });
        //   setResidenceUsers((prevUsers) =>
        //   prevUsers.map((user) =>
        //     user.user.id === userId ? { ...user, isVerified: false } : user
        //   )
        // );
        // console.log('User unverified:', response.data);
    
        //   // Show a success message
        //   Swal.fire({
        //     title: "Revoked user verification",
        //     text: "This User is not verified",
        //     icon: "success"
        //   });
        // }
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
        
      }
    };


    return (
      <>
        <SideNavbar className="w-fitcontent">
          <button onClick= {handleDashboard}>
            <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={isActive('/dashboard')} alert />
          </button>
          <SidebarItem icon={<MessageCircle size={20}/>} text="Chats" active={isActive('/users')} />
          <button onClick= {handleViewUsers}>
            <SidebarItem icon={<UserCircle size={20} />} text="Users" active={isActive('/view-users')} />
          </button>
          <SidebarItem icon={<Boxes size={20} />} text="Groups" />
          <SidebarItem icon={<Package size={20} />} text="Orders" active={isActive('/users')} alert />
          <SidebarItem icon={<Receipt size={20} />} text="Billings" active={isActive('/users')} />
          <hr className="my-3"/>
          <SidebarItem icon={<Settings size={20} />} text="Settings" active={isActive('/users')} />
          {isAdmin ? 
            <button onClick={handleAddEvent}>
              <SidebarItem icon={<CircleFadingPlus size={20} />} text="Add Alert/Event" active={isActive('/users')} alert />
            </button>
          : ""}
        
          <button onClick= {handleLogout}>
            <SidebarItem icon={<LogOut size={20} />} text="Logout" active={isActive('/logout')} onClick={handleLogout}/>
          </button>
        </SideNavbar>
      </>
    )
  }
  
  export default LeftSideNavbar