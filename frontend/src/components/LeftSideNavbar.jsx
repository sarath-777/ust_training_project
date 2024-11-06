import React from 'react'
import SideNavbar, { SidebarItem } from '../components/SideNavbar'
import { useLocation } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import {
    CircleFadingPlus,
  Receipt,
  Boxes,
  Package,
  UserCircle,
  MessageCircle,
  LayoutDashboard,
  Settings,
} from "lucide-react"

const LeftSideNavbar = () => {
    const location = useLocation()
    const isActive = (path) => location.pathname === path
    const isAdmin = useSelector(state=>state.user.isAdmin)

    return (
      <>
        <SideNavbar className="w-fitcontent">
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={isActive('/')} alert />
          <SidebarItem icon={<MessageCircle size={20}/>} text="Chats" active={isActive('/users')} />
          <SidebarItem icon={<UserCircle size={20} />} text="Users" active={isActive('/users')} />
          <SidebarItem icon={<Boxes size={20} />} text="Groups" />
          <SidebarItem icon={<Package size={20} />} text="Orders" active={isActive('/users')} alert />
          <SidebarItem icon={<Receipt size={20} />} text="Billings" active={isActive('/users')} />
          <hr className="my-3"/>
          <SidebarItem icon={<Settings size={20} />} text="Settings" active={isActive('/users')} />
          {isAdmin ? 
            <SidebarItem icon={<CircleFadingPlus size={20} />} text="Add Alert/Event" active={isActive('/users')} alert />
          : ""}
          
        </SideNavbar>
      </>
    )
  }
  
  export default LeftSideNavbar