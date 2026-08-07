const Category = require("../models/category.model");
const Product = require("../models/product.model");
const { STOCK_STATUS } = require("../constants");

/**
 * Registry of available option fetchers.
 * Each key maps to an async function that returns an array of { value, label }.
 * To add a new option type, simply add a new entry here.
 */
const optionFetchers = {
  categories: async () => {
    const categories = await Category.find()
      .select("_id name")
      .sort({ name: 1 })
      .lean();

    return categories.map((cat) => ({
      value: cat._id,
      label: cat.name,
    }));
  },

  statuses: async () => {
    return Object.entries(STOCK_STATUS).map(([, value]) => ({
      value,
      label: value
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" "),
    }));
  },

  products: async () => {
    const products = await Product.find()
      .select("_id name sku")
      .sort({ name: 1 })
      .lean();

    return products.map((prod) => ({
      value: prod._id,
      label: `${prod.name} (${prod.sku})`,
    }));
  },
};

/**
 * Get options for the requested fields only.
 * @param {string[]} fields - Array of requested option keys
 * @returns {Object} - Object with only the requested option sets
 */
const getOptions = async (fields) => {
  const result = {};

  const validFields = fields.filter((field) => optionFetchers[field]);

  const entries = await Promise.all(
    validFields.map(async (field) => {
      const data = await optionFetchers[field]();
      return [field, data];
    }),
  );

  for (const [key, value] of entries) {
    result[key] = value;
  }

  return result;
};

/**
 * Get all available option field names.
 */
const getAvailableFields = () => {
  return Object.keys(optionFetchers);
};

module.exports = {
  getOptions,
  getAvailableFields,
};
