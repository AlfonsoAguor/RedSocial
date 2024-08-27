const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publication.controller");

//Middleware
const { uploadImagePublication } = require("../middleware/upload.middleware");

//Validaciones
const { auth } = require("../middleware/auth");
const { validateSchema } = require("../middleware/validador.middleware");
const { publicPublicationSchema } = require("../schema/publication.schema");

//Rutass
router.get("/pruebaPubli", PublicationController.pruebaPublication);
router.post("/save", auth, validateSchema(publicPublicationSchema), PublicationController.save);
router.get("/detail/:id", auth, PublicationController.getPublication);
router.get("/publications/:id/:page?", auth, PublicationController.getPublications);
router.post("/upload/:id", auth, uploadImagePublication.single("file0"), PublicationController.upload);
router.get("/image/:file", auth, PublicationController.getImage);
router.delete("/remove/:id", auth, PublicationController.deletePublication);
router.get("/feed/:page?", auth, PublicationController.feed);

//exportar
module.exports = router;
