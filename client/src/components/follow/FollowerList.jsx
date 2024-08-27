import React, { useState, useEffect } from 'react';
import avatar from '../../assets/img/user.png';
import { Link, useLocation } from 'react-router-dom';

// Context
import { useAuth } from '../../context/AuthContext';
import { useFollow } from '../../context/FollowContext';
import { useUser } from '../../context/UserContext';


export const FollowerList = () => {
    const { fecthFollower, followerData, fetchFollow } = useFollow();
    const { user } = useAuth();
    const { fetchAvatars, avatars, fetchUserList, list } = useUser();
    const location = useLocation();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dataChanged, setDataChanged] = useState(false);
    const [followingSet, setFollowingSet] = useState(new Set());
    const meId = user.id;

    /* Para el caso que accedamos al follower de un usuario a traves de su perfil
    obtendremos el id pasado por el perfil*/
    const { userProfileId } = location.state || {};

    useEffect(() => {
        if (!dataChanged && !userProfileId) {
            fetchUserList();
            fecthFollower(user.id, currentPage);
            setDataChanged(true);
        } else if (!dataChanged && userProfileId) {
            fetchUserList();
            fecthFollower(userProfileId, currentPage);
            setDataChanged(true);
        }
    }, [currentPage, user.id, fecthFollower, dataChanged]);

    useEffect(() => {
        if (followerData) {
            setCurrentPage(followerData.page);
            setTotalPages(followerData.totalPages);

            setFollowingSet(new Set(list.user_following));

            followerData.docs.forEach((follow) => {
                const avatarImage = follow.user.image;
                if (avatarImage !== 'user.png' && !avatars[avatarImage]) {
                    fetchAvatars(avatarImage);
                }
            });
        }
    }, [followerData, avatars, fetchAvatars]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            setDataChanged(false);
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

    if (!followerData || !list.data) {
        return <div className='default_message'>No tienes seguidores</div>;
    }

    return (
        <section className='content__follow'>
            <header className="content__header content_header__public">
                <h1 className="content__title">Seguidores</h1>
            </header>
            <div className="follows_general">
                {followerData.docs.map(follow => (
                    <article key={follow._id} className='follows_general_article'>
                        <div className="follows_avatar">
                            <Link to={`/social/profile/${follow.user.nick}`}>
                                <img src={avatars[follow.user.image] || avatar} alt={follow.user.nick} />
                            </Link>
                        </div>
                        <div className="follows_info">
                            <p className="follow_info_name">{follow.user.name} {follow.user.surname}</p>
                            <p className="follow_info_nickname">{follow.user.nick} </p>
                        </div>
                        <div className='btn-unfollow'>
                            {followingSet.has(follow.user._id) ? (
                                <button className='btn-success-following'>Siguiendo</button>
                            ) : follow.user._id !== meId ? (
                                <button className='btn-success' onClick={() => handleFollow(follow.user._id)}>Seguir</button>
                            ) : (
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
