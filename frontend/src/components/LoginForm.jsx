import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_DATA } from "../constants";
import "../styles/Form.css";
import Logo from "../assets/HAVEN.png"
// Redux Part
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../state/UserActions";
//
import LoadingIndicator from "./LoadingIndicator";

function LoginForm({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const adminData = useSelector((state) => state.user_data.user);
//   const [pincode, setPincode] = useState(adminData.Pincode);
//   const [residenceUsers, setResidenceUsers] = useState([]);
//   const [residenceName, setResidenceName] = useState(adminData.Adminresidence);
//   const [residencePincode, setResidencePincode] = useState(adminData.Adminpincode);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await api.post(route, {
        "username": username,
        "password": password,
      });

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data[0].access);
        localStorage.setItem(REFRESH_TOKEN, res.data[0].refresh);

        const userId = res.data[1].user_id;
        const userData = await api.get(`/api/admin/useroperations/${userId}/`);
        dispatch(setUser(userData.data));

        // Store user data in localStorage
        localStorage.setItem(USER_DATA, JSON.stringify(userData.data));

        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log("hiiiii")
      if (error.response) {
        // Handle the error based on status code or error message in the response
        if (error.response.status === 400) {
          // Check if the error response contains a message
          const errorMessage = error.response.data?.detail || "Check your credentials or contact your Admin.";
          alert(errorMessage);
        } else {
          // For other types of errors, show a more general message
          alert("An unexpected error occurred. Please try again later.");
        }
      } else {
        // This could be a network issue or no response from the server
        console.error("Network Error or No Response:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
      <div className="max-w-screen-xl sm:m-10 bg-white shadow-lg sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="text-center">
            <img
              src={Logo}
              className="w-40 mx-auto"
              alt="Logo"
            />
            <h1 className="text-2xl xl:text-3xl font-extrabold mt-6">
              Login to Your Account
            </h1>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username in separate row */}
              <div>
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
              </div>

              {/* Password in separate row */}
              <div>
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>

              {loading && <LoadingIndicator />}

              <button
                type="submit"
                className="w-full py-4 rounded-lg font-semibold bg-indigo-500 text-gray-100 hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:shadow-outline"
              >
                Login
              </button>
              <div className="flex justify-center gap-2">
                <span>New here? </span>
                <button
                  onClick={() => {navigate('/user/register')}}
                  className="text-indigo-700"
                >
                  <b>Register</b>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
