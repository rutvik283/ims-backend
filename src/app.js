const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler.middleware");
const notFound = require("./middlewares/notFound.middleware");
const { sanitizeXSS } = require("./middlewares/sanitize.middleware");
const corsMiddleware = require("./config/cors");

// routes
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const commonRoutes = require("./routes/common.routes");

const app = express();

app.use(helmet());
app.use(corsMiddleware);

app.use(express.json());
app.use(cookieParser());

app.use(sanitizeXSS);

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "Inventory API Running",
  });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/options", commonRoutes);

app.use(notFound);

app.use(errorHandler);

module.exports = app;
