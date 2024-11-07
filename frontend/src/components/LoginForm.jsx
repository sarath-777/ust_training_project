import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN,REFRESH_TOKEN, USER_DATA } from "../constants"
import "../styles/Form.css"
// Redux Part
import { useDispatch } from "react-redux"
import { setUser } from "../state/UserActions"
//
import LoadingIndicator from "./LoadingIndicator"

function LoginForm({route,method}){
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        try {
            const res = await api.post(route, {
                "username" : username,
                "password" : password
            })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data[0].access)
                localStorage.setItem(REFRESH_TOKEN, res.data[0].refresh)

                const userId = res.data[1].user_id
                console.log(userId)
                const userData = await api.get(`/api/admin/useroperations/${userId}/`)
                console.log(userData.data)
                // dispatch(setUser(userData.data))

                // Store user data in localStorage
                localStorage.setItem(USER_DATA, JSON.stringify(userData.data))

                // Dispatch user data to Redux
                dispatch(setUser(userData.data))

                navigate("/dashboard")
            } else {
                navigate("/login")
            }
        } catch (error) {
            // alert("This account is not verified by the admin. Please contact your admin.")
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Login</h1>
            <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            />
            <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                Login
            </button>
        </form>
    )
}

export default LoginForm