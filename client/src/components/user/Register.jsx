import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export const Register = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const { signup, isAuthenticated, errors: RegisterErrors } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate("/social");
    }, [isAuthenticated, navigate]);

    const onSubmit = handleSubmit(async (values) => { signup(values); })

    return (
        <>

            <header className="content__header content_header__public">
                <h1 className="content__title">Registro</h1>
            </header>

            <div className='form__error'>
                {
                    RegisterErrors.map((error, i) => (
                        <div className='error' key={i}><span>{error}</span></div>
                    ))
                }
            </div>

            <div className='content__post'>
                <form className='register-form' onSubmit={onSubmit}>
                    <div className='form-group'>
                        <label htmlFor="name">Nombre:</label>
                        <input type="text" name='name'
                            {...register("name", { required: true })} />
                        {errors.name && (<span className='alert alert-warning'>Se necesita el nombre</span>)}
                    </div>

                    <div className='form-group'>
                        <label htmlFor="surname">Apellido:</label>
                        <input type="text" name='surname'
                            {...register("surname")} />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="nick">Nick:</label>
                        <input type="text" name='nick'
                            {...register("nick", { required: true })} />
                        {errors.nick && (<span className='alert alert-warning'>Se necesita el nick</span>)}
                    </div>

                    <div className='form-group'>
                        <label htmlFor="email">Correo:</label>
                        <input type="email" name='email'
                            {...register("email", { required: true })} />
                        {errors.email && (<span className='alert alert-warning'>Se necesita el correo</span>)}
                    </div>

                    <div className='form-group'>
                        <label htmlFor="password">Contraseña:</label>
                        <input type="password" name='password'
                            {...register("password", { required: true })} />
                        {errors.password && (<span className='alert alert-warning'>Se necesita la contraseña</span>)}
                    </div>

                    <button type="submit" className='btn btn_success'>Registrate</button>
                    <div className='info_login'>
                        <span>¿Ya estas registrado?</span>
                        <Link to="/login" className='btn btn_login'>Inicia sesión</Link>
                    </div>
                </form>
            </div>
        </>
    )
}
