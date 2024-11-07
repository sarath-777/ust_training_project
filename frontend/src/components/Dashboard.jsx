import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useState,useEffect } from 'react';
import { USER_DATA } from '../constants';
import { setUser } from '../state/UserActions';
import api from '../api';

const Dashboard = () => {
    const adminData = useSelector((state) => state.user_data.user)
    const [loading,setLoading] = useState(false)
    const [events,setEvents] = useState([])
    const dispatch = useDispatch()
    const storedUser = localStorage.getItem(USER_DATA)

    useEffect(()=>{
    if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser)))
    }
    },[])

    useEffect(() => {
        // Create an async function to handle the API call
        const fetchData = async () => {
            setLoading(true)

            try {
                const response = await api.get('/api/events/')
                console.log(response.data,"alerts")
                setEvents(response.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()

    }, [])

    const alerts = events.filter(event => event.Event === false && event.Residence === adminData.Residence);

    const normalEvents = events.filter(event => event.Event === true && event.Residence === adminData.Residence);
    console.log('Filtered Alerts:', alerts);
    console.log('Filtered Regular Events:', normalEvents);

  return (
    <div className="dashboard-container ">
      {/* Alerts Section */}
      <div className="alerts-section mb-6 flex justify-center">
        <div className="alert-box w-full max-w-4xl bg-red-600 text-white p-6 rounded-lg shadow-md text-left">
          <h2 className="text-2xl font-semibold mb-4">ALERTS</h2>

          <ul className="alert-list space-y-4">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <li key={alert.id} className="alert-item p-4 bg-red-500 rounded-lg shadow-sm">
                  {/* Title */}
                  <div className="alert-title text-xl font-bold text-white mb-2">
                    {alert.Title}
                  </div>
                  {/* Residence */}
                  <div className="alert-residence text-sm font-medium text-gray-100 mb-2">
                    <strong>Residence:</strong> {alert.Residence}
                  </div>
                  {/* Date and Time */}
                  <div className="alert-datetime text-sm font-medium text-gray-200 mb-2">
                    <strong>Date:</strong> {alert.Date} | <strong>Time:</strong> {alert.Time}
                  </div>
                  {/* Description */}
                  <div className="alert-description text-sm text-gray-200">
                    <strong>Description:</strong> {alert.Description}
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-100">No current alerts.</p>
            )}
          </ul>

        </div>
      </div>

      {/* Events and News Section */}
      <div className="events-section flex-1">
          <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
          <ul className="event-list space-y-4">
            {normalEvents.length > 0 ? (
              normalEvents.map((event) => (
                <li key={event.id} className="event-item bg-blue-100 p-4 rounded-lg shadow-sm">
                  <div className="event-title text-xl font-bold text-blue-900 mb-2">
                    {event.Title}
                  </div>
                  <div className="event-datetime text-sm font-medium text-gray-700 mb-2">
                    <strong>Date:</strong> {event.Date} | <strong>Time:</strong> {event.Time}
                  </div>
                  <div className="event-description text-sm text-gray-600">
                    <strong>Description:</strong> {event.Description}
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No upcoming events.</p>
            )}
          </ul>
        </div>

        {/* News Section */}
        <div className="news-section flex-1">
          <h3 className="text-lg font-semibold">NEWS</h3>
          {/* {news.length > 0 ? (
            <ul className="news-list">
              {news.map((newsItem, index) => (
                <li key={index} className="news-item bg-green-100 p-3 mb-2 rounded">
                  {newsItem}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No current news.</p>
          )} */}
        </div>
      </div>
  );
}

export default Dashboard;
