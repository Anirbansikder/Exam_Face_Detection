const express = require("express");
const router = express.Router();
const userController = require("../controller/user");

router.post("/add-user", userController.addUser);
router.post("/add-image", userController.addImage);
router.get("/get-data",userController.getAllUserData);
router.get("/get-image",userController.getImagesByCode);

module.exports = router;