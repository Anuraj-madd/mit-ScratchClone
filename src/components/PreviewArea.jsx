import React, { useContext, useState, useRef, useEffect } from "react";
import Getcontext from "../context/Getcontext";
import { FaPlus, FaPlay, FaTrash } from 'react-icons/fa';

const SpriteImage = React.memo(({ sprite, onMouseDown, isActive, dragStyle }) => {
  return (
    <img
      key={sprite.id}
      src={sprite.src}
      alt={`Sprite ${sprite.id}`}
      className={`cursor-${isActive ? 'grabbing' : 'grab'} select-none transition-transform duration-200 bg-transparent hover:scale-105 ${isActive ? 'ring-2 ring-blue-400' : ''}`}
      style={{
        position: "absolute",
        width: "100px",
        height: "100px",
        left: dragStyle?.x ?? sprite.position.x,
        top: dragStyle?.y ?? sprite.position.y,
        transform: `rotate(${isNaN(sprite.angle) ? 0 : sprite.angle}deg)`
      }}
      onMouseDown={(e) => onMouseDown(e, sprite)}
      draggable={false}
    />
  );
});

function PreviewArea() {
  const {
    spriteCount,
    collision,
    setCollision,
    setSpriteCount,
    curSprite,
    setCurSprite,
    sprites,
    setSprites,
    updatepreview,
    handleRunForAllSprites,
  } = useContext(Getcontext);

  const toggleSwitch = () => {
    setCollision(!collision);
  };
  const [activeImg, setActiveImg] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const previewRef = useRef(null);
  const [clickedButton, setClickedButton] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [draggedSpriteId, setDraggedSpriteId] = useState(null);
  const dragPosRef = useRef({ x: 0, y: 0 });
  const [dragStyle, setDragStyle] = useState(null);

  const imageOptions = [
    { name: "Cat", src: "https://en.scratch-wiki.info/w/images/ScratchCat3.0.svg" },
    { name: "Frog", src: "https://cdn.assets.scratch.mit.edu/internalapi/asset/390845c11df0924f3b627bafeb3f814e.svg/get/" },
    { name: "Penguin", src: "https://cdn.assets.scratch.mit.edu/internalapi/asset/428772307d90f4b347d6cc3c0d8e76ef.svg/get/" },
    { name: "Crab", src: "https://cdn.assets.scratch.mit.edu/internalapi/asset/f7cdd2acbc6d7559d33be8675059c79e.svg/get/" },
  ];

  const [selectedImage, setSelectedImage] = useState(imageOptions[0].src);

  const addSprite = () => {
    const newSprite = {
      id: `draggable-${sprites.length + 1}`,
      src: selectedImage,
      position: { x: 10, y: (sprites.length + 1) * 110 },
      angle: 0,
    };

    setSprites((prevSprites) => [...prevSprites, newSprite]);
    setSpriteCount((prevCount) => prevCount + 1);
    setCurSprite(newSprite.id);
    setClickedButton("addSprite"); 
    setTimeout(() => setClickedButton(null), 300); 
  };

  const removeSprite = () => {
    if (curSprite) {
      const updatedSprites = sprites.filter(
        (sprite) => sprite.id !== curSprite
      );
      setSprites(updatedSprites);
      setCurSprite(updatedSprites.length > 0 ? updatedSprites[0].id : null);
      setClickedButton("removeSprite"); 
      setTimeout(() => setClickedButton(null), 300); 
    }
  };

  const handleSelectChange = (e) => {
    setCurSprite(e.target.value);
  };

  const handleMouseDown = (e, sprite) => {
    e.preventDefault();
    setActiveImg(sprite);
    setDraggedSpriteId(sprite.id);
    setDragging(true);
    const previewRect = previewRef.current.getBoundingClientRect();
    const offsetX = e.clientX - previewRect.left - sprite.position.x;
    const offsetY = e.clientY - previewRect.top - sprite.position.y;
    setOffset({ x: offsetX, y: offsetY });
    dragPosRef.current = { x: sprite.position.x, y: sprite.position.y };
    setDragStyle({ x: sprite.position.x, y: sprite.position.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging || !activeImg) return;
    const previewRect = previewRef.current.getBoundingClientRect();
    const newX = e.clientX - previewRect.left - offset.x;
    const newY = e.clientY - previewRect.top - offset.y;
    const boundedX = Math.max(0, Math.min(newX, previewRect.width - 100));
    const boundedY = Math.max(0, Math.min(newY, previewRect.height - 100));
    dragPosRef.current = { x: boundedX, y: boundedY };
    setDragStyle({ x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => {
    if (dragging && activeImg) {
      setSprites((prevSprites) =>
        prevSprites.map((sprite) =>
          sprite.id === activeImg.id
            ? { ...sprite, position: { ...dragPosRef.current } }
            : sprite
        )
      );
    }
    setDragging(false);
    setActiveImg(null);
    setDraggedSpriteId(null);
    setDragStyle(null);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = 'move';
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = '';
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [dragging, activeImg]);

  useEffect(() => {
    console.log("Sprites updated:", sprites);
  }, [sprites, updatepreview]);

  return (
    <div
      ref={previewRef}
      className="w-full md:w-[38%] min-h-full overflow-auto bg-white border border-blue-100 rounded-xl shadow-lg py-8 px-8 relative text-gray-900 flex flex-col transition-all duration-300"
    >
      <div className="text-2xl text-blue-700 font-extrabold mb-6 tracking-tight flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        Stage
      </div>
      <div className="flex flex-wrap gap-4 mb-6 justify-between items-center w-full">
        <button
          onClick={addSprite}
          className={`flex-1 min-w-[100px] p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-all duration-200 text-center flex items-center justify-center gap-2 text-base ${clickedButton === "addSprite" ? "scale-95" : ""}`}
        >
          <FaPlus /> Add
        </button>
        <button
          className={`flex-1 min-w-[100px] bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg p-3 shadow-md transition-all duration-200 text-center flex items-center justify-center gap-2 text-base ${clickedButton === "runAllSprites" ? "scale-95" : ""}`}
          onClick={() => {
            handleRunForAllSprites();
            setClickedButton("runAllSprites");
            setTimeout(() => setClickedButton(null), 300);
          }}
        >
          <FaPlay /> Run All
        </button>
        <button
          onClick={removeSprite}
          className={`flex-1 min-w-[100px] p-3 bg-gray-200 hover:bg-gray-300 text-blue-700 rounded-lg font-semibold shadow-md transition-all duration-200 text-center flex items-center justify-center gap-2 text-base ${clickedButton === "removeSprite" ? "scale-95" : ""}`}
          disabled={!curSprite}
        >
          <FaTrash /> Remove
        </button>
      </div>
      <div className="flex flex-wrap gap-4 mb-4 w-full items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Selected Sprite:</span>
          <select
            value={curSprite || ""}
            onChange={handleSelectChange}
            className="p-3 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 text-base bg-blue-50 text-blue-700"
          >
            <option value="" disabled>
              Select a sprite
            </option>
            {sprites.map((sprite, index) => {
              const imageOpt = imageOptions.find(opt => opt.src === sprite.src);
              const displayName = imageOpt ? imageOpt.name : `Sprite ${index + 1}`;
              return (
                <option key={sprite.id} value={sprite.id}>
                  {displayName}
                </option>
              );
            })}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Add Sprite:</span>
          <select
            value={selectedImage}
            onChange={(e) => setSelectedImage(e.target.value)}
            className="p-3 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 text-base bg-blue-50 text-blue-700"
          >
            {imageOptions.map((option, index) => (
              <option key={index} value={option.src}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-between items-start mb-4 w-full">
        <div className="flex items-center space-x-3">
          <span className="font-medium text-blue-700 text-base">Hero Feature</span>
          <span className="text-xs text-blue-400">OFF</span>
          <span
            className={`w-14 h-7 flex items-center bg-blue-200 rounded-full p-1 cursor-pointer ${collision ? "bg-blue-500" : "bg-blue-200"}`}
            onClick={toggleSwitch}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform ${collision ? "translate-x-7" : "translate-x-0"} transition-all duration-200`}
            ></div>
          </span>
          <span className="text-xs text-blue-400">ON</span>
        </div>

        {curSprite && sprites.find(s => s.id === curSprite) && (
          <div className="p-2 border border-gray-300 rounded-md bg-gray-50 shadow-sm"> 
            <span className="block text-xs font-semibold text-gray-600 mb-1">Current Position:</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                X: {Math.round(sprites.find(s => s.id === curSprite).position.x)}
              </span>
              <span className="text-sm font-medium text-gray-700">
                Y: {Math.round(sprites.find(s => s.id === curSprite).position.y)}
              </span>
            </div>
          </div>
        )}
      </div>
      <hr className="my-2 border-t border-blue-100 w-full" />
      <div
        className="relative flex-1 w-full min-h-[300px] flex items-center justify-center rounded-xl shadow-inner border border-blue-100 bg-[#f7f7fa]"
      >
        {sprites.map((sprite) => (
          <React.Fragment key={sprite.id}>
            {sprite.bubble && (
              <div
                style={{
                  position: 'absolute',
                  left: (sprite.position.x ?? 0) + 50,
                  top: (sprite.position.y ?? 0) - 40,
                  zIndex: 10,
                  minWidth: 60,
                  maxWidth: 160,
                  padding: '6px 14px',
                  borderRadius: sprite.bubble.type === 'think' ? 20 : 16,
                  background: sprite.bubble.type === 'think' ? '#f3f4f6' : '#fff',
                  color: '#222',
                  border: '1px solid #ccc',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  fontStyle: sprite.bubble.type === 'think' ? 'italic' : 'normal',
                  fontSize: 15,
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                {sprite.bubble.text}
              </div>
            )}
            <SpriteImage
              sprite={sprite}
              onMouseDown={handleMouseDown}
              isActive={dragging && draggedSpriteId === sprite.id}
              dragStyle={dragging && draggedSpriteId === sprite.id ? dragPosRef.current : null}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default PreviewArea;
