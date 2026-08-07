const express = require("express");

const router = express.Router();

const { adjustStockSchema } = require("../validators/inventory.validator");

const {
  adjustStock,
  getTransactions,
  getProductTransactions,
} = require("../controllers/inventory.controller");

const authenticate = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

router.post("/", authenticate, validate(adjustStockSchema), adjustStock);

router.get("/", authenticate, getTransactions);

router.get("/product/:productId", authenticate, getProductTransactions);

module.exports = router;
