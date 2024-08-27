import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

// Context 
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';

export const Edit = ({ change }) => {
    const { register, handleSubmit, setValue, reset } = useForm();
    const { user } = useAuth();
    const { fetchUserProfile, profile, fetchUpdateUser, fetchUpdateAvatar, errors } = useUser();

    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => { setShowMessage(false) }, 2000);
            return () => clearTimeout(timer)
        }
    }, [showMessage]);

    useEffect(() => {
        fetchUserProfile(user.nick);
    }, [user, change]);

    useEffect(() => {
        if (profile && change === 1) {
            setValue('name', profile.user.name);
            setValue('surname', profile.user.surname);
            setValue('bio', profile.user.bio);
            setValue('nick', profile.user.nick);
            setValue('email', profile.user.email);
        }
    }, [profile, change, setValue]);

    useEffect(() => {
        reset();
    }, [change, reset]);

    const onSubmit = handleSubmit(async (data) => {
        if (change === 1) {
            // Datos
            fetchUpdateUser(data);
            setShowMessage(true);
        } else if (change === 2) {
            // Contraseña
            fetchUpdateUser(data);
            setShowMessage(true);
            reset();
        } else {
            // Avatar
            const imageFile = data.image[0];
            fetchUpdateAvatar(imageFile);
            setShowMessage(true);
            reset();
        }
    });

    return (
        <>
            <div className='form__error'>
                {errors.length > 0 && (

                    errors.map((error, i) => (

                        <div className='error' key={i}><span>{error}</span></div>
                    ))
                )}
            </div>

            {showMessage && change === 1 ? (
                <div className='message-success'>
                    Datos cambiados correctamente
                </div>
            ) : showMessage && change === 2 ? (
                <div className='message-success'>
                    Contraseña cambiada correctamente
                </div>
            ) : showMessage && change === 3 && (
                <div className='message-success'>
                    Avatar cambiado correctamente
                </div>
            )}


            {change === 1 ? (
                <form className='register-form' onSubmit={onSubmit}>
                    <div className='form-group'>
                        <label htmlFor="name">Nombre:</label>
                        <input type="text" name='name'
                            {...register("name")} />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="surname">Apellido:</label>
                        <input type="text" name='surname'
                            {...register("surname")} />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="nick">Nick:</label>
                        <input type="text" name='nick'
                            {...register("nick")} />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="bio">Biografia:</label>
                        <textarea type="text" name='bio'
                            {...register("bio")} />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="email">Correo:</label>
                        <input type="email" name='email'
                            {...register("email")} />
                    </div>

                    <button type="submit" className='btn btn_success'>Actualizar</button>
                </form>
            ) : change === 2 ? (
                <form className='register-form' onSubmit={onSubmit}>

                    <div className='form-group'>
                        <label htmlFor="password">Contraseña:</label>
                        <input type="password" name='password'
                            {...register("password")} />
                    </div>

                    <button type="submit" className='btn btn_success'>Actualizar</button>
                </form>
            ) : change === 3 ? (
                <form className='register-form' onSubmit={onSubmit}>

                    <div className="form-post__inputs">
                        <label htmlFor="image" className="form-post__label">Actualizar avatar</label>
                        <input
                            type="file"
                            name="image"
                            className="form-post__image"
                            {...register("image")}
                        />
                    </div>

                    <button type="submit" className='btn btn_success'>Actualizar</button>
                </form>
            ) : (
                <></>
            )}

        </>
    )
}
