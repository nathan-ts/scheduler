import React from "react";
import PropTypes from 'prop-types';
import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerList.scss";

const InterviewerList = function(props) {

  const interviewerArray = props.interviewers.map((interviewer) => {
    return <InterviewerListItem 
      key={interviewer.id}
      name={interviewer.name} 
      selected={props.value === interviewer.id} 
      avatar={interviewer.avatar} 
      onChange={() => props.onChange(interviewer.id)} 
    />
  });

  return(
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewerArray}
      </ul>
    </section>
  );
};

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

export default InterviewerList;