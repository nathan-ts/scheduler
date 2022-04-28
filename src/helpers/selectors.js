// Get an array of all appointments for the specified day
export function getAppointmentsForDay(state, day) {
  // Get only the day for which the name matches the day prop
  const selectedDay = state.days.filter(d => d.name === day)[0];

  const appointmentsForDay = [];
  // Init appointments to return and check if no days were found (skip if so)
  if (selectedDay) {
    // Iterate over appointments list for the selected day, and return matching appointments
    for (const a of selectedDay.appointments) {
      const foundAppointment = state.appointments[a];
      if (foundAppointment) { 
        appointmentsForDay.push(foundAppointment);
      }
    }
  }

  return appointmentsForDay;
};

// Get an array of interviewers that are available for a specified day
export function getInterviewersForDay(state, day) {
  // Get only the day for which the name matches the day prop
  const selectedDay = state.days.filter(d => d.name === day)[0];
  
  // Check if no days were found (skip if so)
  if (!selectedDay) {
    return [];
  }
  
  return selectedDay.interviewers.map(id => state.interviewers[id]);
}

// Get the interview object, inclduing interviewer, for a specified interview
export function getInterview(state, interview) {
  // Exit early if interview is not defined
  if (!interview) {
    return null;
  }
  // Get the interviewer object from state given the interviewer ID
  const interviewer = state.interviewers[interview.interviewer];
  // Construct a copy of the interview object with the interviewer object included
  if (interviewer) {
    const newInterview = {...interview};
    newInterview.interviewer = interviewer;
    return newInterview;
  }
  // Return null if interviewer not found
  return null;
};
