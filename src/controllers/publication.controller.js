// Modelos y Servicios 
const Publication = require("../models/publication.model");
const User = require("../models/user.model");
const followService = require("../service/follow.service");

// Dependencias
const mongoosePaginate = require('mongoose-paginate-v2');
const fs = require("fs");
const path = require("path");

const pruebaPublication = (req, res) => {
    return res.status(200).json({
        message: "Prueba del controlador de publicaciones"
    });
}

const save = async (req, res) => {
    const params = req.body;

    try {
        const newPublication = new Publication({
            ...params,
            user: req.user.id
        });

        try {
            await newPublication.save();
            return res.status(201).send({
                message: "Publicacion realizada",
                Publication: {
                    id: newPublication._id,
                    user: newPublication.user,
                    text: newPublication.text
                }
            });
        } catch (validationError) {
            return res.status(400).send({ message: validationError.message });
        }

    } catch (error) {
        return res.status(400).send({ message: validationError.message });
    }
};

const getPublication = async (req, res) => {
    const publicationId = req.params.id;

    try {
        const public = await Publication.findById(publicationId);
        if (!public) return res.status(500).send({ message: "No se ha encontrado la publicacion" });

        return res.status(200).send({
            status: "succes",
            publicaction: public
        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const getPublications = async (req, res) => {
    const userID = req.params.id;
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    try {
        // recoger las publicaciones del usuario pasado por ID
        const options = {
            page: page,
            limit: limit,
            sort: { create_at: -1 },
            select: '_id text create_at file'
        };

        const result = await Publication.paginate({ user: userID }, options);

        /*const publications = result.docs.map(publication => ({
            id: publication._id,
            text: publication.text,
            file: publication.file,
            create: publication.create_at

        }));*/

        // Recogemos los datos del usuario
        const userInfo = await User.findById(userID).select('-__v -password -role');

        return res.status(200).send({
            publications: result,
            userInfo,
        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const upload = async (req, res) => {
    if (!req.file) {
        return res.status(404).json({ message: "Peticion Invalida " });
    }

    let nameFile = req.file.originalname;
    let fileSplit = nameFile.split(".");
    let ext = fileSplit.pop();

    if (ext != "png" && ext != "jpg" && ext != "gif" && ext != "svg" && ext != "webp") {
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({ message: "Imagen no valida " });
        });
    } else {
        let id = req.params.id;

        // Actualizar artículo
        try {

                let updatedPublication = await Publication.findByIdAndUpdate(
                    id,
                    { file: req.file.filename },
                    { new: true, runValidators: true }
                );
        
                if (!updatedPublication) {
                    return res.status(404).json({ message: "No se ha encontrado la publicación." });
                }
        
                return res.status(200).json({
                    status: "success",
                    publication: updatedPublication,
                    file: req.file
                });

        } catch (error) {
            return res.status(500).json({ message: "Error al actualizar la publicacion", error });
        }
    }
};

const getImage = (req, res) => {
    let file = req.params.file;
    let pathFile = "./src/uploads/publications/" + file;
    fs.stat(pathFile, (error, exists) => {
        if (exists) {
            return res.sendFile(path.resolve(pathFile));
        } else {
            return res.status(404).json({ message: "La imagen no existe " });
        }
    });
};

const deletePublication = async (req, res) => {
    const id = req.params.id;

    try {
        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(404).send({ message: "No se ha encontrado la publicacion" });
        }

        let deletedPublication = await Publication.findOneAndDelete({ _id: id });
        if (!deletedPublication) {
            return res.status(404).json({ message: "No se ha encontrado  la publicacion" });
        }

        if (deletedPublication.file) {
            fs.unlink(path.join(__dirname, '../uploads/publications', deletedPublication.file), (error) => {
                if (error) {
                    console.error('Error en la ruta de eliminar la imagen:', error);
                }
            });
        }

        return res.status(200).send({
            status: "success",
            publication: deletedPublication
        });

    } catch (error) {
        return res.status(500).send({ message: "Error al borrar el artículo", error });
    }
};

const feed = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const myFollows = await followService.followUserIds(req.user.id);

        const options = {
            page: page,
            limit: limit,
            sort: { create_at: -1 },
            populate: {
                path: 'user',
                select: '_id nick name surname image create_at '
            }
            
        };

        const publications = await Publication.paginate({ user: myFollows.following }, options);

        if(!publications){
            return res.status(500).send({ 
                status: "error",
                message: "No hay publicaciones"
             });
        }

        return res.status(200).send({
            status: "success",
            message: "Feed de publicaciones",
            following: myFollows.following,
            publications
        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }

};

module.exports = {
    pruebaPublication,
    save,
    getPublication,
    getPublications,
    upload,
    getImage,
    deletePublication,
    feed
}