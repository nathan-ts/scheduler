import React, { useState, useEffect } from "react";
import axios from 'axios';

import DayList from "components/DayList";
import Appointment from "components/Appointment/index.js";
import "components/Application.scss";

import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

export default function Application(props) {

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
    // console.log("bookInterview updating state with appts:", appointments);
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(response => {
        console.log("PUT:", interview, "Response:", response.status);
        setState(prev => ({
          ...prev,
          appointments
        }))
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
    console.log("Appointment after cancel to push", appointment);
    return axios.delete(`/api/appointments/${id}`, { interview: null })
    .then(response => {
      console.log("DELETE interview Response:", response.status);
      setState(prev => ({
        ...prev,
        appointments
      }))
    });
  };

  const appointmentList = function() { // function wrapper maybe not needed, use appointList directly?
    // Get appointments and interviewers for the selected day
    const dailyAppointments = getAppointmentsForDay(state, state.day);
    const dailyInterviewers = getInterviewersForDay(state, state.day);
    // Create appointment list for the day
    const appointList = dailyAppointments.map(appointment => {
      // console.log("Daily interviewers for", state.day, "is", dailyInterviewers);
      const interview = getInterview(state, appointment.interview);
      // console.log("getInterview result:", interview);
      return (<Appointment 
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />)
    });
    appointList.push(<Appointment key="last" time="5pm" />);
    console.log("appointment list:", appointList);
    return appointList;
  }

  // Return application JSX
  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
      <DayList
        days={state.days}
        value={state.day}
        onChange={setDay}
      />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        {/* {appointList} */}
        {appointmentList()}
      </section>
    </main>
  );
}
