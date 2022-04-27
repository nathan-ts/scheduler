import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]); 

  const transition = function(newMode, replace = false) {
    // console.log("Mode history before transition:", history);
    if (replace) {
      setHistory(prev => {
        const overwriteLast = prev;
        overwriteLast[overwriteLast.length - 1] = newMode;
        return overwriteLast;
      });
    } else {
      setHistory(prev => {
        return ([...prev, newMode]);
      }); 
    }
    setMode(newMode);
    console.log("New mode:", newMode,"Mode history after transition:", history, "replace?", replace);
  };

  const back = function() {
    console.log("Going back... history", history);
    const lastHistory = history.length > 1 ? history.slice(0, -1) : history;
    setHistory(lastHistory);
    const lastMode = lastHistory[lastHistory.length - 1];
    setMode(lastMode)
    // console.log("Go back:", lastHistory, "Last mode:", lastMode);
  };

  return { mode, transition, back };
};