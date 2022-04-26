import React from "react";
import DayListItem from "components/DayListItem";

export default function DayList(props) {
  // console.log("DayList update with props", props.days);

  const dayArray = props.days.map((day) => {
    const select = props.value === day.name ? true : false;
    return <DayListItem 
      key={day.id}
      name={day.name} 
      selected={select} 
      spots={day.spots} 
      onChange={props.onChange} 
    />
  });

  return(
    <ul>
      {dayArray}
    </ul>
  );
}