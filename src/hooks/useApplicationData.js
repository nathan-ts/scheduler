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
    const dayI = state.days.findIndex(day => state.day === day.name);
    const days = [...state.days];
    days[dayI].spots--;

    // console.log("bookInterview updating state with appts:", appointments);
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(response => {
        console.log("PUT:", interview, "Response:", response.status);
        setState(prev => ({
          ...prev,
          appointments, 
          days
        }));
        // updateSpots();
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
    const days = [...state.days];
    days[dayI].spots++;

    console.log("Appointment after cancel to push", appointment);
    return axios.delete(`/api/appointments/${id}`, { interview: null })
      .then(response => {
        console.log("DELETE interview Response:", response.status);
        setState(prev => ({
          ...prev,
          appointments
        }));
        // updateSpots();
      });
  };

  // function updateSpots() {
  //   const updatedDays = [...state.days];
  //   // console.log("Days before update:",state.days);
  //   // for (const d of state.days) {
  //   for (let i = 0; i < updatedDays.length; i++) {
  //     // console.log("For loop check:",state.days[d], d);
  //     const openSpots = updatedDays[i].appointments.reduce((prev, curr) => {
  //       if (!state.appointments[curr].interview) {
  //         return prev + 1;
  //       }
  //       return prev;
  //     }, 0);
  //     console.log("Open spots", openSpots, "id", i );
  //     console.log("updated days before add", updatedDays);
  //     updatedDays[i].spots = openSpots;
  //   }
  //   console.log(updatedDays);

  //   setState(prev => ({
  //     ...prev,
  //     days: updatedDays
  //   }));

  //   console.log("Updated spots", state.days);
  // }

  return { state, setDay, bookInterview, cancelInterview };
};

/*
[
  {
    "id":1,"name":"Monday",
    "appointments":[1,2,3,4,5],
    "interviewers":[2,4,8,9,10],"spots":2
  },{
    "id":2,"name":"Tuesday",
    "appointments":[6,7,8,9,10],
    "interviewers":[1,3,4,6,9],"spots":3
  },{"id":3,"name":"Wednesday",
    "appointments":[11,12,13,14,15],
    "interviewers":[1,4,5,6,10],"spots":3
  },{"id":4,"name":"Thursday",
    "appointments":[16,17,18,19,20],
    "interviewers":[2,3,4,8,9],"spots":1
  },{"id":5,"name":"Friday",
    "appointments":[21,22,23,24,25],
    "interviewers":[1,2,6,8,9],"spots":4
  }
]
*/