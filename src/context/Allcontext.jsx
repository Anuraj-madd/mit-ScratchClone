import React, { useState, useEffect } from "react";
import Getcontext from "./Getcontext";
import { v4 as uuidv4 } from 'uuid';

function Allcontext(props) {
  const [spriteCount, setSpriteCount] = useState(0);
  const [curSprite, setCurSprite] = useState(null); 
  const [sprites, setSprites] = useState([]);
  const [midArrays, setMidArrays] = useState({});
  const [stepInXValues, setStepInXValues] = useState({});
  const [stepInYValues, setStepInYValues] = useState({});
  const [gotoValues, setGotoValues] = useState({});
  const [collision, setCollision] = useState(false);
  const [rotationInRight, setRotationInRight] = useState({});
  const [rotationInLeft, setRotationInLeft] = useState({}); 
  const [Repeat, setRepeat] = useState({}); 
  const [updatepreview, setupdatepreview] = useState(true);
  const [waitDurations, setWaitDurations] = useState({}); 
  const [swappedPairs, setSwappedPairs] = useState({});

  const setupdatepreviewvalue = () => {
    setupdatepreview(!updatepreview);
    return updatepreview;
  };

  const insertIntoMidArray = (spriteId, typeId, value = undefined, time = undefined) => {
    const blockInstanceId = uuidv4();
    const newBlock = { instanceId: blockInstanceId, typeId: typeId };
    if (value !== undefined) newBlock.value = value;
    if (time !== undefined) newBlock.time = time;
    setMidArrays((prevMidArrays) => ({
      ...prevMidArrays,
      [spriteId]: prevMidArrays[spriteId] ? [...prevMidArrays[spriteId], newBlock] : [newBlock],
    }));
  };
  const deleteFromMidArray = (spriteId, blockInstanceId) => {
    setMidArrays((prevMidArrays) => ({
      ...prevMidArrays,
      [spriteId]: prevMidArrays[spriteId]?.filter((block) => block.instanceId !== blockInstanceId) || [],
    }));
  };
  const setGoto = (id, xValue, yValue) => {
    setGotoValues((prevGotoValues) => ({
      ...prevGotoValues,
      [id]: { x: xValue, y: yValue },
    }));
  };
  const getGotoValues = (id) => {
    return gotoValues[id] || { x: 0, y: 0 };
  };
  const setStepInX = (id, value) => {
    setStepInXValues((prevStepInX) => ({
      ...prevStepInX,
      [id]: value,
    }));
  };

  const setStepInY = (id, value) => {
    setStepInYValues((prevStepInY) => ({
      ...prevStepInY,
      [id]: value,
    }));
  };

  const updateSpriteXPosition = (id, newX) => {
    setSprites((prevSprites) =>
      prevSprites.map((sprite) =>
        sprite.id === id
          ? { ...sprite, position: { ...sprite.position, x: newX } }
          : sprite
      )
    );
  };

  useEffect(() => {
    console.log("Sprites updated:", sprites);
  }, [sprites]);
  const updateSpriteYPosition = (id, newY) => {
    setSprites((prevSprites) => {
      const updatedSprites = prevSprites.map((sprite) => {
        if (sprite.id === id) {
          return {
            ...sprite,
            position: {
              ...sprite.position,
              y: newY,
            },
          };
        }
        return sprite; 
      });
      setupdatepreviewvalue();
      return updatedSprites; 
    });
  };
  const updateSpriteRightRotation = (id, newRotation) => {
    setSprites((prevSprites) => {
      const updatedSprites = prevSprites.map((sprite) => {
        if (sprite.id === id) {
          return {
            ...sprite,
            angle: newRotation,
          };
        }
        return sprite;
      });
      setupdatepreviewvalue();
      return updatedSprites;
    });
  };

  const updateSpriteLeftRotation = (id, newRotation) => {
    setSprites((prevSprites) => {
      const updatedSprites = prevSprites.map((sprite) => {
        if (sprite.id === id) {
          return {
            ...sprite,
            angle: newRotation,
          };
        }
        return sprite;
      });
      setupdatepreviewvalue();
      return updatedSprites;
    });
  };
  const setRotationLeft = (id, value) => {
    setRotationInLeft((prevRotationInLeft) => ({
      ...prevRotationInLeft,
      [id]: value,
    }));
  };
  const getCurrentSpriteValues = (id) => {
    if (id) {
      const currentSprite = sprites.find((sprite) => sprite.id === id);
      if (currentSprite) {
        setupdatepreviewvalue();
        return {
          x: currentSprite.position.x,
          y: currentSprite.position.y,
          rotation: currentSprite.angle,
        };
      }
    }
  };

  const setRotationRight = (id, value) => {
    setRotationInRight((prevRotationInRight) => ({
      ...prevRotationInRight,
      [id]: value,
    }));
  };
  const setRepeatValue = (id, value) => {
    setRepeat((prevRepeat) => ({
      ...prevRepeat,
      [id]: value,
    }));
  };

  const moveComponent = (spriteId, fromIndex, toIndex) => {
    setMidArrays((prevMidArrays) => {
      const midArrayForSprite = prevMidArrays[spriteId];
      if (!midArrayForSprite || fromIndex < 0 || fromIndex >= midArrayForSprite.length || toIndex < 0 || toIndex > midArrayForSprite.length) {
        console.warn("moveComponent: Invalid arguments or array state for spriteId:", spriteId, "from:", fromIndex, "to:", toIndex);
        return prevMidArrays;
      }
      const updatedMidArray = [...midArrayForSprite];
      const [movedItem] = updatedMidArray.splice(fromIndex, 1); 
      updatedMidArray.splice(toIndex, 0, movedItem); 
      return { ...prevMidArrays, [spriteId]: updatedMidArray };
    });
  };

  const handleRunForAllSprites = async () => {
    const promises = Object.keys(sprites).map(async (key) => {
      const spriteId = sprites[key].id;
      const scriptToRun = midArrays[spriteId] || [];
      let repeatCount = 1;
      const repeatBlockInstance = scriptToRun.find(block => block.typeId === 5);
      
      if (repeatBlockInstance && Repeat && Repeat[repeatBlockInstance.instanceId] !== undefined) {
        repeatCount = Repeat[repeatBlockInstance.instanceId] || 1;
      } else if (repeatBlockInstance) {
        repeatCount = 1; 
        console.warn(`Repeat block ${repeatBlockInstance.instanceId} for sprite ${spriteId} found, but no count in context. Defaulting to 1.`);
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
              console.log(`Waiting for ${duration} seconds (block: ${block.instanceId})`);
              await new Promise(resolve => setTimeout(resolve, duration * 1000));
            }
            continue; 
          }

          await new Promise((resolve) => {
            setTimeout(() => {
              setSprites((prevSprites) => {
                const updatedSprites = [...prevSprites];
                const currentSprite =
                  updatedSprites.find((s) => s.id === spriteId) || {};
                switch (block.typeId) {
                  case 1: {
                    const stepX = (stepInXValues && stepInXValues[block.instanceId] !== undefined) 
                                   ? stepInXValues[block.instanceId] 
                                   : (stepInXValues[spriteId] || 0);
                    const newX = (currentSprite.position?.x || 0) + stepX;
                    const newSprites = updatedSprites.map((s) =>
                      s.id === spriteId
                        ? { ...s, position: { ...s.position, x: newX } }
                        : s
                    );
                    return newSprites;
                  }
                  case 2: {
                    const stepY = (stepInYValues && stepInYValues[block.instanceId] !== undefined)
                                   ? stepInYValues[block.instanceId]
                                   : (stepInYValues[spriteId] || 0);
                    const newY = (currentSprite.position?.y || 0) + stepY;
                    const newSprites = updatedSprites.map((s) =>
                      s.id === spriteId
                        ? { ...s, position: { ...s.position, y: newY } }
                        : s
                    );
                    return newSprites;
                  }
                  case 3: {
                    const rotationAmount = (rotationInRight && rotationInRight[block.instanceId] !== undefined)
                                            ? rotationInRight[block.instanceId]
                                            : (rotationInRight[spriteId] || 0);
                    const newRotation = (currentSprite.angle || 0) + rotationAmount;
                    const newSprites = updatedSprites.map((s) =>
                      s.id === spriteId ? { ...s, angle: newRotation } : s
                    );
                    return newSprites;
                  }
                  case 4: {
                    const rotationAmount = (rotationInLeft && rotationInLeft[block.instanceId] !== undefined)
                                            ? rotationInLeft[block.instanceId]
                                            : (rotationInLeft[spriteId] || 0);
                    const newRotation = (currentSprite.angle || 0) - rotationAmount;
                    const newSprites = updatedSprites.map((s) =>
                      s.id === spriteId ? { ...s, angle: newRotation } : s
                    );
                    return newSprites;
                  }
                  case 6: {
                    const { x, y } = (gotoValues && gotoValues[block.instanceId])
                                     ? gotoValues[block.instanceId]
                                     : { x: 0, y: 0};
                    const newSprites = updatedSprites.map((s) =>
                      s.id === spriteId
                        ? { ...s, position: { x: x || 0, y: y || 0 } }
                        : s
                    );
                    return newSprites;
                  }
                  case 8: {
                    const sayText = block.value || "Hello!";
                    const newSprites = updatedSprites.map((s) =>
                      s.id === spriteId ? { ...s, bubble: { type: 'say', text: sayText } } : s
                    );
                    setTimeout(() => {
                      setSprites((sprites) => sprites.map((sprite) => sprite.id === spriteId ? { ...sprite, bubble: null } : sprite));
                    }, 2000);
                    return newSprites;
                  }
                  case 9: {
                    const thinkText = block.value || "Hmm...";
                    const newSprites = updatedSprites.map((s) =>
                      s.id === spriteId ? { ...s, bubble: { type: 'think', text: thinkText } } : s
                    );
                    setTimeout(() => {
                      setSprites((sprites) => sprites.map((sprite) => sprite.id === spriteId ? { ...sprite, bubble: null } : sprite));
                    }, 2000);
                    return newSprites;
                  }
                  case 10: { 
                    const sayText = block.value || "Hello!";
                    const duration = block.time || 2;
                    const newSprites = updatedSprites.map((s) =>
                      s.id === spriteId ? { ...s, bubble: { type: 'say', text: sayText } } : s
                    );
                    setTimeout(() => {
                      setSprites((sprites) => sprites.map((sprite) => sprite.id === spriteId ? { ...sprite, bubble: null } : sprite));
                    }, duration * 1000);
                    return newSprites;
                  }
                  default:
                    return updatedSprites;
                }
              });
              resolve();
            }, 500);
          });
        }
      }
    });

    await Promise.all(promises);
  };

  const swapSpritesIfClose = (currentSprites) => {
    const spritesToCheck = [...currentSprites]; 
    let newSwappedPairsChanges = null;

    for (let i = 0; i < spritesToCheck.length; i++) {
      for (let j = i + 1; j < spritesToCheck.length; j++) {
        const spriteA = spritesToCheck[i];
        const spriteB = spritesToCheck[j];
        if (!spriteA.position || !spriteB.position) {
          console.warn("Sprite position undefined, skipping collision check for:", spriteA.id, spriteB.id);
          continue;
        }

        const pairKey = [spriteA.id, spriteB.id].sort().join('-');
        const distance = Math.sqrt(
          Math.pow(spriteA.position.x - spriteB.position.x, 2) +
            Math.pow(spriteA.position.y - spriteB.position.y, 2)
        );

        if (distance <= 80) {
          if (!swappedPairs[pairKey]) {
            console.log(
              `Collision detected between ${spriteA.id} and ${spriteB.id}. Swapping their tasks.`
            );
            setMidArrays((prevMidArrays) => {
              const newMidArrays = { ...prevMidArrays };
              const tempMidArrayA = newMidArrays[spriteA.id] || [];
              newMidArrays[spriteA.id] = newMidArrays[spriteB.id] || [];
              newMidArrays[spriteB.id] = tempMidArrayA;
              return newMidArrays;
            });
            if (!newSwappedPairsChanges) newSwappedPairsChanges = {...swappedPairs};
            newSwappedPairsChanges[pairKey] = true;
          }
        } else {
          if (swappedPairs[pairKey]) {
            console.log(`Sprites ${spriteA.id} and ${spriteB.id} are no longer colliding. Resetting swap status.`);
            if (!newSwappedPairsChanges) newSwappedPairsChanges = {...swappedPairs};
            delete newSwappedPairsChanges[pairKey];
          }
        }
      }
    }
    if (newSwappedPairsChanges) {
      setSwappedPairs(newSwappedPairsChanges);
    }
  };

  useEffect(() => {
    if(collision){
      swapSpritesIfClose(sprites);
    }
}, [sprites,collision]);
  const setWaitDurationValue = (blockInstanceId, duration) => {
    setWaitDurations((prevWaitDurations) => ({
      ...prevWaitDurations,
      [blockInstanceId]: duration,
    }));
  };
  const updateBlockValue = (spriteId, instanceId, newValue, newTime) => {
    setMidArrays((prevMidArrays) => {
      const updatedArray = (prevMidArrays[spriteId] || []).map(block => {
        if (block.instanceId === instanceId) {
          return {
            ...block,
            value: newValue !== undefined ? newValue : block.value,
            time: newTime !== undefined ? newTime : block.time,
          };
        }
        return block;
      });
      return { ...prevMidArrays, [spriteId]: updatedArray };
    });
  };

  return (
    <Getcontext.Provider
      value={{
        spriteCount,
        setSpriteCount,
        curSprite,
        setCurSprite,
        sprites,
        setSprites,
        midArrays,
        insertIntoMidArray,
        deleteFromMidArray,
        stepInXValues,
        setStepInX,
        stepInYValues,
        setStepInY,
        updateSpriteXPosition,
        updateSpriteYPosition,
        setRotationRight,
        rotationInRight,
        updateSpriteRightRotation,
        updateSpriteLeftRotation,
        setRotationLeft,
        rotationInLeft,
        Repeat,
        setRepeatValue,
        getCurrentSpriteValues,
        updatepreview,
        setupdatepreview,
        setupdatepreviewvalue,
        gotoValues,
        setGoto,
        getGotoValues,
        moveComponent,
        handleRunForAllSprites,
        swapSpritesIfClose,
        collision,
        setCollision,
        waitDurations,
        setWaitDurationValue,
        updateBlockValue,
        swappedPairs,
        setSwappedPairs,
      }}
    >
      {props.children}
    </Getcontext.Provider>
  );
}

export default Allcontext;
