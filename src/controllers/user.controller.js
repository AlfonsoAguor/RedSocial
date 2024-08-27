// Modelos y servicios
const User = require("../models/user.model");
const Follow = require("../models/follow.model");
const Publication = require("../models/publication.model");
const followService = require("../service/follow.service");
const { createToken } = require("../service/jwt.js");
const secret = process.env.SECRET_TOKEN;

// Dependencias
const bcrypt = require("bcryptjs");
const jwt = require("../service/jwt");
const jsonwt = require('jsonwebtoken');
const fs = require("fs");
const path = require("path");
const mongoosePaginate = require('mongoose-paginate-v2');

const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Prueba del controlador de usuario"
    });
}

const register = async (req, res) => {
    const params = req.body;
    try {
        // Comprobamos si ya existe el email o el nick
        const existingUsers = await User.find({
            $or: [
                { email: params.email.toLowerCase() },
                { nick: params.nick.toLowerCase() }
            ]
        });

        if (existingUsers.length > 0) {
            return res.status(400).send({
                status: "error",
                message: "El usuario ya existe"
            });
        }

        // Cifrar contraseña
        const passwordHash = await bcrypt.hash(params.password, 10);

        // Crear nuevo usuario
        const newUser = new User({
            ...params,
            password: passwordHash
        });

        // Intentamos guardar el usuario en Mongo
        try {
            const userSaved = await newUser.save();

            //Generar el token
            const token = await createToken({ id: newUser._id });
            res.cookie('token', token); // Guardamos en la cookie

            return res.status(201).send({
                message: "Usuario registrado con éxito",
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    surname: newUser.surname,
                    nick: newUser.nick,
                }
            });
        } catch (validationError) {
            console.log("Validate error", validationError);
            return res.status(400).send({ message: validationError.message });
        }

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Comparamos el correo y luego la contraseña
        const userFound = await User.findOne({ email: email.toLowerCase() });
        if (!userFound) return res.status(400).send({ message: "No se encuentra el correo" });
        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).send({ message: "Contraseña incorrecta" });

        //Generar el token
        const token = await createToken({ id: userFound._id });

        // En tu controlador de login
        res.cookie('token', token); // Guardamos en la cookie

        return res.status(200).send({
            message: "Inicio correcto",
            user: {
                id: userFound._id,
                name: userFound.name,
                surname: userFound.surname,
                nick: userFound.nick,
                email: userFound.email,
                image: userFound.image
            }
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const logout = (req, res) => {
    //Para hacer el logout, tan simple con indicarle el token vacio y cuando expirara (0)
    res.cookie('token', "", {
        expires: new Date(0)
    });
    return res.sendStatus(200);
};

const profile = async (req, res) => {
    const nick = req.params.nick;

    try {
        // Buscamos el usuario por el ID y le indicamos a la pass y al rol un 0 para que no me devuelva los valores al return
        const userProfile = await User.findOne({ nick: nick }).select({ password: 0, role: 0 }).exec();

        if (!userProfile) {
            return res.status(404).send({
                status: "error",
                message: "El usuario no existe"
            });
        }

        // Comprobamos si nos seguimos mutuamente
        const followInfo = await followService.followThisUser(req.user.id, userProfile._id);

        // Devolver el resultado
        return res.status(200).send({
            status: "success",
            user: userProfile,
            following: followInfo.following,
            follower: followInfo.follower
        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const list = async (req, res) => {
    const userId = req.user.id; 
    try {
        // Obtener el número de página de los parámetros de consulta
        const page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.query.limit) || 5;


        // Opciones para la paginación
        const options = {
            page,
            limit,
            sort: { create_at: -1 }
        };

        // Consultar con paginación y excluimos el user que tenga nuestro id
        const result = await User.paginate({_id: { $ne: userId}}, options);

        // Sacamos usuarios que seguimos y que nos siguien
        const followUserIds = await followService.followUserIds(userId);

        //En el data podremos ver mucha informacion, como el numero de paginas totales, total de objetos(usuarios) y muchas cosas utiles
        return res.status(200).send({
            status: "success",
            data: result,
            user_following: followUserIds.following,
            user_following_me: followUserIds.followers
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    // Guardamos la información del usuario que está autenticado
    let userIdentity = req.user;

    // Recogemos los valores actualizados
    const userToUpdate = req.body;

    try {
        // Variables para almacenar usuarios encontrados
        let existingUserByEmail = null;
        let existingUserByNick = null;

        // Comprobamos si el email existe en otro usuario
        if (userToUpdate.email) {
            existingUserByEmail = await User.findOne({ email: userToUpdate.email.toLowerCase() });
        }

        // Comprobamos si el nick existe en otro usuario
        if (userToUpdate.nick) {
            existingUserByNick = await User.findOne({ nick: userToUpdate.nick.toLowerCase() });
        }

        // Verificamos si el email ya está en uso por otro usuario
        if (existingUserByEmail && existingUserByEmail._id.toString() !== userIdentity.id) {
            return res.status(400).json({
                status: "error",
                message: "El email ya está en uso por otro usuario."
            });
        }

        // Verificamos si el nick ya está en uso por otro usuario
        if (existingUserByNick && existingUserByNick._id.toString() !== userIdentity.id) {
            return res.status(400).json({
                status: "error",
                message: "El nick ya está en uso por otro usuario."
            });
        }

        // Si hay un nuevo password en los datos de actualización, cifrarlo
        if (userToUpdate.password) {
            userToUpdate.password = await bcrypt.hash(userToUpdate.password, 10);
        }

        // Actualizamos el usuario en la base de datos
        const updatedUser = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        // Devolvemos el usuario actualizado
        return res.status(200).json({
            message: "Usuario actualizado con éxito",
            user: {
                name: updatedUser.name,
                nick: updatedUser.nick,
                email: updatedUser.email
            }
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const getAvatar = (req, res) => {
    let file = req.params.file;
    let pathFile = "./src/uploads/avatar/" + file;
    fs.stat(pathFile, (error, exists) => {
        if (exists) {
            return res.sendFile(path.resolve(pathFile));
        } else {
            return res.status(404).json({ message: "La imagen no existe " });
        }
    });
};

const upload = async (req, res) => {
    if (!req.file) {
        return res.status(404).send({ message: "Peticion Invalida " });
    }

    let nameFile = req.file.originalname;
    let fileSplit = nameFile.split(".");
    let ext = fileSplit.pop();

    if (ext != "png" && ext != "jpg" && ext != "gif" && ext != "svg" && ext != "webp") {
        fs.unlink(req.file.path, (error) => {
            return res.status(400).send({ message: "Imagen no valida " });
        });
    } else {
        const id = req.user.id;

        try {
            const userFound = await User.findOne({ _id: id });
            if (!userFound) {
                return res.status(404).send({ message: "No se ha encontrado el usuario" });
            }
            const oldFile = await userFound.image;

            let updatedUser = await User.findByIdAndUpdate(
                id,
                { image: req.file.filename },
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                return res.status(404).send({ message: "No se ha encontrado el usuario" });
            }

            try {
                if (oldFile !== "user.png" && oldFile !== updatedUser.image) {
                    fs.unlink(path.join(__dirname, '../uploads/avatar', oldFile), (error) => {
                        if (error) {
                            console.error('Error en la ruta de eliminar la imagen:', error);
                        }
                    });
                }

                return res.status(200).send({
                    status: "success",
                    user: updatedUser,
                    file: req.file,

                });

            } catch (error) {
                return res.status(500).send({ message: "Error al actualizar el usuario", error });
            }

        } catch (error) {
            return res.status(500).send({ message: "Error al actualizar el usuario", error });
        }
    }

};

const counters = async (req, res) => {
    const userID = req.params.id;

    try {
        const following = await Follow.countDocuments({ "user": userID });
        const followed = await Follow.countDocuments({ "followed": userID });
        const publications = await Publication.countDocuments({ "user": userID });

        return res.status(200).send({
            userID,
            following: following,
            followed: followed,
            publications: publications
        })

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    const userID = req.user.id;

    try {
        const deletedUser = await User.findByIdAndDelete({ _id: userID });

        if (!deletedUser) {
            return res.status(404).send({ message: "No se ha encontrado el usuario" });
        }

        if (deletedUser.image !== "user.png") {
            fs.unlink(path.join(__dirname, '../uploads/avatar', deletedUser.image), (error) => {
                if (error) {
                    console.error('Error en la ruta de eliminar la imagen:', error);
                }
            });
        }

        const deletedFollowsOfUser = await Follow.deleteMany({
            $or: [
                { user: userID },
                { followed: userID }
            ]
        });

        const publications = await Publication.find({ user: userID });

        const updatedFile = await Publication.updateMany(
            { user: userID },
            { $set: { file: "" } }
        );

        publications.forEach(publication => {
            if (publication.file && publication.file !== "") {
                fs.unlink(path.join(__dirname, '../uploads/publications', publication.file), (error) => {
                    if (error) {
                        console.error('Error en la ruta de eliminar la imagen:', error);
                    }
                });
            }
        });

        const deletedPublicationsOfUser = await Publication.deleteMany({ user: userID });

        return res.status(200).send({
            status: "success",
            message: "Se ha eliminado correctamente el usuario",
            user: deletedUser,
            follow: deletedFollowsOfUser.deletedCount,
            publication: deletedPublicationsOfUser.deletedCount
        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

const verifyToken = async (req, res) => {

    const { token } = req.cookies;

    if (!token) {
        return res.status(403).send({
            status: "error",
            message: "No se ha proporcionado un token de autenticación"
        });
    }

    jsonwt.verify(token, secret, async (err, decode) => {


        if (err) {
            return res.status(403).send({
                status: "error",
                message: "No se ha proporcionado un token de autenticación"
            });
        }

        try {
            const userFound = await User.findById(decode.id);
            if (!userFound) {
                return res.status(401).json(["Unauthorized"]);
            }

            return res.json({
                id: userFound._id,
                name: userFound.name,
                nick: userFound.nick,
                image: userFound.image,
                ...(userFound.surname && { surname: userFound.surname }),
                ...(userFound.bio && { bio: userFound.bio })
            });
        } catch (error) {
            return res.status(500).json(["Server error"]);
        }

    });

}

module.exports = {
    pruebaUser,
    register,
    login,
    profile,
    list,
    update,
    upload,
    getAvatar,
    counters,
    logout,
    deleteUser,
    verifyToken
}
