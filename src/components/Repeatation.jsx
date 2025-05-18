import React, { useState, useContext, useEffect } from "react";
import { useDrag } from "react-dnd";
import Getcontext from "../context/Getcontext";

function Repeatation({ id, isDraggable = true }) {
  const { Repeat, setRepeatValue } = useContext(Getcontext);
  
  const initialRepeatCount = (Repeat && Repeat[id] !== undefined) ? Repeat[id] : 1;
  const [count, setCount] = useState(initialRepeatCount);

  useEffect(() => {
    const contextRepeatCount = (Repeat && Repeat[id] !== undefined) ? Repeat[id] : 1;
    setCount(contextRepeatCount);
  }, [Repeat, id]);

  const handleChange = (e) => {
    let newValue = Number(e.target.value);
    if (newValue < 0) newValue = 0;
    setCount(newValue);
    if (setRepeatValue) {
        setRepeatValue(id, newValue); 
    }
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "component",
    item: { id: 5, type: "Repeat" }, 
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
      <span className="truncate">Repeat</span>
      <input
        type="number"
        min="0" 
        className="rounded-sm w-12 text-xs h-6 text-black px-1 border border-gray-300 focus:ring-1 focus:ring-yellow-400 bg-white shadow-sm text-center mx-1"
        value={count}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()} 
      />
      <span className="truncate">times</span>
    </div>
  );
}

export default Repeatation;
