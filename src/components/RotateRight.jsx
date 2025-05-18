import React, { useState, useContext, useEffect } from "react";
import { useDrag } from "react-dnd";
import Getcontext from "../context/Getcontext";

function RotateRight({ id, isDraggable = true }) {
  const { rotationInRight, setRotationRight } = useContext(Getcontext);
  
  const initialRotation = rotationInRight && rotationInRight[id] !== undefined ? rotationInRight[id] : 0;
  const [degrees, setDegrees] = useState(initialRotation);

  useEffect(() => {
    const contextRotation = rotationInRight && rotationInRight[id] !== undefined ? rotationInRight[id] : 0;
    setDegrees(contextRotation);
  }, [rotationInRight, id]);

  const handleChange = (e) => {
    const newDegrees = Number(e.target.value);
    setDegrees(newDegrees);
    if (setRotationRight) {
      setRotationRight(id, newDegrees);
    }
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "component",
    item: { id: 3, type: "RotateRight" },
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
      <span className="truncate">Rotate Right &nbsp;</span>
      <input
        type="number"
        className="rounded-sm w-12 text-xs h-6 text-blue-900 px-1 border border-blue-200 focus:ring-1 focus:ring-blue-300 bg-white shadow-sm text-center"
        value={degrees}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
      />
      <span className="ml-1">&nbsp; deg</span>
    </div>
  );
}

export default RotateRight;
