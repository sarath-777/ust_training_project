import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constants"
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator"

function RegisterForm({route,method}){
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [phoneNumber,setPhoneNumber] = useState("")
    const [isAdmin,setIsAdmin] = useState(false)
    const [residenceCode,setResidenceCode] = useState("")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (event) => {
        setResidenceCode(event.target.value);
      };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        try {
            const res = await api.post(route, {username,password,phoneNumber,isAdmin,residenceCode})
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Register</h1>
            {/* Username */}
            <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            />
            {/* Password*/}
            <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            />
            {/* Phone number */}
            <input
            className="form-input"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone number"
            />
            {/* Is Admin ? */}
            <div>
                <label htmlFor="#">Are you admin?</label>
                <input
                className="form-input"
                type="checkbox"
                value={isAdmin}
                onChange={(e) => setIsAdmin(e.target.value)}
                placeholder="Are you admin?"
                />
            </div>
            {/* Residence Code */}
            <div>
                <label htmlFor="dropdown">
                    {isAdmin ? "New Residence Name:" : "Residence Code:"}
                </label>
                {isAdmin ? (
                    <input
                        id="residenceCode"
                        className="form-input"
                        type="text"
                        value={residenceCode}
                        onChange={handleChange}
                        placeholder="Enter new Residence name"
                    />
                ) : (
                    <select
                        id="residenceCode"
                        value={residenceCode}
                        onChange={handleChange}
                    >
                        <option value="">Select an option</option>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                )}
            </div>

            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                Register
            </button>
        </form>
    )
}

export default RegisterForm