// CommandPrompt.js

import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Paper, Typography } from "@mui/material";
import "../terminal/Terminal.css";

const CLIComponent = ({ device }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const terminalOutputRef = useRef(null);
    const [inputState, setInputState] = useState(true);
    const [lastMessageIndex, setLastMessageIndex] = useState(messages.length - 1);

    const handleSend = () => {
        setInputState(false);
        if (input.trim() !== "") {
            setMessages((prevMessages) => {
                let newMessages = [
                    ...prevMessages,
                    { user: `user@${device.nombre} ~ % `, text: `${input}` },
                ];

                if (input.startsWith("ping ")) {
                    const targetIp = input.substring(5).trim();
                    newMessages.push({
                        user: ``,
                        text: `Pinging ${targetIp} with 32 bytes of data:`,
                    });

                    const [response, state] = device.ping(targetIp);
                    newMessages.push({
                        user: ``,
                        text: response || "No se recibió respuesta del ping.",
                    });
                } else if (input === "clear") {
                    newMessages = [];
                } else {
                    newMessages.push({
                        user: ``,
                        text: `No se reconoce el comando ${input}`,
                    });
                }

                setInput("");
                setLastMessageIndex(newMessages.length - 1);
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
        } else if (event.key === "ArrowUp") {
            if (messages.length > 0 && lastMessageIndex >= 0) {
                setInput(messages[lastMessageIndex].text);
                setLastMessageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
            }
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
                        {`${message.user}${message.text}`}
                    </Typography>
                ))}
                {inputState && (
                    <Box className="terminal-input-container">
                        {`user@${device.nombre} ~ % `}
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
export default CLIComponent;
