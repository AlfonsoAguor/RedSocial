const Follow = require("../models/follow.model");
const User = require("../models/user.model");
const followService = require("../service/follow.service");
const mongoosePaginate = require("mongoose-paginate-v2");

const pruebaFollow = (req, res) => {
    return res.status(200).json({
        message: "Prueba del controlador de follow"
    });
}

// Accion de guardar un follow (seguir)
const saveFollow = async (req, res) => {

    // Recogemos el id del usuario a seguir
    const params = req.params.id;

    // Recogemos nuestro id
    const identity = req.user;

    try {
        const userToFollow = new Follow({
            user: identity.id,
            followed: params
        });

        try {
            await userToFollow.save();
            return res.status(201).send({
                status: "success",
                message: "Follow guardado",
                follow: userToFollow
            });
        } catch (validationError) {
            return res.status(400).send({ message: validationError.message });
        }

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const unfollow = async (req, res) => {
    const followedId = req.params.id;
    const userId = req.user.id;

    try {
        const existingFollow = await Follow.findOne({
            user: userId,
            followed: followedId
        });

        if (!existingFollow) {
            return res.status(404).send({
                message: 'Follow no encontrado'
            });
        }

        const deleteFollow = await Follow.findByIdAndDelete(existingFollow._id);
        if (!deleteFollow) return res.status(404).send({
            message: 'Error al intentar eliminar el follow'
        });

        return res.status(200).send({
            status: "success",
            message: "Follow eliminado correctamente"
        });

    } catch (error) {
        return res.status(500).send({ message: "Error al intentar eliminar el follow", error });
    }
};

// Seguidos
const following = async (req, res) => {
    // recogemos id del usuario
    let userId = req.user.id;

    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    try {
        //Comprobamos si se ha enviado un id por params, si es asi almacenamos
        if (req.params.id) userId = req.params.id;

        const options = {
            page: page,
            limit: limit,
            sort: { create_at: -1 },
            populate: {
                path: 'followed',
                select: 'nick name surname image'
            }
        };

        const follows = await Follow.paginate({ user: userId }, options);

        const followUserIds = await followService.followUserIds(req.user.id);

        return res.status(200).send({
            follows, 
            user_following: followUserIds.following,
            user_following_me: followUserIds.followers
        });

    } catch (error) {
        return res.status(500).send({ message: "Error", error });
    }

};

// Seguidores
const follower = async (req, res) => {
    // recogemos id del usuario
    let userId = req.user.id;

    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    try {
        //Comprobamos si se ha enviado un id por params, si es asi almacenamos
        if (req.params.id) userId = req.params.id;

        const options = {
            page: page,
            limit: limit,
            sort: { create_at: -1 },
            populate: {
                path: 'user',
                select: 'nick name surname image'
            }
        };

        const follows = await Follow.paginate({ followed: userId }, options);

        const followUserIds = await followService.followUserIds(req.user.id);

        return res.status(200).send({
            follows, 
            user_following: followUserIds.following,
            user_following_me: followUserIds.followers
        });

    } catch (error) {
        return res.status(500).send({ message: "Error", error });
    }

};

module.exports = {
    pruebaFollow,
    saveFollow,
    unfollow,
    following,
    follower
}