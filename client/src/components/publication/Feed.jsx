import React, { useEffect, useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import avatarDefault from '../../assets/img/user.png';

import { useAuth } from '../../context/AuthContext';
import { usePublication } from '../../context/PublicationContext';
import { useUser } from '../../context/UserContext';

export const Feed = () => {
    const { user } = useAuth();
    const { fetchAvatars, avatars } = useUser();
    const { fetchFeed, dataFeed, fetchImage, image } = usePublication();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [dataChanged, setDataChanged] = useState(false);
    const observerRef = useRef();

    useEffect(() => {
        const loadFeed = async () => {
            setLoading(true);
            await fetchFeed(currentPage);
            setLoading(false);
            setDataChanged(false);
        };
        loadFeed();
    }, [dataChanged, currentPage]);

    useEffect(() => {
        if (dataFeed.docs) {
            setTotalPages(dataFeed.totalPages);

            dataFeed.docs.forEach((publication) => {
                const avatarImage = publication.user.image;
                if (avatarImage !== 'user.png' && !avatars[avatarImage]) {
                    fetchAvatars(avatarImage);
                }
            });

            dataFeed.docs.forEach(publication => {
                if (publication.file) {
                    const imagePublication = publication.file;
                    fetchImage(imagePublication);
                }
            });
        }
    }, [dataFeed, avatars, fetchAvatars]);

    const handleLoadMore = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    // Hook de IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && currentPage < totalPages) {
                // Cargar más publicaciones cuando el div es visible
                handleLoadMore(); 
            }
        }, {
            root: null, // Usa el viewport del navegador como root
            rootMargin: '0px',
            threshold: 1.0 // Indica que debe estar visible al 100% para que activar la funcion
        });

        // Indica que observe el el div
        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            // Indica que deje de observar el el div
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [observerRef.current, currentPage, totalPages]);

    const formatDate = (date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
    };

    if (loading || !dataFeed) {
        return <div className='default_message'>Cargando</div>;
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button onClick={() => setDataChanged(true)} className="content__button">Mostrar nuevas</button>
            </header>
    
            <div className="content__posts">
                {dataFeed.docs.length === 0 ? (
                    <h2 className='nothing'>No hay publicaciones</h2>
                ) : (
                    dataFeed.docs.map(publication => (
                        <div className="posts__post" key={publication._id}>
                            <div className="post__container">
                                <div className="post__image-user">
                                    <Link to={`/social/profile/${publication.user.nick}`} className="post__image-link">
                                        <img src={avatars[publication.user.image] || avatarDefault} className="post__user-image" alt="Foto de perfil" />
                                    </Link>
                                </div>
    
                                <div className="post__body">
                                    <div className="post__user-info">
                                        <a href="#" className="user-info__name">{publication.user.nick}</a>
                                        <span className="user-info__divider"> | </span>
                                        <a className="user-info__create-date">{formatDate(publication.create_at)}</a>
                                    </div>
                                    <h4 className="post__content">{publication.text}</h4>
                                </div>
                            </div>
                            {image && (
                                <div className='post__image'>
                                    <img src={image[publication.file]} alt={publication.file} />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Elemento marcador para el observer */}
            <div ref={observerRef} style={{ height: '1px' }}></div>
    
            {loading && <div>Cargando más publicaciones...</div>}
        </>
    );
}
