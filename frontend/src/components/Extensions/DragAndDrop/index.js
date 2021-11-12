import React, { useRef, useEffect, useState } from "react";

const DragAndDrop = (props) => {
  const dropRef = useRef();
  const [dragging, setDragging] = useState(false);
  let dragCounter;

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };
  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter  === 0) {
      setDragging(false);
    }
  };
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      props.handleDrop(e.dataTransfer.files);
    //   e.dataTransfer.clearData();
      dragCounter = 0;
    }
  };

  useEffect(() => {
    dragCounter = 0;
    let div = dropRef.current;
    div.addEventListener("dragenter", handleDragIn);
    div.addEventListener("dragleave", handleDragOut);
    div.addEventListener("dragover", handleDrag);
    div.addEventListener("drop", handleDrop);

    return () => {
      div.removeEventListener("dragenter", handleDragIn);
      div.removeEventListener("dragleave", handleDragOut);
      div.removeEventListener("dragover", handleDrag);
      div.removeEventListener("drop", handleDrop);
    };
  }, []);

  return (
    <div
      ref={dropRef}
      style={{ display: "inline-block", position: "relative" }}
    >
      {dragging && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              left: 0,
              textAlign: "center",
              color: "grey",
              fontSize: 36,
            }}
          >
            <div>drop here :)</div>
          </div>
        </div>
      )}
      {props.children}
    </div>
  );
};

export default DragAndDrop;
