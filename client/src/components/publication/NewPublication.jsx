import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

// Context
import { usePublication } from '../../context/PublicationContext'

export const NewPublication = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { fetchNewPublication, uploadImage, dataPublication } = usePublication();

  const [ showMessage, setShowMessage ] = useState(false);

  const onSubmit = handleSubmit(async (values) => {

    // Primero, creamos la publicacion
    const res = await fetchNewPublication({ text: values.text });
    setShowMessage(true);

    // Verificamo si la publicación se creó correctamente y si hay una imagen seleccionada
    if (res && res.Publication && values.image[0]) {
        const publicationId = res.Publication.id;
        const imageFile = values.image[0];

        await uploadImage(publicationId, imageFile);
    }

    reset()
});

useEffect(() => {
  if (showMessage) {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3000);

    // Limpiar el timeout si el componente se desmonta o si showMessage cambia
    return () => clearTimeout(timer);
  }
}, [showMessage]);

  return (
    <div className="aside__container-form">

      {showMessage && (<div className='message-success'>
          {dataPublication.message}
      </div>)}

      <form className="container-form__form-post" onSubmit={onSubmit}>

        <div className="form-post__inputs">
          <label htmlFor="post" className="form-post__label">¿Que estas pesando hoy?</label>
          <textarea name="text" className="form-post__textarea"
            {...register("text", { required: true })}></textarea>
        </div>

        <div className="form-post__inputs">
          <label htmlFor="image" className="form-post__label">Sube tu foto</label>
          <input
                        type="file"
                        name="image"
                        className="form-post__image"
                        {...register("image")}
                    />
        </div>

        <button type="submit" className="form-post__btn-submit">Enviar</button>

      </form>

    </div>
  )
}
