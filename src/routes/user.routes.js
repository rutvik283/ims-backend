const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");
const { updateUserSchema } = require("../validators/user.validator");
const {
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");

router.get("/", authenticate, authorize(ROLES.ADMIN), getUsers);

router.patch(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(updateUserSchema),
  updateUser,
);

router.delete("/:id", authenticate, authorize(ROLES.ADMIN), deleteUser);

module.exports = router;
