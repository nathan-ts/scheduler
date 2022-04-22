import React, { useState, useEffect } from "react";
import axios from 'axios';

import DayList from "components/DayList";
import Appointment from "components/Appointment/index.js";
import "components/Application.scss";

// import { getAppointmentsForDay } from "helpers/selectors";

export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
  const dailyAppointments = [];
  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState(prev => ({ ...prev, days }));

  useEffect(() => {
    // axios.get('/api/days')
    //   .then(response => {
    //     console.log("GET api/days", response.data);
    //     // setDays(response.data);
    //   });
    Promise.all([axios.get('/api/days'), axios.get('/api/appointments')])
      .then(response => {
        console.log("GET days", response[0].data, "GET appts", response[1].data);
      });
  }, []);

  const appointList = dailyAppointments.map(appt => <Appointment 
    key={appt.id} 
    {...appt} 
  />);
  appointList.push(<Appointment key="last" time="5pm" />);

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
        {appointList}
      </section>
    </main>
  );
}
