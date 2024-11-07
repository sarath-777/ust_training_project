import React from 'react'
import SideNavbar, { SidebarItem } from '../components/SideNavbar'
import { useLocation,useNavigate } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { clearUser } from '../state/UserActions'
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
            <SidebarItem icon={<CircleFadingPlus size={20} />} text="Add Alert/Event" active={isActive('/users')} alert />
          : ""}
        
          <button onClick= {handleLogout}>
            <SidebarItem icon={<LogOut size={20} />} text="Logout" active={isActive('/logout')} onClick={handleLogout}/>
          </button>
        </SideNavbar>
      </>
    )
  }
  
  export default LeftSideNavbar