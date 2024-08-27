import React, { useState, useEffect } from 'react';
import avatar from '../../assets/img/user.png';
import { Link, useLocation } from 'react-router-dom';

// Context
import { useAuth } from '../../context/AuthContext';
import { useFollow } from '../../context/FollowContext';
import { useUser } from '../../context/UserContext';

export const FollowingList = () => {
    const { fecthFollowing, followingData, fetchUnfollow, fetchFollow } = useFollow();
    const { user } = useAuth();
    const { fetchAvatars, avatars, fetchUserList, list } = useUser();
    const location = useLocation();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dataChanged, setDataChanged] = useState(false);
    const [followingSet, setFollowingSet] = useState(new Set());
    const [isUser, setIsUser] = useState(true);
    const meId = user.id;

    /* Para el caso que accedamos al following de un usuario a traves de su perfil
    obtendremos el id pasado por el perfil*/
    const { userProfileId } = location.state || {};

    useEffect(() => {
        if (!dataChanged && !userProfileId) {
            fetchUserList();
            fecthFollowing(user.id, currentPage);
            setDataChanged(true);
        } else if (!dataChanged && userProfileId) {
            fetchUserList();
            fecthFollowing(userProfileId, currentPage);
            setDataChanged(true);
            setIsUser(false);
        }
    }, [currentPage, user.id, fecthFollowing, dataChanged]);

    useEffect(() => {
        if (followingData) {
            setCurrentPage(followingData.page);
            setTotalPages(followingData.totalPages);

            setFollowingSet(new Set(list.user_following));

            followingData.docs.forEach((follow) => {
                const avatarImage = follow.followed.image;
                if (avatarImage !== 'user.png' && !avatars[avatarImage]) {
                    fetchAvatars(avatarImage);
                }
            });
        }
    }, [followingData, avatars, fetchAvatars]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            setDataChanged(false);
        }
    };

    const handleDeleteFollow = async (userId) => {
        try {
            await fetchUnfollow(userId);
            setDataChanged(false);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    const handleFollow = async (userId) => {
        try {
            await fetchFollow(userId);
            setDataChanged(false);
        } catch (error) {
            console.error('Error following user:', error);
        }
    }

    if (!followingData) {
        return <div className='default_message'>No sigues a nadie</div>;
    }

    return (
        <section className='content__follow'>
            <header className="content__header content_header__public">
                <h1 className="content__title">Siguiendo</h1>
            </header>
            <div className="follows_general">
                {followingData.docs.map(follow => (
                    <article key={follow._id} className='follows_general_article'>
                        <div className="follows_avatar">
                            <Link to={`/social/profile/${follow.followed.nick}`}>
                                <img src={avatars[follow.followed.image] || avatar} alt={follow.followed.nick} />
                            </Link>
                        </div>
                        <div className="follows_info">
                            <p className="follow_info_name">{follow.followed.name} {follow.followed.surname}</p>
                            <p className="follow_info_nickname">{follow.followed.nick}</p>
                        </div>
                        <div className='btn-unfollow'>
                            {isUser ? (
                                <button className='btn-delete' onClick={() => handleDeleteFollow(follow.followed._id)}>Dejar de seguir</button>
                            ) : !isUser && followingSet.has(follow.followed._id) ? (
                                <button className='btn-success-following'>Siguiendo</button>
                            ) : !isUser && follow.followed._id !== meId ? (
                                <button className='btn-success' onClick={() => handleFollow(follow.followed._id)}>Seguir</button>
                            ): (
                                <span></span>
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
