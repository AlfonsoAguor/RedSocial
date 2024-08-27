const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: String,
    bio: String,
    nick: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "role_user"
    },
    image: {
        type: String,
        default: "user.png"
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});

//Se implementa el plugin para permitir las consultas paginadas
UserSchema.plugin(mongoosePaginate);

module.exports = model("User", UserSchema);
