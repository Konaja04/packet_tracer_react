// CLIComponent.js

import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Paper, Typography } from "@mui/material";
import "./Terminal.css";

const TerminalComponent = ({ device }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const terminalOutputRef = useRef(null);
  const [inputState, setInputState] = useState(true);
  const [enableState, setEnableState] = useState(false);
  const [configState, setConfigState] = useState(false);
  const [interfaceState, setInterfaceState] = useState(false);
  const [selectedInterface, setSelectedInterface] = useState("");

  const insertErrorCommand = (newMessages, input) => {
    newMessages.push({
      user: ``,
      text: `No se reconoce el comando ${input}`,
    });
  };
  const handleInterfaceOptions = (newMessages, input) => {
    newMessages.push({
      user: `${device.nombre}(config-if)#`,
      text: `${input}`,
    });

    if (input.startsWith("ip address ")) {
      const splited = input.split(' ');
      if (splited.length === 4) {
        const ip = splited[2];
        const mascara = splited[3];
        device.configurarInterface(selectedInterface, ip, mascara);
      } else {
        insertErrorCommand(newMessages, input);
      }
    } else {
      insertErrorCommand(newMessages, input);
    }
  };


  const handleConfigOptions = (newMessages, input) => {
    newMessages.push({
      user: `${device.nombre}(config)#`,
      text: `${input}`,
    });

    if (input.startsWith("ip route")) {
      const parts = input.split(" ");
      if (parts.length === 5) {
        const [_, route, destination, subnetMask, nextHop] = parts;
        device.agregarRutaEstatica(destination, subnetMask, nextHop);
        newMessages.push({
          user: `${device.nombre}(config)#`,
          text: `Ruta añadida: Destino=${destination}, Subred=${subnetMask}, Vía=${nextHop}`,
        });
      } else {
        insertErrorCommand(newMessages, input);
      }
    } else if (input.startsWith("interface")) {
      const [_, interfaceName] = input.split(" ");
      let newInterfaceName = ""
      if (interfaceName.startsWith("giga")) {
        newInterfaceName = `GigabitEthernet${interfaceName.slice(15)}`
      } else {
        newInterfaceName = `FastEthernet${interfaceName.slice(12)}`
      }
      if (device.interfaces[newInterfaceName] !== null) {
        setInterfaceState(true);
        setSelectedInterface(newInterfaceName);
      } else {
        insertErrorCommand(newMessages, input);

      }
    } else {
      insertErrorCommand(newMessages, input);
    }
  };

  const handleEnableOptions = (newMessages, input) => {
    newMessages.push({
      user: `${device.nombre}# `,
      text: `${input}`,
    });
    if (input === "configure terminal" || input === "conf t") {
      setConfigState(true);
    } else {
      insertErrorCommand(newMessages, input);
    }
  };

  const handleDefaultOptions = (newMessages, input) => {
    newMessages.push({
      user: `${device.nombre}>`,
      text: `${input}`,
    });

    if (input === "en") {
      setEnableState(true);
    } else if (input === "dd") {
      const routingTable = device.calcularRutasOptimasDijkstra() ;
      const formattedTable = JSON.stringify(routingTable, null, 2);
      newMessages.push({
        user: `${device.nombre}>`,
        text: `Tabla de enrutamiento calculada con Dijkstra:\n${formattedTable}`,
      });
    } else {
      insertErrorCommand(newMessages, input);
    }
  };

  const handleSend = () => {
    setInputState(false);
    const localInput = input.trim().toLowerCase(); // Convertir el input a minúsculas
    if (localInput !== "") {
      setMessages((prevMessages) => {
        let newMessages = [...prevMessages];
        if (enableState) {
          if (configState) {
            if (interfaceState) {
              handleInterfaceOptions(newMessages, localInput);
            } else {
              handleConfigOptions(newMessages, localInput);
            }
          } else {
            handleEnableOptions(newMessages, localInput);
          }
        } else {
          handleDefaultOptions(newMessages, localInput);
        }
        setInput("");
        return newMessages;
      });
    }
    setInputState(true);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop =
        terminalOutputRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Paper className="terminal-container">
      <Box className="terminal-output" ref={terminalOutputRef}>
        {messages.map((message, index) => (
          <Typography key={index} className="terminal-message">
            {`${message.user} ${message.text}`}
          </Typography>
        ))}
        {inputState && (
          <Box className="terminal-input-container">
            {enableState
              ? configState
                ? interfaceState ? `${device.nombre}(config-if)#` : `${device.nombre}(config)#`
                : `${device.nombre}#`
              : `${device.nombre}>`}
            <TextField
              className="terminal-input"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              InputProps={{
                style: {
                  color: "white",
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TerminalComponent;