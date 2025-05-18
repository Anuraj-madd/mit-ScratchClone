import React, { useState, useContext, useEffect } from "react";
import Getcontext from "../context/Getcontext";
import { useDrag } from "react-dnd";

function Goto({ id, isDraggable = true }) {
  const { gotoValues, setGoto, getGotoValues } = useContext(Getcontext);
  
  const initialXY = (gotoValues && gotoValues[id]) ? gotoValues[id] : { x: 0, y: 0 };
  const [x, setX] = useState(initialXY.x);
  const [y, setY] = useState(initialXY.y);

  useEffect(() => {
    const contextXY = (gotoValues && gotoValues[id]) ? gotoValues[id] : { x: 0, y: 0 };
    setX(contextXY.x);
    setY(contextXY.y);
  }, [gotoValues, id]);

  const handleXChange = (e) => {
    const newXValue = Number(e.target.value);
    setX(newXValue);
    if (setGoto) {
      setGoto(id, newXValue, y); 
    }
  };

  const handleYChange = (e) => {
    const newYValue = Number(e.target.value);
    setY(newYValue);
    if (setGoto) {
      setGoto(id, x, newYValue); 
    }
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "component",
    item: { id: 6, type: "Goto" },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [id]); 

  return (
    <div
      className={`w-full h-8 flex items-center justify-around px-2 ${isDragging && isDraggable ? "opacity-40 scale-95" : "opacity-100"} bg-blue-500 text-white font-bold text-sm rounded transition-all duration-200 select-none cursor-pointer hover:shadow-md`}
      ref={isDraggable ? drag : null}
      style={{ wordBreak: "break-word" }}
    >
      <span className="truncate">Goto X:</span>
      <input
        type="number"
        className="rounded-sm w-10 text-xs h-5 text-black px-1 border border-gray-300 focus:ring-1 focus:ring-blue-400 bg-white shadow-sm text-center mx-1"
        value={x}
        onChange={handleXChange}
        onClick={(e) => e.stopPropagation()} 
      />
      <span className="truncate">Y:</span>
      <input
        type="number"
        className="rounded-sm w-10 text-xs h-5 text-black px-1 border border-gray-300 focus:ring-1 focus:ring-blue-400 bg-white shadow-sm text-center mx-1"
        value={y}
        onChange={handleYChange}
        onClick={(e) => e.stopPropagation()} 
      />
    </div>
  );
}

export default Goto;
