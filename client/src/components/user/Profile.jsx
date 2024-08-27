import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import avatar from '../../assets/img/user.png';
import { Link } from 'react-router-dom';
import { PublicationsList } from '../publication/PublicationsList';

// Context
import { useUser } from '../../context/UserContext';
import { useFollow } from '../../context/FollowContext';
import { useAuth } from '../../context/AuthContext';
import { usePublication } from '../../context/PublicationContext';

export const Profile = () => {
    const { fetchUserProfile, profile, fetchAvatars, avatars, fetchUserProfileCounters, userProfileCounter } = useUser();
    const { fetchFollow, fetchUnfollow } = useFollow();
    const { user } = useAuth();
    const { publicationChanged } = usePublication();

    const [isFollow, setIsFollow] = useState(0);
    const [dataChanged, setDataChanged] = useState(false);
    const [isUser, setIsUser] = useState(false);

    const [publicationsCounter, setPublicationsCounter] = useState(0);
    const [followerCounter, setFollowerCounter] = useState(0);
    const [followingCounter, setFollowingCounter] = useState(0);

    // Obtenemos el nick de la URL
    const { nick } = useParams();

    // Obtenemos los datos del perfil pasandole el nick
    useEffect(() => {
        fetchUserProfile(nick);
    }, [nick, dataChanged, publicationChanged]);

    /* Una vez obtenemos los datos del perfil, comprobamos que lo tenemos, 
    si es asi, establecemos el dataChanged a false, hacemos el fetch para obtener el contador, 
    obtenemos la url del avatar y el tipo de follow*/
    useEffect(() => {
        if (profile) {
            setDataChanged(false);

            fetchUserProfileCounters(profile.user._id);

            if (user.id === profile.user._id){
                setIsUser(true);
            }

            const avatarImage = profile.user.image;
            if (avatarImage !== 'user.png' && !avatars[avatarImage]) {
                fetchAvatars(avatarImage);
            }

            if (!isUser && profile.follower === null && profile.following === null) {
                setIsFollow(0);
            } else if (!isUser && profile.follower === null && profile.following !== null) {
                setIsFollow(1);
            } else if (!isUser && profile.follower !== null && profile.following === null) {
                setIsFollow(2);
            } else if (!isUser && profile.follower !== null && profile.following !== null) {
                setIsFollow(3);
            } else {
                setIsFollow(4);
            }

        }
    }, [profile, avatars, dataChanged, publicationChanged]);

    // Una vez obtenido el contador, establecemos el valor es las variables
    /* Todos los useEffect tendran un dataChanged, para cuando sigamos al usuario o dejemos de seguir, se actualice la informacion*/
    useEffect(() => {
        if (userProfileCounter) {
            setPublicationsCounter(userProfileCounter.publications);
            setFollowerCounter(userProfileCounter.followed);
            setFollowingCounter(userProfileCounter.following);

        }
    }, [userProfileCounter, dataChanged]);

    const handleFollow = async (userId) => {
        try {
            await fetchFollow(userId);
            setDataChanged(true);
        } catch (error) {
            console.error('Error following user:', error);
        }
    }

    const handleDeleteFollow = async (userId) => {
        try {
            await fetchUnfollow(userId);
            setDataChanged(true);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };


    if (!profile && !userProfileCounter) {
        return <div className='default_message'>Cargando</div>;
    }

    return (
        <section>

            {/* PERFIL */}

            <div className="aside__header">
                <h1 className="aside__title">Perfil</h1>
            </div>
            <div className="header__profile">
                <div className="profile__avatar">
                    <img src={avatars[profile.user.image] || avatar} alt={profile.user.nick} className="profile__avatar__img" />
                </div>
                <div className="profile__general">
                    <div className="profile__info">
                        <p className="profile__nickname">{profile.user.nick}</p>
                        <p className='profile__name'>{profile.user.name} {profile.user.surname}</p>
                        <p className='profile__bio'>{profile.user.bio}</p>
                    </div>
                    <div className="profile__general_stats">
                        {isFollow === 0 ? (
                            <div className='profile_following'>
                                <p>No se siguen mutuamente</p>
                                <button onClick={() => handleFollow(profile.user._id)}>Seguir</button>
                            </div>
                        ) : isFollow === 1 ? (
                            <div className='profile_following'>
                                <p>Sigues a este usuario</p>
                                <button className='btn-delete' onClick={() => handleDeleteFollow(profile.user._id)}>Dejar de seguir</button>
                            </div>
                        ) : isFollow === 2 ? (
                            <div className='profile_following'>
                                <p>Este usuario te sigue</p>
                                <button onClick={() => handleFollow(profile.user._id)}>Seguir</button>
                            </div>
                        ) : isFollow === 3 && (
                            <div className='profile_following'>
                                <p>Se siguen mutuamente</p>
                                <button className='btn-delete' onClick={() => handleDeleteFollow(profile.user._id)}>Dejar de seguir</button>
                            </div>
                        )}
                        <div className="profile__stats">
                            <div className="stats__following">
                                <Link to="/social/following" className="following__link" state={{ userProfileId: profile.user._id }}>
                                    <span className="following__title">Siguiendo</span>
                                    <span className="following__number">{followingCounter}</span>
                                </Link>
                            </div>
                            <div className="stats__following">
                                <Link to="/social/follower" className="following__link" state={{ userProfileId: profile.user._id }}>
                                    <span className="following__title">Seguidores</span>
                                    <span className="following__number">{followerCounter}</span>
                                </Link>
                            </div>
                            <div className="stats__following">
                                <span className="following__title">Publicaciones</span>
                                <span className="following__number">{publicationsCounter}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PUBLICACIONES */}

            <PublicationsList data={{profile, avatars, isUser}}/>
        </section>
    )
}
