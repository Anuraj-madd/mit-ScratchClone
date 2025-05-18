import React, { useState, useContext, useEffect } from "react";
import { useDrag } from "react-dnd";
import Getcontext from "../context/Getcontext";

function Wait({ id, isDraggable = true }) {
  const { setWaitDurationValue, waitDurations } = useContext(Getcontext);
  const initialSeconds = waitDurations && waitDurations[id] !== undefined ? waitDurations[id] : 1;
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const contextSeconds = waitDurations && waitDurations[id] !== undefined ? waitDurations[id] : 1;
    setSeconds(contextSeconds);
  }, [waitDurations, id]);

  const handleChange = (e) => {
    let newValue = Number(e.target.value);
    if (newValue < 0) {
      newValue = 0;
    }
    setSeconds(newValue);
    if (setWaitDurationValue) {
      setWaitDurationValue(id, newValue);
    }
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "component",
    item: { id: 7, type: "Wait" },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [id]); 

  return (
    <div
      className={`w-full h-8 flex items-center justify-between px-3 ${isDragging && isDraggable ? "opacity-40 scale-95" : "opacity-100"} bg-yellow-500 text-white font-bold text-sm rounded transition-all duration-200 select-none cursor-pointer hover:shadow-md`}
      ref={isDraggable ? drag : null} 
      style={{ wordBreak: "break-word" }}
    >
      <span className="truncate">Wait</span>
      <input
        type="number"
        min="0"
        step="0.1"
        className="rounded-sm w-12 text-xs h-6 text-black px-1 border border-gray-300 focus:ring-1 focus:ring-yellow-400 bg-white shadow-sm text-center mx-1"
        value={seconds}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
      />
      <span className="truncate">Sec</span>
    </div>
  );
}

export default Wait; 