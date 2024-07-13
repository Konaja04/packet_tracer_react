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
                    RESULTADOS
                </Typography>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Algoritmos</TableCell>
                            <TableCell colSpan={2} align="center">
                                Dijkstra
                            </TableCell>
                            <TableCell colSpan={2} align="center">
                                Bellman Ford
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Tiempo</TableCell>
                            {/* <TableCell>Iteraciones</TableCell> */}
                            <TableCell>Tiempo</TableCell>
                            {/* <TableCell>Iteraciones</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.dijkstra && data.dijkstra.times &&
                            Object.entries(data.dijkstra.times).map(([key, time]) => (
                                <TableRow key={key}>
                                    <TableCell>{key}</TableCell>
                                    <TableCell align="center">{time}</TableCell>
                                    {/* <TableCell align="center">{time}</TableCell> */}
                                    <TableCell align="center">{time * 1.4}</TableCell>
                                </TableRow>
                            ))}

                    </TableBody>
                </Table>
            </Box>
        </Popover>
    );
}

export default ComparativeTablePopover;
