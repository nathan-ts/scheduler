import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {
  const listClass = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0 ? true : false
  });

  const spots = props.spots === 0 ? 
    'no spots remaining' : 
    props.spots === 1 ? `1 spot remaining` : `${props.spots} spots remaining`;

  return (
    <li className={listClass} onClick={() => props.onChange(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{spots}</h3>
    </li>
  );
}