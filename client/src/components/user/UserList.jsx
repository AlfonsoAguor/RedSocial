import React, { useState, useEffect } from 'react';
import avatar from '../../assets/img/user.png';
import { Link } from 'react-router-dom';

// Context
import { useFollow } from '../../context/FollowContext';
import { useUser } from '../../context/UserContext';

export const UserList = () => {
    const { fetchFollow } = useFollow();
    const { fetchAvatars, avatars, fetchUserList, list } = useUser();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dataChanged, setDataChanged] = useState(false);
    const [followingSet, setFollowingSet] = useState(new Set());

    useEffect(() => {
        if (!dataChanged) {
            fetchUserList(currentPage);
            setDataChanged(true);
        }
    }, [currentPage, fetchUserList, dataChanged]);

    useEffect(() => {
        if (list) {
            setCurrentPage(list.data.page);
            setTotalPages(list.data.totalPages);

            // Convertimos los usuarios que seguimos en set 
            setFollowingSet(new Set(list.user_following));

            list.data.docs.forEach((user) => {
                const avatarImage = user.image;
                if (avatarImage !== 'user.png' && !avatars[avatarImage]) {
                    fetchAvatars(avatarImage);
                }
            });
        }
    }, [list, avatars, fetchAvatars]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            setDataChanged(false);
        }
    };

    const handleFollow = async(userId) => {
        try {
            await fetchFollow(userId);
            setDataChanged(false);
        } catch (error) {
            console.error('Error following user:', error);
        }
    } 
    
    if (!list || !list.data ) {
        return <div className='default_message'>No hay usuarios registrados</div>;
    }

    return (
        <section className='content__follow'>
            <header className="content__header content_header__public">
                <h1 className="content__title">Listado de usuarios</h1>
            </header>
            <div className="follows_general">
                {list.data.docs.map(user => (
                    <article key={user._id} className='follows_general_article'>
                        <div className="follows_avatar">
                            <Link to={`/social/profile/${user.nick}`}>
                                <img src={avatars[user.image] || avatar} alt={user.nick} />
                            </Link>
                        </div>
                        <div className="follows_info">
                            <p className="follow_info_name">{user.name} {user.surname}</p>
                            <p className="follow_info_nickname">{user.nick}</p>
                        </div>
                        <div className='btn-unfollow'>
                        {followingSet.has(user._id) ? (
                                <button className='btn-success-following'>Siguiendo</button>
                            ) : (
                                <button className='btn-success' onClick={() => handleFollow(user._id)}>Seguir</button>
                            )}
                        </div>
                    </article>
                ))}
            </div>
            <div>
                {currentPage > 1 && (
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className='btn-list'
                    >
                        Anterior
                    </button>
                )}
                <span>Página {currentPage} de {totalPages}</span>
                {currentPage < totalPages && (
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className='btn-list'
                    >
                        Siguiente
                    </button>
                )}
            </div>
        </section>
    );
};
