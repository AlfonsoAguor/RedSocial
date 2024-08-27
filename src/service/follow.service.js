const Follow = require("../models/follow.model");

// Comprobariamos que usuarios seguimos y no siguien, respectivamente
// Esto lo utilizamos en el modelo de follow
const followUserIds = async (identityUserId) => {
    try {

        // Sacar informacion de seguimiento
        let following = await Follow.find({ "user": identityUserId })
            .select({ "_id": 0, "__v": 0, "user": 0, "create_at": 0 })
            .exec();

        let followers = await Follow.find({ "followed": identityUserId })
            .select({ "_id": 0, "__v": 0, "followed": 0, "create_at": 0 })
            .exec();

        // Esto se hace para almacenar los IDs en un mismo array, no de forma independiente como lo estarian haciendo
        let followingClean = [];
        following.forEach(follow => {
            followingClean.push(follow.followed);
        });

        let followerClean = [];
        followers.forEach(follow => {
            followerClean.push(follow.user);
        });

        return {
            following: followingClean,
            followers: followerClean
        }

    } catch (error) {
        return {};
    }

};

// Comprobariamos si nos sigue una persona que nosotros seguimos y viceversa
// Lo utilizamos en el modelo de user, al meternos en el perfil del usuario, comprobamos si nos sigue y le seguimos (amigos)
const followThisUser = async (identityUserId, profileUserId) => {

    try {
        let following = await Follow.findOne({ "user": identityUserId, "followed": profileUserId });

        let follower = await Follow.findOne({ "followed": identityUserId, "user": profileUserId });

        return {
            following,
            follower
        }
    } catch (error) {
        return {};
    }

}

module.exports = {
    followUserIds,
    followThisUser
}