import { useState, useEffect } from "react";
import {
    Grid, Button, Typography, IconButton, Box, Avatar, Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import AppColors from "../../Assets/Colors/AppColors";

const Dashboard = () => {
    const [networks, setNetworks] = useState([]);
    const navigate = useNavigate();
    const user = { name: "Kohji", lastName: "Onaja", email: "kohji.onaja@example.com" };

    useEffect(() => {
        setNetworks([
            { id: 1, name: "Red Hogar", date: "2024-02-20" },
            { id: 2, name: "Oficina Principal", date: "2024-02-21" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
            { id: 3, name: "Data Center", date: "2024-02-22" },
        ]);
    }, []);

    const handleDelete = (id) => {
        const updatedNetworks = networks.filter(network => network.id !== id);
        setNetworks(updatedNetworks);
        localStorage.setItem("diagrams", JSON.stringify(updatedNetworks));
    };

    return (
        <Grid container sx={{ height: "100vh", p: 3, backgroundColor: AppColors.background }}>

            {/* Panel de usuario */}
            <Grid item xs={12} md={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
                <Paper sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4, borderRadius: 2 }}>
                    <Avatar sx={{ width: 80, height: 80, mb: 2, backgroundColor: AppColors.backgroundSecondary }}>
                        {user.name.charAt(0)}{user.lastName.charAt(0)}
                    </Avatar>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{user.email}</Typography>
                </Paper>
            </Grid>

            {/* Sección de diagramas */}
            <Grid item xs={12} md={9} sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h4">Mis Redes</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/create")}>
                        Crear Nuevo
                    </Button>
                </Box>
                <Paper
                    sx={{
                        maxHeight: "70vh",
                        overflowY: "auto",
                        backgroundColor: AppColors.backgroundSecondary,
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <Grid
                        container
                        spacing={3}
                        sx={{ width: "90%", display: "flex", justifyContent: "center", m: 3 }}
                    >
                        {networks.length > 0 ? (
                            networks.map(network => (
                                <Grid
                                    item
                                    xs={12}
                                    component={Paper}
                                    key={network.id}
                                    sx={{
                                        p: 3,
                                        m: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>{network.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">{network.date}</Typography>
                                    <IconButton onClick={() => navigate(`/edit/${network.id}`)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(network.id)} sx={{ color: AppColors.red }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            ))
                        ) : (
                            <Grid
                                item
                                xs={12}
                                component={Paper}
                                sx={{
                                    p: 3,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 2
                                }}
                            >
                                <Typography>No hay redes creadas aún.</Typography>
                            </Grid>
                        )}
                    </Grid>
                </Paper>

            </Grid>
        </Grid>
    );
};

export default Dashboard;
