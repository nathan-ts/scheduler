import { useState, useEffect } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]); 

  const transition = function(newMode, replace = false) {
    // console.log("Mode history before transition:", history);
    if (replace) {
      // const overwriteLast = history;
      // overwriteLast[overwriteLast.length - 1] = newMode;
      // setHistory(overwriteLast);
      setHistory(prev => {
        const overwriteLast = prev;
        overwriteLast[overwriteLast.length - 1] = newMode;
        return overwriteLast;
      });
    } else {
      // setHistory([...history, newMode]); 
      // setHistory(prev => ([...prev, newMode])); 
      setHistory(prev => {
        // console.log("No replace transition, prev:", prev, newMode);
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
