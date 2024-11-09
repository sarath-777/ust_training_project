import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_DATA } from "../constants";
import LoadingIndicator from "./LoadingIndicator";

function RegisterForm({ route, method, checkAdmin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [residenceCode, setResidenceCode] = useState("");
  const [residenceName, setResidenceName] = useState("");
  const [pincode, setPincode] = useState(null);
  const [pincodeList, setPincodeList] = useState([]);
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (checkAdmin === "true") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    fetchPincode();
  }, []);

  const checkResidenceExists = async () => {
    try {
      const response = await api.get("/api/admin/residenceOperations/", {
        params: { name: residenceName, pincode: pincode },
      });
      return response.data.exists;
    } catch (error) {
      console.error("Error checking residence:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const residenceExists = await checkResidenceExists();

    if (residenceExists) {
      setError("This residence group already exists with the same Name and Pincode.");
      setLoading(false);
      return;
    }

    try {
      let res;
      if (checkAdmin === "false") {
        res = await api.post(route, {
          user: {
            username,
            password,
            first_name: firstName,
            last_name: lastName,
            email,
          },
          phonenumber: phoneNumber,
          isAdmin,
          Pincode: residenceCode,
          bio,
          isVerified,
        });
      }

      if (checkAdmin === "true") {
        res = await api.post(route, {
          user: {
            username,
            password,
            first_name: firstName,
            last_name: lastName,
            email,
          },
          phonenumber: phoneNumber,
          isAdmin,
          Adminresidence: residenceName,
          Adminpincode: pincode,
          bio,
          isVerified: true,
        });
      }

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPincode = async () => {
    setLoading(true);
    try {
      const pincodeResponse = await api.get("/api/admin/residenceOperations/");
      setPincodeList(pincodeResponse.data);
    } catch (error) {
      console.error("Error fetching residence data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
      <div className="h-full max-w-screen-xl sm:m-10 bg-white shadow-lg sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="text-center">
            <img
              src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
              className="w-32 mx-auto"
              alt="Logo"
            />
            <h1 className="text-2xl xl:text-3xl font-extrabold mt-6">
              {isAdmin ? "Admin" : "User"} Registration
            </h1>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* First Name and Last Name in the same row */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="flex-1">
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              {/* Phone Number and Email in the same row */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                    required
                  />
                </div>
                <div className="flex-1">
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
              </div>

              {isAdmin ? (
                <>
                  <div>
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      value={residenceName}
                      onChange={(e) => setResidenceName(e.target.value)}
                      placeholder="Enter New Residence Name"
                      required
                    />
                  </div>

                  <div>
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter Pincode"
                      required
                    />
                  </div>
                </>
              ) : (
                <div>
                  <select
                    id="residenceCode"
                    value={residenceCode}
                    onChange={(e) => setResidenceCode(e.target.value)}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  >
                    <option value="">Select Residence</option>
                    {pincodeList?.length > 0 ? (
                      pincodeList.map((residence) => (
                        <option key={residence.id} value={residence.id}>
                          {residence.ResidenceName} ({residence.Pincode})
                        </option>
                      ))
                    ) : (
                      <option disabled>No residence data available</option>
                    )}
                  </select>
                </div>
              )}

              <div>
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Your Bio"
                  required
                />
              </div>

              {loading && <LoadingIndicator />}

              <button
                type="submit"
                className="w-full py-4 rounded-lg font-semibold bg-indigo-500 text-gray-100 hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:shadow-outline"
              >
                Register
              </button>
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

export default RegisterForm;
