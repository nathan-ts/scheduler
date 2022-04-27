import React from "react";
// import axios from 'axios';

import DayList from "components/DayList";
import Appointment from "components/Appointment/index.js";
import "components/Application.scss";

import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

export default function Application(props) {
  
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();


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
    // console.log("appointment list:", appointList);
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
