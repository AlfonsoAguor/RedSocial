import React from 'react';
import { Link } from 'react-router-dom';
import avatarDefault from '../../../assets/img/user.png';

// Context
import { useAuth } from '../../../context/AuthContext';


export const Nav = () => {
    const { user, logout, avatar, defaultAvatar } = useAuth();

    return (
        <>
            <nav className="navbar__container-lists">

                <ul className="container-lists__menu-list">
                    <li className="menu-list__item">
                        <Link to="/social" className="menu-list__link">
                            <i className="fa-solid fa-house"></i>
                            <span className="menu-list__title">Inicio</span>
                        </Link>
                    </li>

                    <li className="menu-list__item">
                        <a href="#" className="menu-list__link">
                            <i className="fa-solid fa-list"></i>
                            <span className="menu-list__title">Timeline</span>
                        </a>
                    </li>

                    <li className="menu-list__item">
                        <Link to="/social/people" className="menu-list__link">
                            <i className="fa-solid fa-user"></i>
                            <span className="menu-list__title">Gente</span>
                        </Link>
                    </li>

                    {/*<li className="menu-list__item">
                        <a href="#" className="menu-list__link">
                            <i className="fa-regular fa-envelope"></i>
                            <span className="menu-list__title">Mensajes</span>
                        </a>
                    </li>*/}
                </ul>

                <ul className="container-lists__list-end">
                    <li className="list-end__item">
                        <Link to={`/social/profile/${user.nick}`} className="list-end__link-image">
                        {defaultAvatar ?
                                <img src={avatar} className="list-end__img" alt="Foto de perfil" />
                                :
                                <img src={avatarDefault} className="list-end__img" alt="Foto de perfil" />
                            }
                        </Link>
                    </li>
                   <li className="list-end__item">
                        <Link to={`/social/profile/${user.nick}`} className="list-end__link">
                            <span className="list-end__name">{user.nick}</span>
                        </Link>
                    </li>
                    <li className="list-end__item">
                        <Link to="/social/settings" className="list-end__link">
                            <i className='fa-solid fa-gear'></i>
                            <span className="list-end__name">Ajustes</span>
                        </Link>
                    </li>
                    <li className="list-end__item">
                        <Link className="list-end__link" to="/" onClick={() => { logout(); }}>
                            <i className='fa-solid fa-arrow-right-from-bracket'></i>
                            <span className="list-end__name">Cerrar Sesion</span>
                        </Link>
                    </li>
                </ul>

            </nav>
        </>
    )
}
