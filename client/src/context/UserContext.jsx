import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserList, getUserProfile, getCounters, getUserProfileCounters, updateUser, uploadAvatar, deleteUser } from '../helpers/user';

// Crear el contexto
export const UserContext = createContext();

// Hook personalizado para usar el contexto
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}

// Crear el proveedor del contexto
export const UserProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [avatars, setAvatars] = useState('user.png');
    const [list, setList] = useState(null);
    const [errors, setErrors] = useState([]);

    const [publicationsCounter, setPublicationsCounter] = useState(0);
    const [followerCounter, setFollowerCounter] = useState(0);
    const [followingCounter, setFollowingCounter] = useState(0);

    const [userProfileCounter, setUserProfileCounter] = useState(null);

    const fetchUpdateUser = async (user) => {
        try {
            const res = await updateUser(user);
        } catch (error) {
            if (error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors([error.response.data.message]);
            }
        }
    }

    const fetchUpdateAvatar = async (avatar) => {
        try {
            const res = await uploadAvatar(avatar);
        } catch (error) {
            if (error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors([error.response.data.message]);
            }
        }
    }

    // Función para obtener detalles del usuario
    const fetchUserProfile = async (nick) => {
        try {
            const res = await getUserProfile(nick);
            setProfile(res.data);
        } catch (error) {
            console.error("Error fetching profile details:", error);
        }
    };

    const fetchUserList = async (page = 1) => {
        try {
            const res = await getUserList(page);
            setList(res.data);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const fetchCounters = async (userId) => {
        try {
            const res = await getCounters(userId);
            setFollowerCounter(res.data.followed);
            setFollowingCounter(res.data.following);
            setPublicationsCounter(res.data.publications);
        } catch (error) {
            console.error("Error fetching counter of user:", error);
        }
    };

    const fetchUserProfileCounters = async (userId) => {
        try {
            const res = await getUserProfileCounters(userId);
            setUserProfileCounter(res.data);
        } catch (error) {
            console.error("Error fetching counter of user:", error);
        }
    };

    const fetchAvatars = async (file) => {
        try {
            const avatarUrl = `http://localhost:4000/api/user/avatar/${file}`;
            setAvatars((prevAvatars) => ({
                ...prevAvatars,
                [file]: avatarUrl,
            }));
        } catch (error) {
            console.error("Error fetching avatar:", error);
        }
    };

    const fetchDeleteUser = async () => {
        try {
            const res = await deleteUser();
        } catch (error) {
            console.error("Error to delete user: ", error);
        }
    }

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => { setErrors([]) }, 5000);
            return () => clearTimeout(timer)
        }
    }, [errors]);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <UserContext.Provider value={{
            profile,
            avatars,
            list,
            publicationsCounter,
            followerCounter,
            followingCounter,
            fetchUserProfile,
            fetchUserList,
            fetchCounters,
            fetchAvatars,
            fetchUserProfileCounters,
            fetchUpdateUser,
            fetchUpdateAvatar,
            fetchDeleteUser,
            errors,
            userProfileCounter,
            loading
        }}>
            {children}
        </UserContext.Provider>
    );
};
