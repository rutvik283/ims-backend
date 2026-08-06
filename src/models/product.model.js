const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    supplierName: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"],
      default: "OUT_OF_STOCK",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("save", function (next) {
  if (this.quantity === 0) {
    this.status = "OUT_OF_STOCK";
  } else if (this.quantity <= 10) {
    this.status = "LOW_STOCK";
  } else {
    this.status = "IN_STOCK";
  }

  next();
});

productSchema.index({
  name: 1,
  sku: 1,
});

productSchema.index({
  category: 1,
});

productSchema.index({
  status: 1,
});

module.exports = mongoose.model("Product", productSchema);
