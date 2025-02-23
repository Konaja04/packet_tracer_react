import React from 'react';
import { createHashRouter, Route, RouterProvider } from 'react-router-dom';
import NetworkView from './Presentation/NetworkView/NetworkView';
import LoginPage from './Presentation/Auth/Login/LoginPage';
import RegisterPage from './Presentation/Auth/Register/RegisterPage';
import DashboardPage from './Presentation/Home/Dashboard';
const router = createHashRouter([
    // { path: "/", element: <NetworkView /> },
    { path: "/", element: <DashboardPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/login", element: <LoginPage /> },
]);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;