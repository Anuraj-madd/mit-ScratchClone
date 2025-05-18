import React, { useState, useContext, useEffect } from "react";
import { useDrag } from "react-dnd";
import Getcontext from "../context/Getcontext";

function Movey({ id, isDraggable = true }) {
  const { stepInYValues, setStepInY } = useContext(Getcontext);
  
  const initialStep = stepInYValues && stepInYValues[id] !== undefined ? stepInYValues[id] : 0;
  const [step, setStep] = useState(initialStep);

  useEffect(() => {
    const contextStep = stepInYValues && stepInYValues[id] !== undefined ? stepInYValues[id] : 0;
    setStep(contextStep);
  }, [stepInYValues, id]);

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setStep(newValue);
    if (setStepInY) {
      setStepInY(id, newValue);
    }
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "component",
    item: { id: 2, type: "MoveY" },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [id]);

  return (
    <div
      className={`w-full h-8 flex items-center justify-between px-3 ${isDragging && isDraggable ? "opacity-40 scale-95" : "opacity-100"} bg-blue-500 text-white font-bold text-sm rounded transition-all duration-200 select-none cursor-pointer hover:shadow-md`}
      ref={isDraggable ? drag : null}
      style={{wordBreak: 'break-word'}}
    >
      <span className="truncate">Move Y &nbsp;</span>
      <input
        type="number"
        className="rounded-sm w-12 text-xs h-6 text-blue-900 px-1 border border-blue-200 focus:ring-1 focus:ring-blue-300 bg-white shadow-sm text-center"
        value={step}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default Movey;
