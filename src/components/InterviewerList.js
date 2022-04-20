import React from "react";
import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerList.scss";

export default function InterviewerList(props) {

  const interviewerArray = props.interviewers.map((i) => {
    const select = props.interviewer === i.id ? true : false;
    return <InterviewerListItem 
      key={i.id}
      id={i.id}
      name={i.name} 
      selected={select} 
      avatar={i.avatar} 
      setInterviewer={props.setInterviewer} 
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