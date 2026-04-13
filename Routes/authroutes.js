const express = require("express");
const router = express.Router();
const { singup, login} = require("../controllers/authcontroller");
router.post("/singup", singup);
router.post("/login", login);
module.exports = router;