import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Edit } from './Edit';

// Context 
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';

export const EditProfile = () => {
    const { logout } = useAuth();
    const { fetchDeleteUser } = useUser();
    const navigate = useNavigate();

    const [change, setChange] = useState(0);
    const [showMessage, setShowMessage] = useState(false);
    const [ deleteCancel, setDeleteCancel] = useState(false);

    const handleDeleteUser = async () => {
        const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");

        if (isConfirmed) {
            try {
                await fetchDeleteUser();
                logout();

                setShowMessage(true);

            } catch (error) {
                console.error("Error al eliminar el usuario:", error);
            }
        } else {
            setShowMessage(true);
            setDeleteCancel(true);
        }
    };

    useEffect(() => {
        if (showMessage && !deleteCancel) {
            const timer = setTimeout(() => { setShowMessage(false) }, 2000);
            return () => clearTimeout(timer)
        } else if (showMessage && deleteCancel){
            const timer = setTimeout(() => { setShowMessage(false); setDeleteCancel(false) }, 2000);
            return () => clearTimeout(timer)
        }
    }, [showMessage]);

    return (
        <>
            {showMessage && !deleteCancel ? (<div className='message-success'>
                Se ha eliminado el usuario correctamente.
            </div>
            ) : showMessage && deleteCancel && (
                <div className='message-success'>
                Se ha cancelado.
            </div>
            )}

            <div className="content__header content_header__public">
                <h1 className="content__title">Editar Perfil</h1>
            </div>

            <div className='content__edit'>
                <div className='content_edit_list'>
                    <ul>
                        <li><button className="btn_login" onClick={() => setChange(3)}>Cambiar avatar</button></li>
                        <li><button className="btn_login" onClick={() => setChange(2)}>Cambiar contraseña</button></li>
                        <li><button className="btn_login" onClick={() => setChange(1)}>Editar datos</button></li>
                        <li><button className='btn-delete' onClick={handleDeleteUser}>Eliminar usuario</button></li>
                    </ul>
                </div>

                <div className='content_edit_form'>
                    <Edit change={change} />
                </div>
            </div>
        </>
    );
}
