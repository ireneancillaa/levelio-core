const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { requireAuth } = require("../../middlewares/authMiddleware");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/profile", controller.getProfile);
router.post("/send-email-reset-password", controller.sendEmailResetPassword);
router.post("/verify-otp", controller.verifyOtp);

// with middleware auth
router.post("/reset-password", requireAuth, controller.resetPassword);

module.exports = router;
