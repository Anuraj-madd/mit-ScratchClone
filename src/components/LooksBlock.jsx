import React, { useContext } from "react";
import Getcontext from "../context/Getcontext";

function LooksBlock({ block, spriteId, isEditable }) {
  const { updateBlockValue } = useContext(Getcontext);

  let content = null;
  if (block.typeId === 8) {
    content = (
      <>
        <span className="px-2">Say</span>
        {isEditable ? (
          <input
            type="text"
            value={block.value || ""}
            onChange={e => updateBlockValue(spriteId, block.instanceId, e.target.value)}
            className="bg-white text-purple-700 rounded px-2 py-1 mx-1 text-xs outline-none w-24"
          />
        ) : (
          <span className="bg-white text-purple-700 rounded px-2 py-1 mx-1 text-xs">{block.value || ""}</span>
        )}
      </>
    );
  } else if (block.typeId === 9) {
    content = (
      <>
        <span className="px-2">Think</span>
        {isEditable ? (
          <input
            type="text"
            value={block.value || ""}
            onChange={e => updateBlockValue(spriteId, block.instanceId, e.target.value)}
            className="bg-white text-purple-700 rounded px-2 py-1 mx-1 text-xs outline-none w-24"
          />
        ) : (
          <span className="bg-white text-purple-700 rounded px-2 py-1 mx-1 text-xs">{block.value || ""}</span>
        )}
      </>
    );
  } else if (block.typeId === 10) {
    content = (
      <>
        <span className="px-2">Say</span>
        {isEditable ? (
          <>
            <input
              type="text"
              value={block.value || ""}
              onChange={e => updateBlockValue(spriteId, block.instanceId, e.target.value, block.time)}
              className="bg-white text-purple-700 rounded px-2 py-1 mx-1 text-xs outline-none w-16"
            />
            <span className="px-2">for</span>
            <input
              type="number"
              value={block.time || 2}
              min={1}
              onChange={e => updateBlockValue(spriteId, block.instanceId, block.value, Number(e.target.value))}
              className="bg-white text-purple-700 rounded px-2 py-1 mx-1 text-xs outline-none w-10"
            />
            <span className="px-2">sec</span>
          </>
        ) : (
          <>
            <span className="bg-white text-purple-700 rounded px-2 py-1 mx-1 text-xs">{block.value || ""}</span>
            <span className="px-2">for</span>
            <span className="bg-white text-purple-700 rounded px-2 py-1 mx-1 text-xs">{block.time || 2}</span>
            <span className="px-2">sec</span>
          </>
        )}
      </>
    );
  }
  return (
    <div className="w-full h-10 flex items-center justify-center bg-purple-500 text-white font-bold text-sm rounded transition-all duration-200 select-none cursor-pointer hover:shadow-md" style={{ wordBreak: "break-word" }}>
      {content}
    </div>
  );
}

export default LooksBlock; 