const express = require("express");

const router = express.Router();

const { ROLES } = require("../constants");

const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");

router.post(
  "/",
  authenticate,
  validate(createProductSchema),
  createProduct,
);

router.get("/", authenticate, getProducts);

router.get("/:id", authenticate, getProductById);

router.patch(
  "/:id",
  authenticate,
  validate(updateProductSchema),
  updateProduct,
);

router.delete("/:id", authenticate, authorize(ROLES.ADMIN), deleteProduct);

module.exports = router;
