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

export function getInterviewersForDay(state, day) {
  // Get only the day for which the name matches the day prop
  const selectedDay = state.days.filter(d => d.name === day)[0];
  
  // Check if no days were found (skip if so)
  if (!selectedDay) {
    return [];
  }

  console.log("Selected day is", selectedDay);
  
  return selectedDay.interviewers.map(id => state.interviewers[id]);
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const interviewer = state.interviewers[interview.interviewer];
  if (interviewer) {
    const newInterview = {...interview};
    newInterview.interviewer = interviewer;
    return newInterview;
  }
  return null;
};
