const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.post("/new-habit", controller.newHabit);

module.exports = router;