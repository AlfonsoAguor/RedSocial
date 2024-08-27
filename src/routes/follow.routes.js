const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/follow.controller");
const { auth } = require("../middleware/auth");

//Rutas
router.get("/pruebaFollow", FollowController.pruebaFollow);
router.post("/saveFollow/:id", auth, FollowController.saveFollow);
router.delete("/unfollow/:id", auth, FollowController.unfollow);
router.get("/following/:id?/:page?", auth, FollowController.following);
router.get("/follower/:id?/:page?", auth, FollowController.follower);

//exportar
module.exports = router;
