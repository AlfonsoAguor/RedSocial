import React, { createContext, useState, useEffect, useContext } from 'react';
import { getPublicationsUser, deletePublication, getFeed, savePublication, uploadImage } from '../helpers/publication';

// Crear el contexto
export const PublicationContext = createContext();

// Hook personalizado para usar el contexto
export const usePublication = () => {
    const context = useContext(PublicationContext);
    if (!context) {
        throw new Error("usePublication must be used within a PublicationProvider");
    }
    return context;
}

export const PublicationProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [publications, setPublications] = useState([]);
    const [dataPublication, setDataPublication] = useState([]);
    const [dataFeed, setDataFeed] = useState([]);
    const [image, setImage] = useState(null);
    const [ publicationChanged, setPublicationChanged] = useState(true);

    const fetchNewPublication = async(publicationData) => {
        try {
            setPublicationChanged(false);
            const res = await savePublication(publicationData);
            setDataPublication(res.data);
            setPublicationChanged(true);
            return res.data;
        } catch (error) {
            console.error("Error al crear la publicación:", error);
        }
    }

    const fetchPublicationsUser = async (userId, page = 1) => {
        try {
            const res = await getPublicationsUser(userId, page);
            const newPublications = res.data.publications;
    
            if (page === 1) {
                setPublications(newPublications);
            } else {
                setPublications(prevPublications => ({
                    ...newPublications,
                    docs: [...prevPublications.docs, ...newPublications.docs]
                }));
            }
        } catch (error) {
            console.error("Error fetching publications:", error);
        }
    };
    

    const fetchImage = async (file) => {
        try {
            const imageUrl = `http://localhost:4000/api/publication/image/${file}`;
            setImage((prevImage) => ({
                ...prevImage,
                [file]: imageUrl
            }));
        } catch (error) {
            console.error("Error fetching image of publication:", error);
        }
    }

    const fetchDeletePublication = async (id) => {
        try {
            setPublicationChanged(false);
            const res = await deletePublication(id);
            setPublicationChanged(true);
        } catch (error) {
            console.error("Error delete of publication:", error);
        }
    }

    const fetchFeed = async (page = 1) => {
        try {
            const res = await getFeed(page);
            const newPublications = res.data.publications;

            if(page === 1) {
                setDataFeed(newPublications);
            } else {
                setDataFeed(prevDataFeed => ({
                    ...newPublications,
                    docs: [...prevDataFeed.docs, ...newPublications.docs]
                }))
            }
        } catch (error) {
            console.error("Error fetching feed:", error);
        }
    }

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <PublicationContext.Provider value={{
            fetchPublicationsUser,
            publications,
            fetchImage,
            image,
            fetchDeletePublication,
            publicationChanged,
            fetchFeed,
            dataFeed,
            fetchNewPublication,
            dataPublication,
            uploadImage,
            loading
        }}>
            {children}
        </PublicationContext.Provider>
    );
};