import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCheck = ({ children }) => {
    const { loading, isAuthenticated, checkLogin } = useAuth();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Verificamos la autenticacions
        const verifyAuth = async () => {
            await checkLogin();  
            setIsReady(true);
        };
        verifyAuth();
    }, [checkLogin]);

    if (loading) {
        return <h1>Loading...</h1>; 
    }

    if (isReady && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (isReady && isAuthenticated) {
        return children;
    }

    // Si no está listo, no renderiza nada
    return null;  
};

export default AuthCheck;
