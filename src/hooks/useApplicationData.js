import { useState, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}, 
    interviewers: {}
  });
  const setDay = day => setState({ ...state, day });
  
  // useEffect hook to async GET days, appointments, and interviewers from server
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'), 
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
      .then(response => {
        console.log("GET days", response[0].data, 
          "\nGET appts", response[1].data, 
          "\nGET interviewers", response[2].data);
        setState(prev => ({
          ...prev, 
          days: response[0].data, 
          appointments: response[1].data,
          interviewers: response[2].data
        }));
      });
  }, []);
  
  // Function to change state when we book interview
  function bookInterview(id, interview) {
    console.log("bookInterview called with:", id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // Update number of slots in the day we are booking in
    const days = updateSpots(state, appointments, id);

    // console.log("bookInterview updating state with appts:", appointments);
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(response => {
        console.log("PUT:", interview, "Response:", response.status);
        setState(prev => ({
          ...prev,
          appointments, 
          days
        }));
      })
    ;
  }
  
  // Function to change state to remove interview from appointment slot
  function cancelInterview(id) {
    console.log("cancelInterview called with:", id);
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // Update number of slots in the day we are booking in
    const days = updateSpots(state, appointments, id);

    console.log("Appointment after cancel to push", appointment);
    return axios.delete(`/api/appointments/${id}`, { interview: null })
      .then(response => {
        setState(prev => ({
          ...prev,
          appointments, 
          days
        }));
      });
  };

  const updateSpots = function(state, appointments, id) {
    // find the day
    const days = JSON.parse(JSON.stringify(state.days)); 
    const dayIndex = days.findIndex(d => d.name === state.day);
    const dayObj = days[dayIndex];

    // check appointments by id for no interview
    let spots = 0;
    for (const id of dayObj.appointments) {
      const appointment = appointments[id];
      console.log("Checking appointments for open spots:", appointment);
      if (!appointment.interview) {
        spots++;
      }
    }

    // Update the cloned days array with the new day object with correct spots
    const day = { ...dayObj, spots };
    days[dayIndex] = day;
    console.log("state.days updated with:", day);

    return days;
  };

  return { state, setDay, bookInterview, cancelInterview };
};
