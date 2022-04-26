import React from "react";
import "./styles.scss";

import Header from "components/Appointment/Header.js";
import Empty from "components/Appointment/Empty.js";
import Show from "components/Appointment/Show.js";
import Form from "components/Appointment/Form.js";
import Status from "components/Appointment/Status.js";
import Confirm from "components/Appointment/Confirm.js";

import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {

  // Mode Transitions to go back or forward in the app
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  // Save function to capture name and interviewer
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    // console.log("Calling bookInterview with", props.id, interview);
    props.bookInterview(props.id, interview)
      .then(response => transition(SHOW));
  };

  function remove(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(DELETING);
    props.cancelInterview(props.id, interview)
      .then(response => {
        console.log("Deleted appointment successfully!");
        transition(EMPTY);
      });
  };

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
        />
        // <div>SHOW:{JSON.stringify(props.interview)}</div>
      )}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers} 
          onCancel={back} 
          onSave={save}
        />
      )}
      {mode === CONFIRM && (
        <Confirm 
          message="Do you want to delete?"  
          onConfirm={remove}
          onCancel={back}
        />
      )}
      {mode === SAVING && (
        <Status message="Saving..." />
      )}
      {mode === DELETING && (
        <Status message="Deleting..." />
      )}
    </article>
  );
}