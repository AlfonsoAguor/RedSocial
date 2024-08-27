const express = require("express");
const router = express.Router();

//Controller
const UserController = require("../controllers/user.controller");

//Validaciones
const { registerSchema, loginSchema, updateUserSchema } = require("../schema/user.schema");
const { validateSchema } = require("../middleware/validador.middleware");
const { auth } = require("../middleware/auth");
const { uploadAvatar } = require("../middleware/upload.middleware");

// Rutas
router.get("/pruebaUser", auth, UserController.pruebaUser);
router.post("/register", validateSchema(registerSchema), UserController.register);
router.post("/login", validateSchema(loginSchema), UserController.login);
router.post("/logout", UserController.logout);
router.get("/profile/:nick", auth, UserController.profile);       
router.get("/list/:page?", auth, UserController.list);
router.put("/update", auth, validateSchema(updateUserSchema), UserController.update);
router.post("/upload", auth, uploadAvatar.single("file0"), UserController.upload);
router.get("/avatar/:file", auth, UserController.getAvatar);
router.get("/counter/:id", auth, UserController.counters);
router.delete("/deleteUser", auth, UserController.deleteUser);
router.get('/verify', UserController.verifyToken);

module.exports = router;
