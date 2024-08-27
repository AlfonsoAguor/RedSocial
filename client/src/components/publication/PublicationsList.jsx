import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import avatar from '../../assets/img/user.png';

// Context
import { usePublication } from '../../context/PublicationContext';
import { useAuth } from '../../context/AuthContext';

export const PublicationsList = ({ data }) => {
    const { profile, avatars } = data;
    const { fetchPublicationsUser, publications, fetchImage, image, fetchDeletePublication } = usePublication();
    const { user } = useAuth();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isUser, setIsUser] = useState(false);
    const [dataChanged, setDataChanged] = useState(false);

    useEffect(() => {
        setIsUser(false);
        fetchPublicationsUser(profile.user._id);
        if (user.id === profile.user._id){
            setIsUser(true);
        }
    }, [profile, dataChanged]);

    useEffect(() => {
        if (publications.docs) {
            setDataChanged(false);

            setCurrentPage(publications.page);
            setTotalPages(publications.totalPages);

            publications.docs.forEach(publication => {
                if (publication.file) {
                    const imagePublication = publication.file;
                    fetchImage(imagePublication);
                }
            });
        }
    }, [publications, dataChanged]);

    const handleLoadMore = () => {
        if (currentPage < totalPages) {
            fetchPublicationsUser(profile.user._id, currentPage + 1);
        }
    };

    const handleDeletePublication = (id) => {
        try {
            fetchDeletePublication(id);
        } catch (error) {
            console.error('Error delete publication:', error);
        }
    };

    const formatDate = (date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
    };

    return (
        <>
            <header className="content__header content_header__public">
                <h1 className="content__title">Publicaciones</h1>
            </header>

            {publications.docs.length === 0 ? (
                <h2 className='nothing'>No hay publicaciones</h2>
            ) : (
                <>
                    {publications.docs.map(publication => (
                        <div className="posts__post" key={publication._id}>
                            <div className="post__container">
                                <div className="post__image-user">
                                    <a href="#" className="post__image-link">
                                        <img src={avatars[profile.user.image] || avatar} alt={profile.user.nick} className="post__user-image" />
                                    </a>
                                </div>

                                <div className="post__body">
                                    <div className="post__user-info">
                                        <a href="#" className="user-info__name">{profile.user.nick}</a>
                                        <span className="user-info__divider"> | </span>
                                        <a href="#" className="user-info__create-date">
                                            {formatDate(publication.create_at)}
                                        </a>
                                    </div>

                                    <h4 className="post__content">{publication.text}</h4>
                                </div>

                                {isUser && (
                                    <div className="post__buttons">
                                        <button className='post__button' onClick={() => handleDeletePublication(publication._id)}><i className="fa-solid fa-trash-can"></i></button>
                                    </div>
                                )}
                            </div>

                            {image && (
                                <div className='post__image'>
                                    <img src={image[publication.file]} alt={publication.file} />
                                </div>
                            )}
                        </div>
                    ))}

                    {currentPage < totalPages && (
                        <div className="content__container-btn">
                            <button onClick={handleLoadMore} className="load-more-button">
                                Ver más publicaciones
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
};
