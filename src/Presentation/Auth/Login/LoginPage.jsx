import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Button,
    TextField,
    InputAdornment,
    CircularProgress,
    Alert,
    Grid,
    Box,
    Typography,
    Paper
} from "@mui/material";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CheckIcon from "@mui/icons-material/Check";
import LoginViewModel from "./LoginViewModel";
import themeColors from "../../../Assets/Colors/AppColors";
import loginImage from "../../../Assets/Images/loginBackground.png";
import loginBackgroundCover from "../../../Assets/Images/loginBackgroundCover.jpg";

const LoginPage = () => {
    const [codigo, setCodigo] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const navigate = useNavigate();
    const viewModel = new LoginViewModel();

    useEffect(() => {
        if (localStorage.getItem("USER_ID")) {
            navigate("/");
        }
    }, [navigate]);

    const handleLogin = async () => {
        // setLoginLoading(true);
        // const success = await viewModel.doLogin(codigo, password);
        // setLoginLoading(false);

        // if (success) {
        navigate("/");
        // } else {
        //     setLoginError(true);
        // }
    };

    return (
        <Grid
            container
            sx={{
                height: "100vh",
                backgroundImage: `url(${loginBackgroundCover})`,
                // backgroundSize: "cover",
                backgroundColor: themeColors.secondary,
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

            }}
        >

            <Grid container item xs={10} md={11} lg={7} elevation={6}

                component={Paper}
                sx=
                {{
                    borderRadius: 5, overflow: "hidden",
                    backgroundColor: themeColors.white
                }}
            >
                <Grid item
                    xs={12} md={6} lg={6}
                    sx={{
                        backgroundColor: themeColors.white,
                        borderRadius: 5,
                        p: 4,
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
                        Iniciar Sesión
                    </Typography>
                    <Box component="form" sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
                        <TextField
                            fullWidth
                            label="Código"
                            variant="outlined"
                            margin="normal"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            InputProps={{
                                // startAdornment: (
                                //     <InputAdornment position="start">
                                //         <ContactMailIcon />
                                //     </InputAdornment>
                                // ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Contraseña"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                // startAdornment: (
                                //     <InputAdornment position="start">
                                //         <LockOpenIcon />
                                //     </InputAdornment>
                                // ),
                            }}
                        />

                        {loginLoading ? (
                            <Box sx={{ textAlign: "center", mt: 2 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <Button
                                    fullWidth
                                    variant="text"
                                    sx={{ mt: 1, color: themeColors.primary, fontSize: 12 }}
                                    onClick={() => navigate("/recuperar-password")}
                                >
                                    ¿Olvidaste tu contraseña?
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        mt: 2,
                                        backgroundColor: themeColors.primary,
                                        borderRadius: "5px",
                                        "&:hover": { backgroundColor: themeColors.secondary } // Efecto hover
                                    }}
                                    onClick={handleLogin}
                                >
                                    Comencemos
                                </Button>

                            </>
                        )}

                        {loginError && (
                            <Alert
                                icon={<CheckIcon fontSize="inherit" />}
                                severity="error"
                                sx={{ mt: 2 }}
                            >
                                Error en el login.
                            </Alert>
                        )}
                    </Box>
                </Grid>

                {/* Registro */}
                {/* <Grid item xs={12} md={5} sx={{
                    p: 4,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: "bold",
                            mb: 2,
                            color: themeColors.primary
                        }}
                    >
                        Bienvenido a NetSketch
                    </Typography>

                    <Typography variant="body1"
                        sx={{
                            mb: 3,
                            color: themeColors.primary
                        }}
                    >
                        Si aún no tienes una cuenta, por favor regístrate aquí.
                    </Typography>
                    <Button
                        component={Link}
                        to="/registro"
                        variant="outlined"
                        fullWidth
                        sx={{
                            borderRadius: "18px",
                            borderColor: themeColors.primary,
                            color: themeColors.primary
                        }}
                    >
                        Registrarse
                    </Button>
                </Grid> */}
                <Grid
                    item
                    xs={12} md={6} lg={6}
                    sx={{
                        backgroundImage: `url(${loginImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}>

                </Grid>

            </Grid>
        </Grid >
    );
};

export default LoginPage;
