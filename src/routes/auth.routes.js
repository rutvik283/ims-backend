const express = require("express");

const router = express.Router();
const {
  register,
  login,
  logout,
  getMyProfile,
} = require("../controllers/auth.controller");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");
const authenticate = require("../middlewares/auth.middleware");

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMyProfile);

module.exports = router;
