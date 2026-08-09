const express = require("express");

const router = express.Router();
const {
  register,
  login,
  logout,
  getMyProfile,
  refresh,
} = require("../controllers/auth.controller");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");
const authenticate = require("../middlewares/auth.middleware");
const { authRateLimiter } = require("../middlewares/rate-limit-middleware");

router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/logout", authRateLimiter, authenticate, logout);
router.post("/refresh", refresh);

router.get("/me", authenticate, getMyProfile);

module.exports = router;
