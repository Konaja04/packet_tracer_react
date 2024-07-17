import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import {
  Popover,
  Box,
  TextField,
  Button,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import "./Canvas.css";
import CloseIcon from "@mui/icons-material/Close";
import CLIComponent from "../cmd/CliComponent";

const PCComponent = ({
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

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [selectedForm, setSelectedForm] = useState("desktop");
  const [selectedButton, setSelectedButton] = useState(null);
  const [popoverSize, setPopoverSize] = useState({
    width: 400,
    height: "auto",
  });

  const handleClick = (event) => {
    if (!cableMode) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl2(event.currentTarget);
    }
  };

  const handleFormChange = (form) => {
    setSelectedForm(form);
    setSelectedButton(form);
    if (form === "cli") {
      setPopoverSize({ width: 600, height: 400 }); // Tamaño más grande para CLI
    } else {
      setPopoverSize({ width: 400, height: "auto" }); // Tamaño predeterminado
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
    setAnchorEl2(null);
  };

  const getButtonStyle = (buttonType) => ({
    backgroundColor: selectedButton === buttonType ? "black" : "white",
    color: selectedButton === buttonType ? "white" : "black",
    border: "1px solid black",
    borderRadius: "25px",
    textTransform: "none",
    marginRight:
      buttonType === "routing"
        ? "30px"
        : buttonType === "interface"
          ? "30px"
          : "0",
    width: "100px",
  });

  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);
  const popoverId = open ? `popover-${id}` : undefined;
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

  const [textIP, setTextIP] = useState("");
  const [textMascara, setTextMascara] = useState("");
  const [textGateway, setTextGateway] = useState("");
  const handleIpAddressChange = (event) => {
    setTextIP(event.target.value);
  };

  const handleSubnetMaskChange = (event) => {
    setTextMascara(event.target.value);
  };

  const handleDefaultGatewayChange = (event) => {
    setTextGateway(event.target.value);
  };

  useEffect(() => {
    if (textMascara !== "") {
      device.setMascara(textMascara);
    }
  }, [textMascara]);

  useEffect(() => {
    if (textIP !== "") {
      device.setIp(textIP);
    }
  }, [textIP]);

  useEffect(() => {
    if (textGateway !== "") {
      device.setGateway(textGateway);
    }
  }, [textGateway]);

  useEffect(() => {
    setTextIP(
      device.interfaces["FastEthernet0/1"].ip === null
        ? ""
        : device.interfaces["FastEthernet0/1"].ip
    );
    setTextMascara(
      device.interfaces["FastEthernet0/1"].mascara === null
        ? ""
        : device.interfaces["FastEthernet0/1"].mascara
    );
    setTextGateway(
      device.interfaces["FastEthernet0/1"].gateway === null
        ? ""
        : device.interfaces["FastEthernet0/1"].gateway
    );
  }, []);

  return (
    <div ref={drag} style={style} onClick={handleClick}>
      <div style={nameStyle}>{device.nombre}</div>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
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
            width: popoverSize.width,
            height: popoverSize.height,
          },
        }}
      >
        <Box p={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{ marginBottom: "20px" }}
          >
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Button
            onClick={() => handleFormChange("desktop")}
            sx={getButtonStyle("interface")}
          >
            Interface
          </Button>
          <Button
            onClick={() => handleFormChange("cli")}
            sx={getButtonStyle("cli")}
          >
            CLI
          </Button>
          {selectedForm === "desktop" && (
            <Box>
              <TextField
                label="IPv4 Address"
                fullWidth
                sx={{ marginBottom: "20px", borderRadius: "20px" }}
                onChange={(e) => {
                  handleIpAddressChange(e);
                }}
                value={textIP}
              />
              <TextField
                label="Subnet Mask"
                fullWidth
                sx={{ marginBottom: "20px", borderRadius: "20px" }}
                onChange={(e) => {
                  handleSubnetMaskChange(e);
                }}
                value={textMascara}
              />
              <TextField
                label="Default Gateway"
                fullWidth
                sx={{ marginBottom: "20px", borderRadius: "20px" }}
                onChange={(e) => {
                  handleDefaultGatewayChange(e);
                }}
                value={textGateway}
              />
            </Box>
          )}
          {selectedForm === "cli" && <CLIComponent device={device} />}
        </Box>
      </Popover>

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

export default PCComponent;
