import React from "react";
import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerList.scss";

export default function InterviewerList(props) {

  const interviewerArray = props.interviewers.map((interviewer) => {
    const select = props.interviewer === interviewer.id ? true : false;
    return <InterviewerListItem 
      key={interviewer.id}
      id={interviewer.id}
      name={interviewer.name} 
      selected={select} 
      avatar={interviewer.avatar} 
      setInterviewer={() => props.setInterviewer(interviewer.id)} 
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
}