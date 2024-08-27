const jwt = require('jsonwebtoken');

const secret = process.env.SECRET_TOKEN;

const auth = (req, res, next) => {
    // Obtener el token de las cookies

    const { token } = req.cookies;
    if (!token) {
        return res.status(403).send({
            status: "error",
            message: "No se ha proporcionado un token de autenticación"
        });
    }

    // Verificar el token
    jwt.verify(token, secret, (err, decode) => {
        if (err) {
            return res.status(401).send({
                message: "Token inválido o expirado"
            });
        }

        // Guardar el payload decodificado en req.user
        req.user = decode;

        // Continuar al siguiente middleware o controlador
        next();
    });
};

module.exports = {
    auth
};