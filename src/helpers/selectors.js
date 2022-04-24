export function getAppointmentsForDay(state, day) {
  // Get only the day for which the name matches the day prop
  const selectedDay = state.days.filter(d => d.name === day)[0];

  const appointmentsForDay = [];
  // Init appointments to return and check if no days were found (skip if so)
  if (selectedDay) {
    // Iterate over appointments list for the selected day, and
    //   return matching appointments
    for (const a of selectedDay.appointments) {
      const foundAppointment = state.appointments[a];
      if (foundAppointment) { 
        appointmentsForDay.push(foundAppointment);
      }
    }
  }

  return appointmentsForDay;
};

export function getInterviewersForDay(state, day) {
  // Get only the day for which the name matches the day prop
  const selectedDay = state.days.filter(d => d.name === day)[0];

  const interviewersForDay = [];
  // Init interviewers to return and check if no days were found (skip if so)
  if (selectedDay) {
    // Iterate over interviewers list for the selected day, and
    //   return matching interviewers
    for (const a of selectedDay.appointments) {
      const foundInterview = state.appointments[a].interview;
      const foundInterviewerId = foundInterview ? foundInterview.interviewer : undefined;
      const foundInterviewer = state.interviewers[foundInterviewerId];
      if (foundInterviewer) { 
        interviewersForDay.push(foundInterviewer);
      }
    }
  }

  return interviewersForDay;
}

export function getInterview(state, interview) {
  console.log("interview passed in for get is:", interview)
  if (!interview) {
    return null;
  }
  const interviewer = state.interviewers[interview.interviewer]
  if (interviewer) {
    interview.interviewer = interviewer;
    return interview;
  }
  return null;
};
