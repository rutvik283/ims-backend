const paginate = async (model, query = {}, options = {}) => {
  const page = Math.max(1, parseInt(options.page, 10) || 1);
  const limit = Math.max(1, parseInt(options.limit, 10) || 10);
  const skip = (page - 1) * limit;

  const sort = options.sort || { createdAt: -1 };
  const populate = options.populate || "";

  let findQuery = model.find(query).sort(sort).skip(skip).limit(limit);

  if (populate) {
    findQuery = findQuery.populate(populate);
  }

  const [results, total] = await Promise.all([
    findQuery.lean(),
    model.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    results,
    pagination: {
      page,
      limit,
      totalResults: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = {
  paginate,
};
