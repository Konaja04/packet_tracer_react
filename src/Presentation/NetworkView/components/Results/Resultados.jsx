import React, { useState } from "react";
import {
    Popover,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import AddchartIcon from "@mui/icons-material/Addchart";

function ComparativeTablePopover({ anchorEl, handleClose, data }) {
    const open = Boolean(anchorEl);

    const dikstra_tiempo = [
        {
            router1: "10s",
            router2: "9s",
            router3: "2s",
            router4: "7s",
        },
    ];
    const dikstra_iteraciones = [
        {
            router1: "2",
            router2: "3",
            router3: "4",
            router4: "2",
        },
    ];
    const bellman_tiempo = [
        {
            router1: "10s",
            router2: "9s",
            router3: "2s",
            router4: "7s",
        },
    ];
    const bellman_iteraciones = [
        {
            router1: "2",
            router2: "3",
            router3: "4",
            router4: "2",
        },
    ];
    return (
        <Popover
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
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" align="center">
                    RESULTADOS DIJKSTRA
                </Typography>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Tiempo</TableCell>
                            {/* <TableCell>Iteraciones</TableCell> */}
                            <TableCell>Iteraciones</TableCell>
                            {/* <TableCell>Iteraciones</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.iteraciones && data.times &&
                            Object.entries(data.iteraciones).map(([key, option]) => (
                                <TableRow key={key}>
                                    <TableCell>{key}</TableCell>
                                    <TableCell align="center">{Math.round(data.times[key] * 100) / 100} ms</TableCell>
                                    {/* <TableCell align="center">{time}</TableCell> */}
                                    <TableCell align="center">{option}</TableCell>
                                </TableRow>
                            ))}

                    </TableBody>
                </Table>
            </Box>
        </Popover>
    );
}

export default ComparativeTablePopover;
