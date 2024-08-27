import React from 'react';
import { Link } from 'react-router-dom';
import avatarDefault from '../../../assets/img/user.png';

// Context
import { useAuth } from '../../../context/AuthContext';
import { useUser } from '../../../context/UserContext';
import { NewPublication } from '../../publication/NewPublication';

export const Sidebar = () => {
    const { user, avatar, defaultAvatar } = useAuth();
    const { publicationsCounter, followerCounter, followingCounter } = useUser();

    return (
        <aside className="layout__aside">

            <header className="aside__header">
                <h1 className="aside__title">Hola, {user.name} {user.surname}</h1>
            </header>

            <div className="aside__container">

                <div className="aside__profile-info">

                    <div className="profile-info__general-info">
                        <div className="general-info__container-avatar">
                            {defaultAvatar ?
                                <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                                :
                                <img src={avatarDefault} className="container-avatar__img" alt="Foto de perfil" />
                            }
                        </div>

                        <div className="general-info__container-names">
                            <a href="#" className="container-names__name">{user.nick}</a>
                            <p className="container-names__nickname">{user.name} {user.surname}</p>
                        </div>
                    </div>

                    <div className="profile-info__stats">

                        <div className="stats__following">
                            <Link to="/social/following" className="following__link">
                                <span className="following__title">Siguiendo</span>
                                <span className="following__number">{followingCounter}</span>
                            </Link>
                        </div>
                        <div className="stats__following">
                            <Link to="/social/follower" className="following__link">
                                <span className="following__title">Seguidores</span>
                                <span className="following__number">{followerCounter}</span>
                            </Link>
                        </div>


                        <div className="stats__following">
                            <Link to={`/social/profile/${user.nick}`} className="following__link">
                                <span className="following__title">Publicaciones</span>
                                <span className="following__number">{publicationsCounter}</span>
                            </Link>
                        </div>


                    </div>
                </div>


                <NewPublication/>

            </div>

        </aside>
    )
}
