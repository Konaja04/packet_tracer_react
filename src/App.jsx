import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import DeviceList from "./components/DeviceList";
import Canvas from "./components/Canvas";
import { Box, Button, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CableIcon from "@mui/icons-material/Cable";
import UploadFileIcon from "@mui/icons-material/UploadFile"; // Importar el ícono para el botón de carga
import AddchartIcon from "@mui/icons-material/Addchart";
import ComparativeTablePopover from "./components/Resultados";

import DeleteIcon from "@mui/icons-material/Delete";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
function App() {
  const [cableMode, setCableMode] = useState(false);
  const canvasRef = useRef(null); // Agregar estado para el archivo JSON
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const toggleCableMode = () => {
    setCableMode(!cableMode);
  };

  const guardarTopo = (state = false) => {
    if (canvasRef.current) {
      canvasRef.current.guardarTopo(state);
    }
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const cargarTopo = (archivo = null) => {
    if (canvasRef.current) {
      if (archivo !== null) {
        canvasRef.current.cargarTopo(archivo);
      } else {
        canvasRef.current.cargarTopo();
      }
      guardarTopo(false);
    }
  };

  const borrarTodo = () => {
    if (canvasRef.current) {
      canvasRef.current.borrarTodo();
      navigate(0)
    }
  };

  const runDijkstra = () => {
    if (canvasRef.current) {
      const statistics = canvasRef.current.runDijkstra();
      setData(statistics);
    }
    guardarTopo(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target.result;
          cargarTopo(result);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("TOPO") !== null) {
      console.log("CARGANDO DE SESSION")
      cargarTopo();
    }
  }, []);
  useEffect(() => {
    guardarTopo()
  }, [canvasRef])
  return (
    <Box>
      <Box
        sx={{
          bgcolor: "#2c2c2c",
          height: "50px",
          width: "100%",
          position: "absolute",
          display: "flex",
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            color: "white",
            marginLeft: "20px",
          }}
        >
          <Typography
            className="manjari-regular"
            sx={{
              fontSize: "22px",
              marginRight: "20px",
            }}
          >
            Packeton
          </Typography>
          <Button
            sx={{
              backgroundColor: "#85B688",
              width: "40px",
              borderRadius: "10px",
              cursor: "pointer",
              color: "black",
              "&:hover": {
                backgroundColor: "#85B688",
              },
              textTransform: "none",
              marginRight: "20px",
            }}
            onClick={() => { runDijkstra() }}
          >
            <PlayArrowIcon />
          </Button>
          <Button
            sx={{
              backgroundColor: "#85B688",
              width: "40px",
              borderRadius: "10px",
              cursor: "pointer",
              color: "black",
              "&:hover": {
                backgroundColor: "#85B688",
              },
              textTransform: "none",
              marginRight: "20px",
            }}
            onClick={handlePopoverOpen}
          >
            <AddchartIcon />
          </Button>
          <ComparativeTablePopover
            anchorEl={anchorEl}
            handleClose={handlePopoverClose}
            data={data}
          />

        </Box>{" "}
        <Button
          sx={{
            backgroundColor: "#85B688",
            width: "40px",
            borderRadius: "10px",
            cursor: "pointer",
            color: "black",
            "&:hover": {
              backgroundColor: "#85B688",
            },
            textTransform: "none",
            marginRight: "20px",
          }}
          onClick={() => { guardarTopo(true) }}
        >
          <SaveAltIcon />
        </Button>
        <Button
          sx={{
            backgroundColor: "#85B688",
            width: "40px",
            borderRadius: "10px",
            cursor: "pointer",
            color: "black",
            "&:hover": {
              backgroundColor: "#85B688",
            },
            textTransform: "none",
            marginRight: "20px",
          }}
          component="label"
        >
          <UploadFileIcon />
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </Button>
        <Button
          sx={{
            backgroundColor: "#ab4e55",
            width: "40px",
            borderRadius: "25px",
            cursor: "pointer",
            color: "black",
            "&:hover": {
              backgroundColor: "#ab4e55",
            },
            textTransform: "none",
            marginRight: "20px",
          }}
          onClick={() => { borrarTodo() }}
        >

          <DeleteIcon />
        </Button>
      </Box>

      <Canvas ref={canvasRef} cableMode={cableMode} />

      <Box
        sx={{
          bgcolor: "#2c2c2c",
          height: "50px",
          width: "100%",
          position: "absolute",
          display: "flex",
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            color: "white",
            marginLeft: "20px",
          }}
        >
          <Button
            sx={{
              backgroundColor: cableMode ? "#BAD3B6" : "white", // Change color when active
              width: "40px",
              borderRadius: "10px",
              cursor: "pointer",
              color: "black",
              "&:hover": {
                backgroundColor: "white",
              },
              textTransform: "none",
              marginRight: "20px",
            }}
            onClick={toggleCableMode}
          >
            <CableIcon />
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", marginTop: "50px", width: "100%" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          <Box
            sx={{
              width: "40%",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              padding: "20px",
              backgroundColor: "#E9E9E9",
              borderRadius: "30px",
            }}
          >
            <DeviceList />
          </Box>
        </Box>
      </Box>
    </Box >
  );
}

export default App;
