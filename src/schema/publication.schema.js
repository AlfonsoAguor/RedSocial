const { z } = require('zod');

const publicPublicationSchema = z.object({
    text: z.string({
        required_error: 'Se necesita introducir texto para la publicacion'
    }).min(1, {
        message: 'El texto no puede estar vacío'
    })
});

module.exports = {
    publicPublicationSchema
};
