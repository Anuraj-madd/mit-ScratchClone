import React, { useContext, useEffect, useState } from "react";
import Getcontext from "../context/Getcontext";
import Movex from "./Movex";
import Movey from "./Movey";
import RotateRight from "./RotateRight";
import RotateLeft from "./RotateLeft";
import Repeatation from "./Repeatation";
import Goto from "./Goto";
import Wait from "./Wait";
import { useDrop, useDrag } from "react-dnd";
import LooksBlock from "./LooksBlock";

const DraggableMidAreaBlock = ({ block, spriteId, index, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "midarea-component", 
    item: { instanceId: block.instanceId, typeId: block.typeId, originalIndex: index, spriteId: spriteId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [block, spriteId, index]);

  return (
    <div ref={drag} className={`w-full max-w-[230px] mx-auto ${isDragging ? "opacity-50" : "opacity-100"}`}>
      {children}
    </div>
  );
};

function Midarea({ id }) {
  const {
    midArrays,
    stepInXValues,
    stepInYValues,
    rotationInRight,
    rotationInLeft,
    getCurrentSpriteValues,
    updateSpriteXPosition,
    updateSpriteYPosition,
    updateSpriteRightRotation,
    updateSpriteLeftRotation,
    Repeat,
    sprites,
    setSprites,
    getGotoValues,
    insertIntoMidArray,
    deleteFromMidArray,
    moveComponent,
    waitDurations,
    gotoValues,
  } = useContext(Getcontext);

  const midarray = midArrays[id] || [];
  const [clickedButtons, setClickedButtons] = useState({});

  useEffect(() => {
    console.log("Sprites updated:", sprites);
  }, [sprites]);

  const resetSprite = () => {
    console.log(id);
    const value1 = 0;
    updateSpriteXPosition(id, value1);
    updateSpriteYPosition(id, value1);
    updateSpriteRightRotation(id, value1);
    console.log(`Sprite ${id} reset to (x: 0, y: 0, angle: 0)`);
  };

  const handleButtonClick = (item) => {
    setClickedButtons((prev) => ({ ...prev, [item]: true }));
    setTimeout(() => {
      setClickedButtons((prev) => ({ ...prev, [item]: false }));
    }, 300);
  };

  const handleComponentClick = (item) => {
    setSprites((prevSprites) => {
      const updatedSprites = [...prevSprites];
      const currentSprite =
        updatedSprites.find((sprite) => sprite.id === id) || {};

      switch (item) {
        case 1: {
          const newX =
            (currentSprite.position?.x || 0) + (stepInXValues[id] || 0);
          return updatedSprites.map((sprite) =>
            sprite.id === id
              ? { ...sprite, position: { ...sprite.position, x: newX } }
              : sprite
          );
        }
        case 2: {
          const newY =
            (currentSprite.position?.y || 0) + (stepInYValues[id] || 0);
          return updatedSprites.map((sprite) =>
            sprite.id === id
              ? { ...sprite, position: { ...sprite.position, y: newY } }
              : sprite
          );
        }
        case 3: {
          const newRotation =
            (currentSprite.angle || 0) + (rotationInRight[id] || 0);
          return updatedSprites.map((sprite) =>
            sprite.id === id ? { ...sprite, angle: newRotation } : sprite
          );
        }
        case 4: {
          const newRotation =
            (currentSprite.angle || 0) - (rotationInLeft[id] || 0);
          return updatedSprites.map((sprite) =>
            sprite.id === id ? { ...sprite, angle: newRotation } : sprite
          );
        }
        case 6: {
          const { x, y } = (gotoValues && gotoValues[item])
                           ? gotoValues[item]
                           : { x: 0, y: 0 };
          return updatedSprites.map((sprite) =>
            sprite.id === id
              ? { ...sprite, position: { x: x || 0, y: y || 0 } }
              : sprite
          );
        }
        default:
          return updatedSprites;
      }
    });
  };

  const handleRun = async () => {
    const currentSpriteId = id;
    const scriptToRun = midArrays[currentSpriteId] || [];
    
    let repeatCount = 1;
    const repeatBlockInstance = scriptToRun.find(block => block.typeId === 5);
    
    if (repeatBlockInstance && Repeat && Repeat[repeatBlockInstance.instanceId] !== undefined) {
      repeatCount = Repeat[repeatBlockInstance.instanceId] || 1;
    } else if (repeatBlockInstance) {
      repeatCount = 1; 
      console.warn(`Repeat block ${repeatBlockInstance.instanceId} for sprite ${currentSpriteId} found, but no count in context. Defaulting to 1.`);
    }

    for (let rLoop = 0; rLoop < repeatCount; rLoop++) { 
      for (const block of scriptToRun) { 
        if (block.typeId === 5) {
          continue;
        }

        if (block.typeId === 7) {
          const duration = (waitDurations && waitDurations[block.instanceId] !== undefined)
                            ? waitDurations[block.instanceId]
                            : 1;
          if (duration > 0) {
            console.log(`Sprite ${currentSpriteId} waiting for ${duration}s (block: ${block.instanceId})`);
            await new Promise(resolve => setTimeout(resolve, duration * 1000));
          }
          continue;
        }

        await new Promise((resolve) => {
          setTimeout(() => {
            setSprites((prevSprites) => {
              const updatedSprites = [...prevSprites];
              const currentSprite = updatedSprites.find((s) => s.id === currentSpriteId) || {};
              let newSprites = updatedSprites;

              switch (block.typeId) {
                case 1: {
                  const stepX = (stepInXValues && stepInXValues[block.instanceId] !== undefined)
                                ? stepInXValues[block.instanceId]
                                : (stepInXValues[currentSpriteId] || 0);
                  const newX = (currentSprite.position?.x || 0) + stepX;
                  newSprites = updatedSprites.map((s) =>
                    s.id === currentSpriteId ? { ...s, position: { ...s.position, x: newX } } : s
                  );
                  break;
                }
                case 2: {
                  const stepY = (stepInYValues && stepInYValues[block.instanceId] !== undefined)
                                ? stepInYValues[block.instanceId]
                                : (stepInYValues[currentSpriteId] || 0);
                  const newY = (currentSprite.position?.y || 0) + stepY;
                  newSprites = updatedSprites.map((s) =>
                    s.id === currentSpriteId ? { ...s, position: { ...s.position, y: newY } } : s
                  );
                  break;
                }
                case 3: {
                  const rotationAmount = (rotationInRight && rotationInRight[block.instanceId] !== undefined)
                                        ? rotationInRight[block.instanceId]
                                        : (rotationInRight[currentSpriteId] || 0);
                  const newAngle = (currentSprite.angle || 0) + rotationAmount;
                  newSprites = updatedSprites.map((s) =>
                    s.id === currentSpriteId ? { ...s, angle: newAngle } : s
                  );
                  break;
                }
                case 4: { 
                  const rotationAmount = (rotationInLeft && rotationInLeft[block.instanceId] !== undefined)
                                        ? rotationInLeft[block.instanceId]
                                        : (rotationInLeft[currentSpriteId] || 0);
                  const newAngle = (currentSprite.angle || 0) - rotationAmount;
                  newSprites = updatedSprites.map((s) =>
                    s.id === currentSpriteId ? { ...s, angle: newAngle } : s
                  );
                  break;
                }
                case 6: {
                  const { x, y } = (gotoValues && gotoValues[block.instanceId])
                                   ? gotoValues[block.instanceId]
                                   : { x: 0, y: 0 };
                  newSprites = updatedSprites.map((s) =>
                    s.id === currentSpriteId ? { ...s, position: { x: x || 0, y: y || 0 } } : s
                  );
                  break;
                }
                case 8: { 
                  const sayText = block.value || "Hello!";
                  newSprites = updatedSprites.map((s) =>
                    s.id === currentSpriteId ? { ...s, bubble: { type: 'say', text: sayText } } : s
                  );
                  setTimeout(() => {
                    setSprites((sprites) => sprites.map((sprite) => sprite.id === currentSpriteId ? { ...sprite, bubble: null } : sprite));
                  }, 2000);
                  break;
                }
                case 9: { 
                  const thinkText = block.value || "Hmm...";
                  newSprites = updatedSprites.map((s) =>
                    s.id === currentSpriteId ? { ...s, bubble: { type: 'think', text: thinkText } } : s
                  );
                  setTimeout(() => {
                    setSprites((sprites) => sprites.map((sprite) => sprite.id === currentSpriteId ? { ...sprite, bubble: null } : sprite));
                  }, 2000);
                  break;
                }
                case 10: {
                  const sayText = block.value || "Hello!";
                  const duration = block.time || 2;
                  newSprites = updatedSprites.map((s) =>
                    s.id === currentSpriteId ? { ...s, bubble: { type: 'say', text: sayText } } : s
                  );
                  setTimeout(() => {
                    setSprites((sprites) => sprites.map((sprite) => sprite.id === currentSpriteId ? { ...sprite, bubble: null } : sprite));
                  }, duration * 1000);
                  break;
                }
              }
              return newSprites;
            });
            resolve();
          }, 200);
        });
      }
    }
  };

  const componentMap = {
    1: Movex,
    2: Movey,
    3: RotateRight,
    4: RotateLeft,
    5: Repeatation,
    6: Goto,
    7: Wait,
    8: LooksBlock,
    9: LooksBlock,
    10: LooksBlock,
  };

  const [{ isOver }, drop] = useDrop({
    accept: "component",
    drop: (item) => {
      console.log("[Midarea] drop received item:", JSON.stringify(item));
      if (item.id === 8 || item.id === 9 || item.id === 10) {
        insertIntoMidArray(id, item.id, item.value, item.time);
      } else {
        insertIntoMidArray(id, item.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [, dropForReorder] = useDrop({
    accept: "midarea-component",
    hover: (item, monitor) => {
      if (!monitor.canDrop()) return;
      const dragIndex = midarray.indexOf(item.instanceId);
      const hoverIndex = monitor.getClientOffset(); 

      if (dragIndex !== -1 && hoverIndex !== -1 && dragIndex !== hoverIndex) {
        moveComponent(id, dragIndex, hoverIndex);
      }
    },
  });

  const [{ isOverOutside }, dropOutside] = useDrop({
    accept: ["component", "midarea-component"],
    drop: (item) => {
      console.log("[Midarea] dropOutside received item:", JSON.stringify(item));
      if (item.instanceId && item.spriteId) {
        console.log("[Midarea] Calling deleteFromMidArray for item from MidArea. spriteId:", item.spriteId, "instanceId:", item.instanceId);
        deleteFromMidArray(item.spriteId, item.instanceId);
      } else if (item.id && !item.instanceId) {
        console.log("[Midarea] Item from sidebar dragged to dropOutside, no action taken in midArray state:", JSON.stringify(item));
      } else {
        console.warn("[Midarea] dropOutside: item not recognized for deletion", JSON.stringify(item));
      }
    },
    collect: (monitor) => ({
      isOverOutside: !!monitor.isOver(),
    }),
  });

  return (
    <div className="w-full md:w-[40%] p-8 min-h-full flex flex-col overflow-auto bg-white border border-blue-100 rounded-xl shadow-lg gap-8 items-center transition-all duration-300 relative">
      <div className="sticky top-0 z-10 bg-white w-full pb-4 mb-2 border-b border-blue-100 rounded-t-xl">
        <div className="text-blue-700 text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Script Area
        </div>
      </div>
      <div
        ref={(node) => drop(dropForReorder(node))} 
        className="droparea bg-[#f7f7fa] py-6 min-h-[30vh] px-6 overflow-auto rounded-lg flex flex-col justify-start items-center border-2 border-dashed border-blue-300 gap-3 shadow w-full"
      >
        {midarray.length === 0 ? (
          <div className="text-gray-400 w-full py-6 px-8 text-center">Drop here</div>
        ) : (
          midarray.map((block, index) => {
            const Component = componentMap[block.typeId];
            return Component ? (
              <DraggableMidAreaBlock key={block.instanceId} block={block} spriteId={id} index={index}>
                {block.typeId === 8 || block.typeId === 9 || block.typeId === 10 ? (
                  <LooksBlock block={block} spriteId={id} isEditable={true} />
                ) : (
                  <Component id={block.instanceId} spriteId={id} isDraggable={false} />
                )}
              </DraggableMidAreaBlock>
            ) : null;
          })
        )}
      </div>
      <div
        ref={dropOutside}
        className="border-dashed border-2 border-red-200 text-red-500 p-3 mt-2 w-full flex justify-center rounded-md bg-red-50"
      >
        {isOverOutside ? (
          <span>Release to delete</span>
        ) : (
          <span>Drag here to remove</span>
        )}
      </div>
      <div className="flex gap-4 w-full mt-4">
        <button
          onClick={() => {
            handleButtonClick("run");
            handleRun();
          }}
          className={`w-1/2 bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white font-bold shadow-md transition-transform duration-300 ${clickedButtons["run"] ? "scale-95" : ""}`}
        >
          ▶ Run
        </button>
        <button
          onClick={() => {
            handleButtonClick("reset");
            resetSprite();
          }}
          className={`w-1/2 bg-gray-300 hover:bg-gray-400 p-3 rounded-lg text-blue-700 font-bold shadow-md transition-transform duration-300 ${clickedButtons["reset"] ? "scale-95" : ""}`}
        >
          ⟳ Reset Sprite
        </button>
      </div>
      <hr className="my-4 border-t border-blue-100 w-full" />
      <div className="text-sm bg-[#f7f7fa] text-blue-700 p-3 rounded-md mt-2 shadow-inner text-center w-full">
        If you want to see hero animation just use two different images. Run all sprites button to see the hero animation.
      </div>
    </div>
  );
}

export default Midarea;
