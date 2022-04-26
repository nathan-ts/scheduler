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
  function bookInterview(id, interview, update) {
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
    const dayI = state.days.findIndex(day => state.day === day.name);
    const days = [...state.days];
    if (!update) {
      days[dayI].spots--;
    }

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
    const dayI = state.days.findIndex(day => state.day === day.name);
    // let dayI = -1;
    // for (let i = 0; i < state.days.length; i++) {
    //   if (state.days[i].name === state.day) {
    //     dayI = i;
    //   }
    // }
    const days = [...state.days];
    days[dayI].spots++;

    console.log("Appointment after cancel to push", appointment);
    return axios.delete(`/api/appointments/${id}`, { interview: null })
      .then(response => {
        console.log("DELETE interview Response:", response.status);
        setState(prev => ({
          ...prev,
          appointments, 
          days
        }));
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
};
