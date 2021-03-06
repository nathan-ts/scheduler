import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]); 

  const transition = function(newMode, replace = false) {
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
  };

  const back = function() {
    const lastHistory = history.length > 1 ? history.slice(0, -1) : history;
    setHistory(lastHistory);
    const lastMode = lastHistory[lastHistory.length - 1];
    setMode(lastMode)
  };

  return { mode, transition, back };
};
