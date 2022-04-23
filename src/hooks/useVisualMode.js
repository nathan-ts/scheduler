import { useState, useEffect } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]); 

  const transition = function(newMode, replace = false) {
    if (replace) {
      const overwriteLast = history;
      overwriteLast[overwriteLast.length - 1] = newMode;
      setHistory(overwriteLast)
    } else {
      setHistory([...history, newMode])
    }
    setMode(newMode);
  };

  const back = function() {
    const lastHistory = history.length > 1 ? history.slice(0, -1) : history;
    setHistory(lastHistory);
    const lastMode = lastHistory[lastHistory.length - 1];
    setMode(lastMode)
    // console.log("Go back:", lastHistory, "Last mode:", lastMode);
  };

  return { mode, transition, back };
}