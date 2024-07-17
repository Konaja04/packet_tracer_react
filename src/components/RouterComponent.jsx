import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import {
  Popover,
  Box,
  TextField,
  Button,
  IconButton,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  Checkbox,
} from "@mui/material";
import "./Canvas.css";
import CloseIcon from "@mui/icons-material/Close";
import TerminalComponent from "../terminal/Terminal";
const RouterComponent = ({
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
  const [selectedForm, setSelectedForm] = useState("interface");
  const [selectedFormRouting, setSelectedFormRouting] = useState("static");
  const [selectedButton, setSelectedButton] = useState(null);
  const [showCLI, setShowCLI] = useState(false);
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
    setAnchorEl2(null);
    setShowCLI(false);
  };

  const handleFormChange = (form) => {
    setSelectedForm(form);
    setSelectedButton(form);
    if (form === "cli") {
      setShowCLI(true); // Mostrar CLI cuando se selecciona la pestaña CLI
    } else {
      setShowCLI(false); // Ocultar CLI cuando se cambia de pestaña
    }
  };

  const handleFormChangeRouting = (form) => {
    setSelectedFormRouting(form);
  };

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
  const [selectedInterface, setSelectedInterface] =
    useState("GigabitEthernet0/0");
  const [textIP, setTextIP] = useState("");
  const [textMascara, setTextMascara] = useState("");
  const handleIpAddressChange = (event) => {
    setTextIP(event.target.value);
  };

  const handleSubnetMaskChange = (event) => {
    setTextMascara(event.target.value);
  };
  useEffect(() => {
    if (textMascara !== "") {
      device.configurarInterface(
        selectedInterface,
        device.interfaces[selectedInterface].ip,
        textMascara
      );
    }
  }, [textMascara]);
  useEffect(() => {
    if (textIP !== "") {
      device.configurarInterface(
        selectedInterface,
        textIP,
        device.interfaces[selectedInterface].mascara
      );
    }
  }, [textIP]);
  useEffect(() => {
    setTextIP(
      device.interfaces[selectedInterface].ip === null
        ? ""
        : device.interfaces[selectedInterface].ip
    );
    setTextMascara(
      device.interfaces[selectedInterface].mascara === null
        ? ""
        : device.interfaces[selectedInterface].mascara
    );
  }, [selectedInterface]);
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
          },
        }}
      >
        <Box
          p={2}
          sx={{
            width: "600px",
            height: "auto",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{ marginBottom: "20px" }}
          >
            <Button
              onClick={() => handleFormChange("interface")}
              sx={getButtonStyle("interface")}
            >
              Interface
            </Button>
            {type === "router" && (
              <Button
                onClick={() => handleFormChange("routing")}
                sx={getButtonStyle("routing")}
              >
                Routing
              </Button>
            )}
            <Button
              onClick={() => handleFormChange("cli")}
              sx={getButtonStyle("cli")}
            >
              CLI
            </Button>
            <Button onClick={handleClose}>
              <CloseIcon />
            </Button>
          </Box>
          {selectedForm === "interface" && (
            <Box sx={{ height: "304px" }}>
              <TextField
                label="Interface"
                fullWidth
                sx={{ marginBottom: "20px", borderRadius: "20px" }}
                select
                onChange={(e) => {
                  setSelectedInterface(e.target.value);
                }}
                value={selectedInterface}
              >
                {Object.entries(device.interfaces).map(([key, option]) => (
                  <MenuItem key={option.nombre} value={key}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="IPv4 Address"
                fullWidth
                sx={{ marginBottom: "20px", borderRadius: "20px" }}
                disabled={selectedInterface === null}
                value={textIP}
                onChange={(e) => {
                  handleIpAddressChange(e);
                }}
              />

              <TextField
                label="Subnet Mask"
                fullWidth
                sx={{ marginBottom: "20px", borderRadius: "20px" }}
                disabled={selectedInterface === null}
                value={textMascara}
                onChange={(e) => {
                  handleSubnetMaskChange(e);
                }}
              />
            </Box>
          )}
          {selectedForm === "routing" && (
            <Box sx={{ height: "304px" }}>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                sx={{ marginBottom: "5px" }}
                value={selectedFormRouting}
              >
                <FormControlLabel
                  value="static"
                  control={<Radio />}
                  label="Static"
                  onClick={() => handleFormChangeRouting("static")}
                />
              </RadioGroup>

              <Box
                sx={{
                  marginBottom: "20px",
                  borderRadius: "20px",
                  border: "1px solid #ccc",
                  height: "220px",
                }}
              >
                <Box
                  sx={{
                    borderBottom: "1px solid #ccc",
                    height: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography>Network Address </Typography>
                </Box>
                {selectedFormRouting === "static" && (
                  <Box>
                    {Object.entries(device.routingTable).map(([key, value]) => [
                      <Box
                        sx={{
                          borderBottom: "1px solid #ccc",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography sx={{ marginLeft: "10px" }}>
                          {`${key} ${value.mascara} via ${value.nextHop}`}
                        </Typography>
                      </Box>
                    ])}
                  </Box>
                )}
              </Box>
            </Box>
          )}
          {selectedForm === "cli" && <TerminalComponent device={device} />}
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

export default RouterComponent;
