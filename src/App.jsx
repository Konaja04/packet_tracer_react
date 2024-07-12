import React, { useState } from "react";
import DeviceList from "./components/DeviceList";
import Canvas from "./components/Canvas";
import { Box, Button, Typography } from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CableIcon from "@mui/icons-material/Cable";

function App() {
  const [cableMode, setCableMode] = useState(false);

  const toggleCableMode = () => {
    setCableMode(!cableMode);
  };

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
              borderRadius: "25px",
              cursor: "pointer",
              color: "black",
              "&:hover": {
                backgroundColor: "#85B688",
              },
              textTransform: "none",
              marginRight: "20px",
            }}
          >
            <PlayArrowIcon />
          </Button>
        </Box>
      </Box>

      <Canvas cableMode={cableMode} />

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
              borderRadius: "25px",
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
    </Box>
  );
}

export default App;
