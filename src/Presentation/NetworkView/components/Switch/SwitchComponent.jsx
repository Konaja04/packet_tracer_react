import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { Popover, Box, FormControlLabel, Checkbox } from "@mui/material";

const SwitchComponent = ({
  id,
  x,
  y,
  device,
  image,
  width,
  height,
  type,
  cableMode,
  handleConection,
  selectedPortFrom,
  setSelectedPortFrom,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "CANVAS_DEVICE",
    item: { id, x, y, width, height, type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [usedPorts, setUsedPorts] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClick = (event) => {
    if (!cableMode) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl2(event.currentTarget);
    }
  };


  const handlePortSelect = (port) => {
    if (!selectedPortFrom) {
      setSelectedPortFrom({
        fromID: id,
        fromInterface: port,
        fromX: x,
        fromY: y,
      });
    } else {
      if (selectedPortFrom.fromID !== id) {
        const portTo = {
          toID: id,
          toInterface: port,
          toX: x,
          toY: y,
        };
        handleConection(portTo);
      }
    }
    setAnchorEl2(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open2 = Boolean(anchorEl2);
  const popoverId2 = open2 ? `popover-${id}-cable` : undefined;

  const style = {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    opacity: isDragging ? 0.5 : 1,
    cursor: "move",
    width: `${width}px`,
    height: `${height}px`,
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  };
  const nameStyle = {
    color: "#000000",
    position: "absolute",
    bottom: "-20px",
    textAlign: "center",
    width: "100%",
  };
  return (
    <div ref={drag} style={style} onClick={handleClick}>
      <div style={nameStyle}>{device.nombre}</div>
      <Popover
        id={popoverId2}
        open={open2}
        anchorEl={anchorEl2}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            borderRadius: "30px",
            overflow: "hidden",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Box p={2} sx={{ width: "200px" }}>
          {Object.entries(device.interfaces).map(([key, value]) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={value.ocupada}
                  onChange={() => handlePortSelect(key)}
                  disabled={value.ocupada}
                />
              }
              label={value.nombre}
            />
          ))}
        </Box>
      </Popover>
    </div>
  );
};

export default SwitchComponent;
