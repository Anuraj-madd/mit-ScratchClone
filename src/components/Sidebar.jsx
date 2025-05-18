import React, { useContext, useState } from "react";
import { useDrag } from "react-dnd";
import Movex from "./Movex";
import Movey from "./Movey";
import Getcontext from "../context/Getcontext";
import RotateRight from "./RotateRight";
import RotateLeft from "./RotateLeft";
import Repeatation from "./Repeatation";
import Goto from "./Goto";

const ItemType = {
  COMPONENT: "component",
};

function Sidebar({ id }) {
  const { midArrays, deleteFromMidArray } = useContext(Getcontext);
  const midarray = midArrays[id] || [];
  const [sayText, setSayText] = useState("");
  const [thinkText, setThinkText] = useState("");
  const [sayForText, setSayForText] = useState("");
  const [sayForTime, setSayForTime] = useState(2);

  const blockSections = [
    {
      name: "Motion",
      color: "bg-blue-500",
      blocks: [
        { id: 1, name: "Move X" },
        { id: 2, name: "Move Y" },
        { id: 3, name: "Rotate Right" },
        { id: 4, name: "Rotate Left" },
        { id: 6, name: "Go to X , Y" },
      ],
    },
    {
      name: "Control",
      color: "bg-yellow-500",
      blocks: [
        { id: 5, name: "Repeat n times" },
        { id: 7, name: "Wait n Sec" },
      ],
    },
    {
      name: "Looks",
      color: "bg-purple-500",
      blocks: [
        { id: 8, name: "Say <text>" },
        { id: 9, name: "Think <text>" },
        { id: 10, name: "Say <text> for <time> sec" },
      ],
    },
  ];

  return (
    <div className="h-full w-[320px] bg-[#f7f7fa] border-r border-blue-100 flex flex-col items-stretch shadow-md rounded-xl p-4">
      <div className="sticky top-0 z-10 bg-[#f7f7fa] px-6 pt-6 pb-3 border-b border-blue-100 rounded-t-xl">
        <div className="text-blue-700 font-extrabold text-2xl tracking-tight mb-1 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L6 21m0 0l-3.75-4M6 21V3" /></svg>
          Blocks
        </div>
      </div>
      <div className="w-full flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {blockSections.map((section) => (
          <div key={section.name}>
            <h1 className={`text-base font-bold uppercase tracking-wide mb-3 px-2 text-blue-600 flex items-center gap-2`}>
              {section.name === 'Motion' && <span>🚀</span>}
              {section.name === 'Control' && <span>🕹️</span>}
              {section.name === 'Looks' && <span>💬</span>}
              {section.name}
            </h1>
            <div className="space-y-3">
              {section.blocks.map((item) => {
                let dragConfig = {
                  type: ItemType.COMPONENT,
                  item: { id: item.id },
                  collect: (monitor) => ({
                    isDragging: !!monitor.isDragging(),
                  }),
                };

                if (section.name === "Looks") {
                  if (item.id === 8) {
                    dragConfig = {
                      ...dragConfig,
                      item: { id: item.id, value: sayText },
                    };
                  } else if (item.id === 9) {
                    dragConfig = {
                      ...dragConfig,
                      item: { id: item.id, value: thinkText },
                    };
                  } else if (item.id === 10) {
                    dragConfig = {
                      ...dragConfig,
                      item: { id: item.id, value: sayForText, time: sayForTime },
                    };
                  }
                }

                const [{ isDragging }, drag] = useDrag(() => dragConfig);
                if (section.name === "Looks") {
                  if (item.id === 8) {
                    return (
                      <div
                        key={item.id}
                        ref={drag}
                        className={`w-full h-10 flex items-center justify-center ${section.color} text-white font-bold text-sm rounded transition-all duration-200 select-none cursor-pointer hover:shadow-md ${isDragging ? "opacity-40 scale-95" : "opacity-100"}`}
                        style={{ wordBreak: "break-word" }}
                      >
                        <span className="px-2">Say</span>
                        <input
                          type="text"
                          placeholder="text..."
                          value={sayText}
                          onChange={e => setSayText(e.target.value)}
                          className="ml-2 px-2 py-1 rounded text-gray-800 text-xs w-20 outline-none"
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                    );
                  } else if (item.id === 9) {
                    return (
                      <div
                        key={item.id}
                        ref={drag}
                        className={`w-full h-10 flex items-center justify-center ${section.color} text-white font-bold text-sm rounded transition-all duration-200 select-none cursor-pointer hover:shadow-md ${isDragging ? "opacity-40 scale-95" : "opacity-100"}`}
                        style={{ wordBreak: "break-word" }}
                      >
                        <span className="px-2">Think</span>
                        <input
                          type="text"
                          placeholder="text..."
                          value={thinkText}
                          onChange={e => setThinkText(e.target.value)}
                          className="ml-2 px-2 py-1 rounded text-gray-800 text-xs w-20 outline-none"
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                    );
                  } else if (item.id === 10) {     
                    return (
                      <div
                        key={item.id}
                        ref={drag}
                        className={`w-full h-10 flex items-center justify-center ${section.color} text-white font-bold text-sm rounded transition-all duration-200 select-none cursor-pointer hover:shadow-md ${isDragging ? "opacity-40 scale-95" : "opacity-100"}`}
                        style={{ wordBreak: "break-word" }}
                      >
                        <span className="px-2">Say</span>
                        <input
                          type="text"
                          placeholder="text..."
                          value={sayForText}
                          onChange={e => setSayForText(e.target.value)}
                          className="ml-2 px-2 py-1 rounded text-gray-800 text-xs w-16 outline-none"
                          onClick={e => e.stopPropagation()}
                        />
                        <span className="px-2">for</span>
                        <input
                          type="number"
                          placeholder="sec"
                          value={sayForTime}
                          min={1}
                          onChange={e => setSayForTime(Number(e.target.value))}
                          className="ml-2 px-2 py-1 rounded text-gray-800 text-xs w-10 outline-none"
                          onClick={e => e.stopPropagation()}
                        />
                        <span className="px-2">sec</span>
                      </div>
                    );
                  }
                }
                return (
                  <div
                    key={item.id}
                    ref={drag}
                    className={`w-full h-8 flex items-center justify-center ${section.color} text-white font-bold text-sm rounded transition-all duration-200 select-none cursor-pointer hover:shadow-md ${isDragging ? "opacity-40 scale-95" : "opacity-100"}`}
                    style={{ wordBreak: "break-word" }}
                  >
                    <div className="w-full text-center truncate px-2">
                      {item.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
