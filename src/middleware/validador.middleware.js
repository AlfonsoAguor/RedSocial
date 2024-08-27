const validateSchema = (schema) => (req, res, next) => {
    try {
        // Valida el req.body con el esquema
        schema.parse(req.body);
        next(); // Si todo es válido, continua
    } catch (error) {
        return res.status(400).json({
            // Extraer y mostrar los mensajes de error
            errors: error.errors.map(err => err.message)
        });
    }
};

module.exports = {
    validateSchema
};
