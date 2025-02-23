import React from "react";
import { useDrag } from "react-dnd";

const DeviceListItem = ({ type, name, image, width, height }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "LIST_DEVICE",
    item: { type, name, image, width, height },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        borderRadius: "5px",
        textAlign: "center",
        marginBottom: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
      }}
    >
      {name}
    </div>
  );
};

export default DeviceListItem;
