import React from 'react'
import SideNavbar, { SidebarItem } from '../components/SideNavbar'
import { useLocation,useNavigate } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { clearUser } from '../state/UserActions'
import Swal from 'sweetalert2'
import api from '../api'
import {
    CircleFadingPlus,
  Receipt,
  Boxes,
  Package,
  UserCircle,
  MessageCircle,
  LayoutDashboard,
  Users,
  LogOut,
} from "lucide-react"



const LeftSideNavbar = () => {
    const location = useLocation()
    const isActive = (path) => location.pathname === path
    const isAdmin = useSelector(state=>state.user_data.user.isAdmin)
    const residenceName = useSelector(state=>state.user_data.user.Adminresidence)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = () => {
      console.log("Logging out")
      localStorage.clear()
      dispatch(clearUser())
      navigate("/login")
    }

    const handleAddEvent = async () => {
      try {
        // Open the SweetAlert2 dialog
        const { value: formValues } = await Swal.fire({
          title: "Add Alerts/Events",
          html: `
            <div>
              <input type="text" id="event-residence" value="${residenceName}" disabled>
            </div>
            <input id="event-title" type="text" class="swal2-input" placeholder="Title of Alert/Event" required>
            <br/><br/>
            <!-- Radio input for selecting Alert or Event -->
            <div>
              <label><strong>Type</strong></label><br>
              <div style="display: flex; justify-content: space-around">
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
            // Collect form values from inputs
            const title = document.getElementById("event-title").value;
            const description = document.getElementById("event-description").value;
            const date = document.getElementById("event-date").value;
            const time = document.getElementById("event-time").value;
            const venue = document.getElementById("event-venue").value;
            
            // Get the selected radio option (either "Alert" or "Event")
            const type = document.querySelector('input[name="type"]:checked') ? document.querySelector('input[name="type"]:checked').value : null;
    
            // Return the form values
            return { title, description, date, time, venue, type, residenceName };
          }
        });
    
        // Ensure formValues is returned and valid before proceeding
        if (formValues) {
          console.log(formValues);
    
          // API call to create event/alert
          const response = await api.post(`/api/events/`, { 
            Title: formValues.title,
            Residence: formValues.residenceName,
            Event: formValues.type,
            Date: formValues.date,
            Time: formValues.time,
            Description: formValues.description,
            Venue: formValues.venue,
            Completed: false
          });
    
          // Handle success
          Swal.fire({
            title: `Added a ${formValues.type === "true" ? "Event" : "Alert"}`,
          });
    
          console.log('Alert/Event added:', response.data);
        }
      } catch (error) {
        console.error(`Error adding an Alert/Event:`, error);
        // Show an error message
        Swal.fire({
          title: "Error!",
          text: `Error adding an Alert/Event`,
          icon: "error"
        });
      } finally {
        
      }
    };


    return (
      <>
        <SideNavbar className="w-fitcontent">
          <button onClick= {() => {navigate("/dashboard")}}>
            <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={isActive('/dashboard')} alert />
          </button>
          <SidebarItem icon={<MessageCircle size={20}/>} text="Chats" active={isActive('/users')} />
          <button onClick= {() => {navigate("/view-users")}}>
            <SidebarItem icon={<Users size={20} />} text="Users" active={isActive('/view-users')} />
          </button>
          <SidebarItem icon={<Boxes size={20} />} text="Groups" />
          <SidebarItem icon={<Package size={20} />} text="Orders" active={isActive('/users')} alert />
          <SidebarItem icon={<Receipt size={20} />} text="Billings" active={isActive('/users')} />
          <hr className="my-3"/>
          <button onClick= {() => {navigate("/profile")}}>
            <SidebarItem icon={<UserCircle size={20} />} text="Profile" active={isActive('/profile')} />
          </button>

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