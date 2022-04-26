import React from "react";
import "./styles.scss";

import Header from "components/Appointment/Header.js";
import Empty from "components/Appointment/Empty.js";
import Show from "components/Appointment/Show.js";
import Form from "components/Appointment/Form.js";
import Status from "components/Appointment/Status.js";
import Confirm from "components/Appointment/Confirm.js";
import Error from "components/Appointment/Error.js";

import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {

  // Mode Transitions to go back or forward in the app
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
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
      .then(() => transition(SHOW))
      .catch(err => {
        console.log(err.message);
        transition(ERROR_SAVE, true);
      });
  };

  // Delete interview scheduled in the selected appointment slot
  function remove() {
    // const interview = {
    //   student: name,
    //   interviewer
    // };
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(response => {
        console.log("Deleted appointment successfully!");
        transition(EMPTY);
      })
      .catch(err => {
        console.log(err.message);
        transition(ERROR_DELETE, true);
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
          onEdit={() => transition(EDIT)}
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
      {mode === EDIT && (
        <Form 
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
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
      {mode === ERROR_SAVE && (
        <Error message="Error in saving; appointment not saved." onClose={back}/>
      )}
      {mode === ERROR_DELETE && (
        <Error message="Error in deleting; appointment not deleted." onClose={back}/>
      )}
    </article>
  );
}