const { z } = require('zod');

const registerSchema = z.object({
    name: z.string({
        required_error: 'Se necesita nombre de usuario'
    }).min(1, {
        message: 'El campo de nombre esta vacio'
    }),
    nick: z.string({
        required_error: 'Se necesita apodo'
    }).trim().min(1, {
        message: 'El campo de nick esta vacio'
    }),
    email: z.string({
        required_error: 'Se necesita un correo'
    }).email({
        message: 'Correo electrónico inválido'
    }),
    password: z.string({
        required_error: 'Se necesita una contraseña'
    }).min(6, {
        message: 'La contraseña debe contener al menos 6 caracteres'
    }).regex(/(?=.*[a-zA-Z])(?=.*[0-9])/, {
        message: 'La contraseña debe contener al menos una letra y un número'
    })
});

const loginSchema = z.object({
    email: z.string({
        required_error: 'Se necesita un correo'
    }).email({
        message: 'El correo no es valido'
    }),
    password: z.string({
        required_error: 'Se necesita una contraseña'
    })
});

const updateUserSchema = z.object({
    name: z.string({
        required_error: 'Se necesita nombre de usuario'
    }).min(1, {
        message: 'El campo de nombre está vacío'
    }).optional(),
    nick: z.string({
        required_error: 'Se necesita apodo'
    }).trim().min(1, {
        message: 'El campo de nick está vacío'
    }).optional(),
    email: z.string({
        required_error: 'Se necesita un correo'
    }).email({
        message: 'Correo electrónico inválido'
    }).optional(),
    password: z.string().min(6, {
        message: 'La contraseña debe contener al menos 6 caracteres'
    }).regex(/(?=.*[a-zA-Z])(?=.*[0-9])/, {
        message: 'La contraseña debe contener al menos una letra y un número'
    }).optional()
});

module.exports = {
    registerSchema,
    loginSchema,
    updateUserSchema
};
