const express = require("express");
const router = express.Router();
const { streamStats } = require("../controllers/dashboard.controller");
const authenticate = require("../middlewares/auth.middleware");

router.get("/stats/stream", authenticate, streamStats);

module.exports = router;
