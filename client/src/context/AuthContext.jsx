import { createContext, useState, useContext, useEffect } from "react";
import Cookies from 'js-cookie';

//Importamos los metodos para poder hacer las request de autenticacion 
import { registerRequest, loginRequest, verifyTokenRequest } from "../helpers/auth";

/* Creamos el contexto */
export const AuthContext = createContext();

/* Creamos el hook personalizado */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

/* Creamos el Provider que nos permitiria hacer las acciones del usuario */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [avatar, setAvatar] = useState('user.png');
    const [defaultAvatar, setDefaultAvatar] = useState(false);
    const [errors, setErrors] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const signup = async (userData) => {
        try {
            const res = await registerRequest(userData);
            setUser(res.data.user);
            setIsAuthenticated(true);
        } catch (error) {
            if(error.response.data.errors){
                setErrors(error.response.data.errors);
            } else {
                console.log()
                setErrors([error.response.data.message]);
            }
        }
    };

    const signin = async (userData) => {
        try {
            const res = await loginRequest(userData);
            setUser(res.data.user);
            setIsAuthenticated(true);
            setErrors([]);
        } catch (error) {
            console.log(error);
            if(error.response.data.errors){
                setErrors(error.response.data.errors);
            } else {
                console.log()
                setErrors([error.response.data.message]);
            }
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
        setUser(null);
    };

    /* Este efecto es para que los errores se muestren unicamente durante el tiempo*/
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => { setErrors([]) }, 5000);
            return () => clearTimeout(timer)
        }
    }, [errors]);

    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get();

            //Si no tiene esa cookie, le indicamos que no esta autenticado y retornamos el usuario vacio
            if (!cookies.token) {
                setIsAuthenticated(false);
                setLoading(false);
                return setUser(null);
            }

            try {
                //Si tiene la cookie, guardara el resultado de la funcion verify del backend en una respuesta.
                const res = await verifyTokenRequest(cookies.token);

                //Si no recibe los datos le indicamos que no esta autorizado y el loading en false
                if (!res.data) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                } else {
                    //Si esta autorizado, le inidicamos que si esta autorizado, le pasamos los datos del usuario y el loading en false
                    setIsAuthenticated(true);
                    setUser(res.data);
                    setLoading(false);
                }
            } catch (error) {
                //Si se ha producido cualquier tipo de error, no estara autorizado
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
            }
        }

        checkLogin();
    }, []);

    /* 
    En este useEffect recibiremos isAuthenticated y user.
    Cuando isAuthenticated sea true, user tenga informacion y user.image sea diferente a user.png
    generamos la URL para obtener el avatar
    */
    useEffect(() => {
        async function getAvatar (){
            try {
                if (isAuthenticated && user && user.image !== "user.png"){
                    const file = user.image;
                    const avatarUrl = `http://localhost:4000/api/user/avatar/${file}`;
                    setAvatar(avatarUrl);
                    setDefaultAvatar(true);
                } else {
                    setAvatar('user.png');
                    setDefaultAvatar(false);
                }
            } catch (error) {
                console.error("Error fetching avatar:", error);
            }
        };

        getAvatar();
    }, [isAuthenticated, user]);

    return (
        <AuthContext.Provider value={{ 
            signup, 
            signin, 
            logout, 
            isAuthenticated, 
            loading, 
            user, 
            errors,
            avatar,
            defaultAvatar
            }}>
            {children}
        </AuthContext.Provider>
    );
}