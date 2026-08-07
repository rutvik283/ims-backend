const Product = require("../models/product.model");
const Category = require("../models/category.model");

/**
 * Get aggregated dashboard and inventory statistics
 */
const getInventoryStats = async () => {
  const [totalProducts, totalCategories, stockStats, lowStockItems, outOfStockItems] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Product.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: "$quantity" },
        },
      },
    ]),
    Product.countDocuments({ status: "LOW_STOCK" }),
    Product.countDocuments({ status: "OUT_OF_STOCK" }),
  ]);

  const totalStockQuantity = stockStats[0]?.totalStock || 0;

  return {
    totalProducts,
    totalCategories,
    totalStockQuantity,
    lowStockItems,
    outOfStockItems,
  };
};

module.exports = {
  getInventoryStats,
};
