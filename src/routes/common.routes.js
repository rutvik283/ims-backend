const express = require("express");

const router = express.Router();

const { getOptions } = require("../controllers/common.controller");

const authenticate = require("../middlewares/auth.middleware");

router.get("/", authenticate, getOptions);

module.exports = router;
