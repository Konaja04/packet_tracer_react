import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { Grid, InputAdornment } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonIcon from '@mui/icons-material/Person';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ImageIcon from '@mui/icons-material/Image';

const RegisterPage = () => {

    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        codigo: '',
        correo: '',
        password: '',
        confirmed_password: '',
        img: ''
    });
    const [passwordsMatch, setPasswordsMatch] = useState(true); // Estado para verificar si las contraseñas coinciden
    const [registrationError, setRegistrationError] = useState(false); // Estado para error de registro
    const [registrationError2, setRegistrationError2] = useState(false); // Estado para error de formato de codgio
    const [registrationErrorBack, setRegistrationErrorBack] = useState(false); // Estado para error de formato de codgio
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmed_password) {
            setPasswordsMatch(false);
            return;
        }

        if (formData.codigo.length !== 8 || isNaN(formData.codigo)) {
            console.log(formData.codigo.length)
            setRegistrationError(true);
            return;
        }

        const correoPattern = /^[a-zA-Z0-9._%+-]+@aloe.ulima.edu.pe$/;
        if (!correoPattern.test(formData.correo)) {
            setRegistrationError2(true);
            return; 
        }

        await registrarUsuario();
    };

    const registrarUsuario = async () => {
        try {

        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
        }
    };
    return (

        <div className='container-fluid vertical-center-container register-page' style={{ backgroundColor: '#f8ccb4' }}>
            <div className='col-md-12 d-flex flex-column align-items-center justify-content-center vh-100'>

                <div className='row w-50 justify-content-center'  >
                    <div className='col-md-8 formulario-registro'>
                        <h4 className='titulo-login'>Bienvenido a salas de cine ULIMA</h4>
                        <p className='descripcion-login'>Para unirte a nuestra comunidad por favor Inicia Sesión con tus datos.</p>
                        <div className="form-group">
                            <div className="text-center" style={{ fontSize: '14px', marginTop: '10px' }}>
                                ¿Ya se encuentra registrado? <Link to={"/"}>Log in</Link>
                            </div>
                        </div>

                    </div>


                    <div className='col-md-8 formulario-login'>
                        <h4 className='titulo-register '>Crear una Cuenta</h4>

                        <form className='form-register' onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        id="nombre"
                                        label="Nombre"
                                        name="nombre"
                                        autoComplete="nombre"
                                        autoFocus
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        id="apellidos"
                                        label="Apellidos"
                                        name="apellidos"
                                        autoComplete="apellidos"
                                        value={formData.apellidos}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        id="codigo"
                                        label="Código"
                                        name="codigo"
                                        autoComplete="codigo"
                                        value={formData.codigo}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ContactMailIcon />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        id="correo"
                                        label="Correo"
                                        name="correo"
                                        autoComplete="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MailOutlineIcon />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        id="password"
                                        label="Contraseña"
                                        name="password"
                                        autoComplete="new-password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOpenIcon />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        id="confirmed_password"
                                        label="Confirmar Contraseña"
                                        name="confirmed_password"
                                        autoComplete="new-password"
                                        type="password"
                                        value={formData.confirmed_password}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOpenIcon />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="img"
                                        label="Imagen URL"
                                        name="img"
                                        autoComplete="img"
                                        value={formData.img}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ImageIcon />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            {/* Alerta si contraseñas no coinciden */}
                            {!passwordsMatch && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    Las contraseñas no coinciden.
                                </Alert>
                            )}
                            {/* Alerta si hay error de código */}
                            {registrationError && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    Verifique que el código tenga exactamente 8 dígitos.
                                </Alert>
                            )}
                            {/* Alerta si hay un error de correo */}
                            {registrationError2 && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    Verifique que el correo tenga el formato 'codigo@aloe.ulima.edu.pe'
                                </Alert>
                            )}
                            {registrationErrorBack && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    Ya existe una cuenta registrada a esa direccion de correo y código
                                </Alert>
                            )}
                            <Button type="submit" variant="contained" style={{ marginTop: "30px", backgroundColor: '#FA7525', color: 'white', borderRadius: "18px" }}
                            >
                                Registrarse
                            </Button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
