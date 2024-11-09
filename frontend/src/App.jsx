import react from 'react'
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom'
import Login from './pages/Login'
import UserRegister from './pages/UserRegister'
import AdminRegister from './pages/AdminRegister'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Dashboard from './components/Dashboard'
import GetUsersForAdmin from './components/GetUsersForAdmin'
import { useDispatch } from "react-redux"
import { clearUser } from "../src/state/UserActions"
import ProtectedRoute from './components/ProtectedRoute'
import ProfileEdit from './components/ProfileEdit'


function Logout() {
  localStorage.clear()

  const dispatch = useDispatch()
  dispatch(clearUser())
  return <Navigate to="/login" />
}

function UserRegisterAndLogout() {
  localStorage.clear()
  return <UserRegister />
}

function AdminRegisterAndLogout() {
  localStorage.clear()
  return <AdminRegister />
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/user/register" element={<UserRegisterAndLogout />} />
        <Route path="/admin/register" element={<AdminRegisterAndLogout />} />
        
        <Route path="/" element={<Home />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-users"
            element={
              <ProtectedRoute>
                <GetUsersForAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
