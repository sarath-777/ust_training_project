import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN,REFRESH_TOKEN, USER_DATA } from "../constants"
import "../styles/Form.css"
// Redux Part
import { useSelector,useDispatch } from "react-redux"
import { setUser } from "../state/UserActions"
//
import LoadingIndicator from "./LoadingIndicator"

function LoginForm({route,method}){
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const adminData = useSelector((state) => state.user_data.user);
    const [pincode,setPincode] = useState(adminData.Pincode)
    const [residenceUsers, setResidenceUsers] = useState([]);
    const [residenceName,setResidenceName] = useState(adminData.Adminresidence)
    const [residencePincode,setResidencePincode] = useState(adminData.Adminpincode)
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        console.log(pincode,"pin outermost")
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
                dispatch(setUser(userData.data))

                // Store user data in localStorage
                localStorage.setItem(USER_DATA, JSON.stringify(userData.data))


                // fetchData()

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

    // const fetchData = async () => {
    //     setLoading(true)

    //     if (!pincode) {
    //       const residenceData = await api.get('/api/admin/residenceOperations/')

    //       const { Adminresidence, Adminpincode } = adminData;
    //       console.log(pincode,Adminresidence,Adminpincode,"inside checking")

    //       let matchedResidenceId = null
          
    //       for (let i = 0; i < residenceData.data.length; i++) {
    //         const residence = residenceData.data[i];
    //         console.log(residence.ResidenceName,Adminresidence)
    //         if (residence.ResidenceName === Adminresidence && residence.Pincode === Adminpincode) {
    //           matchedResidenceId = residence.id; // Store the id of the matched residence
    //           console.log(matchedResidenceId,"inini")
    //           break; // No need to continue once we've found a match
    //         }
    //       }

    //       if (matchedResidenceId) {
    //           setPincode(matchedResidenceId)
    //           dispatch(setUser({ ...adminData, Pincode: matchedResidenceId }));
    //           localStorage.setItem(USER_DATA, JSON.stringify({ ...adminData, Pincode: matchedResidenceId }));
    //         console.log("Matched Residence ID:", pincode);
    //       } else {
    //         console.log("No matching residence found.");
    //       }
    //     } else {
    //       const residenceData = await api.get('/api/admin/residenceOperations/')

    //       const { Pincode } = adminData;
    //       console.log(Pincode,"else checking")

    //       let matchedResidenceName = null
    //       let matchedResidencePincode = null

    //       for (let i = 0; i < residenceData.data.length; i++) {
    //         const residence = residenceData.data[i];

    //         if (residence.id === Pincode) {
              
    //           matchedResidenceName = residence.ResidenceName;
    //           matchedResidencePincode = residence.Pincode;
    //           console.log(residence.id,Pincode,matchedResidenceName,matchedResidencePincode,"daaaaaaaaaaaa")
    //           break;
    //         }
    //       }

    //       if (matchedResidenceName) {
    //         setResidenceName(matchedResidenceName)
    //         dispatch(setUser({ ...adminData, Adminresidence: matchedResidenceName }));
    //         localStorage.setItem(USER_DATA, JSON.stringify({ ...adminData, Adminresidence: residenceName }));

    //         try {
    //             const response = await api.patch(`/api/admin/useroperations/${userId}/`, { Adminresidence: matchedResidenceName });
    //             setResidenceUsers((prevUsers) =>
    //               prevUsers.map((user) =>
    //                 user.user.id === userId ? { ...user, Adminresidence: matchedResidenceName } : user
    //               )
    //             );
    //             console.log('User verified:', response.data);
    //           } catch (error) {
    //             console.error('Error verifying user:', error);
    //           } finally {
    //             setLoading(false);
    //           }

    //         console.log("Matched Residence Name:", residenceName);
    //       } else {
    //         console.log("No matching residence found.");
    //       }

    //       if (matchedResidencePincode) {
    //         setResidencePincode(matchedResidencePincode)
    //         dispatch(setUser({ ...adminData, Adminpincode: matchedResidencePincode }));
    //         localStorage.setItem(USER_DATA, JSON.stringify({ ...adminData, Adminpincode: residencePincode }));
    //       } else {
    //         console.log("No matching residence found.");
    //         console.log("Matched Residence Pincode:", residencePincode);
    //       }

    //     }
        
    //     if (residenceName && residencePincode) {
    //       handleUserResidence(adminData.user.id, residenceName, residencePincode);
    //     } else {
    //         console.log("Residence name or pincode is missing.");
    //     }


    //     try {
    //         const response = await api.get('/api/events/')
    //         console.log(response.data,"alerts")
    //         setEvents(response.data)
    //     } catch (error) {
    //         console.error('Error fetching data:', error)
    //     } finally {
    //         setLoading(false)
    //     }
    // }
    

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