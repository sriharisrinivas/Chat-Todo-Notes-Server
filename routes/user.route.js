const express = require("express");
const router = express.Router();
const { loginController, createUserController, changePasswordController, resetPasswordController, getProfileController, verifyOtpController, generateOtpController, feedbackController, contactController, updateProfileController } = require("../controllers/user.controller");
const authenticateToken = require("../middleware/authenticate.middleware");



/*  Registering an User */
router.post("/createUser/", createUserController);

/*  Login API */
router.post("/login/", loginController);

/* Change Password */
router.put("/changePassword/", authenticateToken, changePasswordController);

/* OTP Generator */
router.post("/generateOtp/", generateOtpController);

/* Reset Password */
router.post("/resetPassword/", resetPasswordController);

/* Verify OTP */
router.post("/verifyOtp/", verifyOtpController);

/* Get Profile */
router.get("/profile/", authenticateToken, getProfileController);

/* Update Profile */
router.put("/updateProfile/", authenticateToken, updateProfileController);

/* Feedback */
router.post("/feedback/", authenticateToken, feedbackController);

/* Portfolio Contact */
router.post("/contact/", contactController);

/* Sample file system */
router.get("/sample/", (req, res) => {
    res.send("Hello World!");
})


module.exports = router;

