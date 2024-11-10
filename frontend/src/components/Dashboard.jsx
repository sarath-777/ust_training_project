import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useState,useEffect,useRef } from 'react';
import { USER_DATA } from '../constants';
import { setUser } from '../state/UserActions';
import api from '../api';
import Swal from 'sweetalert2';

const Dashboard = () => {
    // const adminData = useSelector((state) => state.user_data.user)
    const adminData = useSelector((state) => state.user_data.user)
    const [loading,setLoading] = useState(false)
    const [residenceUsers, setResidenceUsers] = useState([]);
    const [events,setEvents] = useState([])
    const [pincode,setPincode] = useState(adminData.Pincode)
    const [residenceName,setResidenceName] = useState(adminData.Adminresidence)
    const [residencePincode,setResidencePincode] = useState(adminData.Adminpincode)
    const [news, setNews] = useState([]);
    const [expandedAlertId, setExpandedAlertId] = useState(null);

    const dispatch = useDispatch()
    const storedUser = localStorage.getItem(USER_DATA)
    console.log(pincode,residenceName,residencePincode,"tooooooooooooooop",adminData)
    
    useEffect(()=>{
    if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser)))
    }

    const fetchNews = async () => {
      try {
        const newsResponse = await fetch('https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=f405a28b8384471aae6b8f5914f749d3');
        const newsData = await newsResponse.json();
        if (newsData.status === 'ok') {
          setNews(newsData.articles);
          console.log(news,"neeeeeeeeews")
        } else {
          console.log("Error fetching news:", newsData.message);
        }
  
        const alertEvents = await api.get('/api/events/');
        setEvents(alertEvents.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
  
    }
    fetchNews()
    
    },[])

    useEffect(() => {
        // Create an async function to handle the API call
        const fetchData = async () => {
            setLoading(true)

            if (!pincode) {
              const residenceData = await api.get('/api/admin/residenceOperations/')

              const { Adminresidence, Adminpincode } = adminData;
              console.log(pincode,Adminresidence,Adminpincode,"inside checking")

              let matchedResidenceId = null
              
              for (let i = 0; i < residenceData.data.length; i++) {
                const residence = residenceData.data[i];
                console.log(residence.ResidenceName,Adminresidence)
                if (residence.ResidenceName === Adminresidence && residence.Pincode === Adminpincode) {
                  matchedResidenceId = residence.id; // Store the id of the matched residence
                  console.log(matchedResidenceId,"inini")
                  break; // No need to continue once we've found a match
                }
              }

              if (matchedResidenceId) {
                  setPincode(matchedResidenceId)
                  dispatch(setUser({ ...adminData, Pincode: matchedResidenceId }));
                  localStorage.setItem(USER_DATA, JSON.stringify({ ...adminData, Pincode: matchedResidenceId }));
                console.log("Matched Residence ID:", matchedResidenceId, adminData.user.id);
                console.log(adminData,"haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah")
                const reply = await api.patch(`/api/admin/useroperations/${adminData.user.id}/`, { Pincode : matchedResidenceId })
                console.log('Pincode added:', reply.data);
              } else {
                console.log("No matching residence found.");
              }
            } else {
              const residenceData = await api.get('/api/admin/residenceOperations/')

              const { Pincode } = adminData;
              console.log(Pincode,"else checking")

              let matchedResidenceName = null
              let matchedResidencePincode = null

              for (let i = 0; i < residenceData.data.length; i++) {
                const residence = residenceData.data[i];

                if (residence.id === Pincode) {
                  
                  matchedResidenceName = residence.ResidenceName;
                  matchedResidencePincode = residence.Pincode;
                  console.log(residence.id,Pincode,matchedResidenceName,matchedResidencePincode,"daaaaaaaaaaaa")
                  break;
                }
              }

              if (matchedResidenceName) {
                setResidenceName(matchedResidenceName)
                dispatch(setUser({ ...adminData, Adminresidence: matchedResidenceName }));
                localStorage.setItem(USER_DATA, JSON.stringify({ ...adminData, Adminresidence: residenceName }));
                console.log("Matched Residence Name:", residenceName);
              } else {
                console.log("No matching residence found.");
              }

              if (matchedResidencePincode) {
                setResidencePincode(matchedResidencePincode)
                dispatch(setUser({ ...adminData, Adminpincode: matchedResidencePincode }));
                localStorage.setItem(USER_DATA, JSON.stringify({ ...adminData, Adminpincode: residencePincode }));
              } else {
                console.log("No matching residence found.");
                console.log("Matched Residence Pincode:", residencePincode);
              }

            }
            
            if (residenceName && residencePincode) {
              handleUserResidence(adminData.user.id, residenceName, residencePincode);
            } else {
                console.log("Residence name or pincode is missing.");
            }


            try {
                const alertEvents = await api.get('/api/events/')
                console.log(alertEvents.data,"alerts and events",adminData.Residence)
                setEvents(alertEvents.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }

        }
        fetchData()
        

    }, [])

    const handleUserResidence = async (userId) => {
      setLoading(true);
      try {
        console.log("Adminresidence", residenceName, "Adminpincode",residencePincode,"fetchh")
        const response = await api.patch(`/api/admin/useroperations/${userId}/`, { "Adminresidence": residenceName, "Adminpincode": residencePincode });
        setResidenceUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user.id === userId ? { ...user, Adminresidence: residenceName, Adminpincode: residencePincode } : user
          )
        );
        console.log('User residence and pincode added:', response.data);
      } catch (error) {
        console.error('Error :', error);
      } finally {
        setLoading(false);
      }
    };

    const alerts = events.filter(event => event.Event === false && event.Residence === adminData.Pincode && !event.Completed);
    console.log(events)

    const normalEvents = events.filter(event => event.Event === true && event.Residence === adminData.Pincode && !event.Completed);

    const toggleAlertExpand = (alertId) => {
      setExpandedAlertId(expandedAlertId === alertId ? null : alertId);
    };

    const handleEditEvent = async (eventId) => {
      try {
        const response = await api.get(`api/events/${eventId}/`);
        const event = response.data;
        let isCompleted = event.Completed;
        console.log("edit : ",isCompleted)

        const { value: formValues } = await Swal.fire({
          title: "Edit Alert/Event",
          html: `
            <div>
              <input type="text" id="event-title" value="${event.Title}" class="swal2-input" placeholder="Title" required>
            </div>
            <div>
              <label><strong>Date</strong></label>
              <input id="event-date" type="date" class="swal2-input" value="${event.Date}" required>
            </div>
            <div>
              <label><strong>Time</strong></label>
              <input id="event-time" type="time" class="swal2-input" value="${event.Time}" required>
            </div>
            <div>
              <input id="event-venue" type="text" class="swal2-input" value="${event.Venue}" placeholder="Venue">
            </div>
            <div>
              <input id="event-description" type="text" class="swal2-input" value="${event.Description}" placeholder="Description">
            </div>
            <div>
              <input id="event-completion" type="checkbox" ${isCompleted ? "checked" : ""}>
              <label>Completed</label>
            </div>
          `,
          focusConfirm: false,
          preConfirm: () => {
            // Collect form values
            const title = document.getElementById("event-title").value;
            const date = document.getElementById("event-date").value;
            const time = document.getElementById("event-time").value;
            const venue = document.getElementById("event-venue").value;
            const description = document.getElementById("event-description").value;
            const completed = document.getElementById("event-completion").checked;
    
            return { title, date, time, venue, description, completed };
          }
        });
    
        // Ensure formValues is returned and valid
        if (formValues) {
          // Prepare data for the API request
          const updatedEvent = {
            Title: formValues.title,
            Date: formValues.date,
            Time: formValues.time,
            Venue: formValues.venue,
            Description: formValues.description,
            Completed: formValues.completed
          };
    
          // Update the event via API
          console.log(updatedEvent.Completed,"jjjjjjjjjjjjjjjjjjjjjjj")
          const updateResponse = await api.patch(`api/events/makechanges/${eventId}/`, updatedEvent);
    
          // Handle success
          Swal.fire({
            title: "Event Updated!",
            text: "The event has been updated successfully.",
            icon: "success"
          });
        }
      } catch (error) {
        console.error("Error editing event:", error);
        Swal.fire({
          title: "Error",
          text: "There was an error editing the event.",
          icon: "error"
        });
      }
    };

    const handleDeleteEvent = async (eventId) => {
      try {
        const result = await Swal.fire({
          title: "Remove this Alert/Event?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Remove"
        });
    
        if (result.isConfirmed) {
          // Perform the API request to verify the user
          const updateResponse = await api.delete(`api/events/makechanges/${eventId}/`);
          
          console.log('Alert/Event removed', updateResponse.data);
    
          // Show a success message
          Swal.fire({
            title: "Removed",
            text: "The alert/event have been successfully deleted",
            icon: "success"
          });
        }
        
      } catch (error) {
        console.error('Error removing the Alert/Event:', error);
        // Show an error message
        Swal.fire({
          title: "Error!",
          text: "Issue in removing the Alert/Event",
          icon: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    const handleNewsClick = (url) => {
      window.open(url, '_blank');
    };

  return (
    <div className="dashboard-container ">
      {/* Alerts Section */}
      <div className="alerts-section mb-6 flex justify-center">
        <div className="alert-box w-full max-w-4xl bg-red-600 text-white p-6 rounded-lg shadow-md text-left">
          <h2 className="text-2xl font-semibold mb-4">ALERTS</h2>

          <ul className="alert-list space-y-4">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <li 
                  key={alert.id} 
                  className={`alert-item p-4 bg-red-500 rounded-lg shadow-sm cursor-pointer ${
                    expandedAlertId === alert.id ? 'bg-red-700' : ''
                    }`}
                  onClick={() => toggleAlertExpand(alert.id)}
                  >
                  {/* Title */}
                  <div className="alert-title text-xl font-bold text-white mb-2">
                    {alert.Title}
                  </div>
                    {expandedAlertId !== alert.id && (
                      <div className="alert-datetime text-sm font-medium text-gray-200 mb-2">
                        <strong>Date:</strong> {alert.Date} | <strong>Time:</strong> {alert.Time}
                      </div>
                    )}
                    {expandedAlertId === alert.id && (
                    <>
                      {alert.Venue && (
                        <div className="alert-residence text-sm font-medium text-gray-100 mb-2">
                          <strong>Venue:</strong> {alert.Venue}
                        </div>
                      )}
                      <div className="alert-datetime text-sm font-medium text-gray-200 mb-2">
                        <strong>Date:</strong> {alert.Date} | <strong>Time:</strong> {alert.Time}
                      </div>
                      <div className="alert-description text-sm text-gray-200">
                        <strong>Description:</strong> {alert.Description}
                      </div>
                      {adminData.isAdmin === true && (
                        <div>
                          <br />
                          <button
                            className="edit-button"
                            onClick={() => handleEditEvent(alert.id)}
                          >
                            <strong>Edit</strong>
                          </button>
                          <button
                          className="delete-button"
                          onClick={() => handleDeleteEvent(alert.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))
            ) : (
              <p className="text-gray-100">No current alerts.</p>
            )}
          </ul>

        </div>
      </div>

      {/* Events Section */}
      <div className="flex gap-6 w-full">
      <div className="events-section flex-1 h-[400px] overflow-y-auto custom-scrollbar">
          <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
          <ul className="event-list space-y-4">
            {normalEvents.length > 0 ? (
              normalEvents.map((event) => (
                <li 
                  key={event.id} 
                  className={`event-item bg-blue-100 p-4 rounded-lg shadow-sm cursor-pointer ${
                    expandedAlertId === event.id ? 'bg-blue-300' : ''
                    }`}
                  onClick={() => toggleAlertExpand(event.id)}
                >
                  <div className="event-title text-xl font-bold text-blue-900 mb-2">
                    {event.Title}
                  </div>
                  {expandedAlertId !== event.id && (
                      <div className="event-datetime text-sm font-medium text-gray-700 mb-2">
                        <strong>Date:</strong> {event.Date} | <strong>Time:</strong> {event.Time}
                      </div>
                  )}
                  {expandedAlertId === event.id && (
                    <>
                      <div className="event-datetime text-sm font-medium text-gray-700 mb-2">
                        <strong>Date:</strong> {event.Date} | <strong>Time:</strong> {event.Time}
                      </div>
                      <div className="event-description text-sm text-gray-800">
                        <strong>Description:</strong> {event.Description}
                      </div>
                      {adminData.isAdmin === true && (
                        <div>
                          <br />
                          <button
                            className="edit-button"
                            onClick={() => handleEditEvent(event.id)}
                          >
                            <strong>Edit</strong>
                          </button>
                          <button
                          className="delete-button"
                          onClick={() => handleDeleteEvent(event.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))
            ) : (
              <p className="text-gray-600">No upcoming events.</p>
            )}
          </ul>
        </div>

        {/* News Section */}
        <div className="news-section h-[400px] flex-1 bg-gray-100 p-4 rounded-lg shadow-lg overflow-y-auto custom-scrollbar">
          <h3 className="text-lg font-semibold mb-4">Latest News</h3>
          <ul className="news-list space-y-4">
            {news.length > 0 ? (
              news.map((article, index) => (
                <li
                  key={index}
                  className="news-item p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-200"
                  onClick={() => handleNewsClick(article.url)}
                >
                  <div className="news-title text-xl font-semibold text-blue-900 mb-2">
                    {article.title}
                  </div>
                  <div className="news-description text-sm text-gray-700 mb-2">
                    {article.description}
                  </div>
                  <div className="text-sm text-gray-500">{new Date(article.publishedAt).toLocaleString()}</div>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No news available at the moment.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
