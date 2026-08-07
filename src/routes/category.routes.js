const express = require("express");

const router = express.Router();

const { ROLES } = require("../constants");

const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validators/category.validator");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");

router.post(
  "/",
  (req, res, next) => {
    console.log(req, "sdfd");
    next();
  },
  authenticate,
  authorize(ROLES.ADMIN),
  validate(createCategorySchema),
  createCategory,
);

router.get(
  "/",

  authenticate,
  getCategories,
);

router.get("/:id", authenticate, getCategoryById);

router.patch(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(updateCategorySchema),
  updateCategory,
);
router.delete("/:id", authenticate, authorize(ROLES.ADMIN), deleteCategory);

module.exports = router;
