import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const { register, handleSubmit, formState: { errors }, } = useForm();
  const { signin, errors: LoginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (values) => { signin(values); });

  useEffect(() => {
    if (isAuthenticated) navigate("/social");
  }, [isAuthenticated, navigate]);

  return (
    <>
      <header className="content__header content_header__public">
        <h1 className="content__title">Login</h1>
      </header>

      <div className='form__error'>
        {
          LoginErrors.map((error, i) => (
            <div className='error' key={i}><span>{error}</span></div>
          ))
        }
      </div>

      <div className="content__post">
        <form className='register-form' onSubmit={onSubmit}>
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

          <button type="submit" className='btn btn-success'>Autenticate</button>

          <div className='info_login'>
            <span>¿No tienes cuenta?</span>
            <Link to="/register" className='btn btn_login'>Registrate</Link>
          </div>
        </form>
      </div>
    </>
  )
}
