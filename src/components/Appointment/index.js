import React from "react";
import "./styles.scss";

import Header from "components/Appointment/Header.js";
import Empty from "components/Appointment/Empty.js";
import Show from "components/Appointment/Show.js";
import Form from "components/Appointment/Form.js";

import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {

  // Mode Transitions to go back or forward in the app
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  // Save function to capture name and interviewer
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    // console.log("Calling bookInterview with", props.id, interview);
    props.bookInterview(props.id, interview);
    transition(SHOW);
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
        // <div>SHOW:{JSON.stringify(props.interview)}</div>
      )}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers} 
          onCancel={() => transition(EMPTY)} 
          onSave={save}
        />
      )}
    </article>
  );
}