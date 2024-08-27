const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_TOKEN;

const createToken = (payload) => {

    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            secret,
            {
                expiresIn: "30d"
            },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });

};

module.exports = {
    createToken
};
