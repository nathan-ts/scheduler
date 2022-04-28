import { useState, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData(props) {

  // Set up state information
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
        // Set state and overwrite previous data with fetched information
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
    // Make updated appointments object
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // Update number of slots, in days, in the day we are booking in
    const days = updateSpots(state, appointments, id);
    // Return PUT request and update the state based on the new appointments and days props
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(response => {
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
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // Update number of slots, in days, in the day we are deleting in
    const days = updateSpots(state, appointments, id);
    // Return DELETE request and update state for the new appointments and days props
    return axios.delete(`/api/appointments/${id}`, { interview: null })
      .then(response => {
        setState(prev => ({
          ...prev,
          appointments, 
          days
        }));
      });
  };

  // Function to return an updated days array with the spots correctly updated, 
  //   based on the appointment data in state
  const updateSpots = function(state, appointments, id) {
    // find the day
    const days = JSON.parse(JSON.stringify(state.days)); 
    const dayIndex = days.findIndex(d => d.name === state.day);
    const dayObj = days[dayIndex];

    // check appointments by id for no interview
    let spots = 0;
    for (const id of dayObj.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        spots++;
      }
    }
    // Update the cloned days array with the new day object with correct spots
    const day = { ...dayObj, spots };
    days[dayIndex] = day;

    return days;
  };

  return { state, setDay, bookInterview, cancelInterview };
};
