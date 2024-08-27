const multer = require("multer");

const storageAvatar = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './src/uploads/avatar');
    },
    filename: function(req, file, cb){
        cb(null, "avatar_" + Date.now() + file.originalname);
    }
});

const storagePublication = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './src/uploads/publications');
    },
    filename: function(req, file, cb){
        cb(null, "publication_" + Date.now() + file.originalname);
    }
});

const uploadAvatar = multer({ storage: storageAvatar });
const uploadImagePublication= multer({ storage: storagePublication });

module.exports = {
    uploadAvatar,
    uploadImagePublication
};
 