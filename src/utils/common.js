const e = require("express");

const parseExpiryToMs = (value) => {
  const match = String(value).match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(`Invalid expiry format: ${value}`);
  }

  const [, amount, unit] = match;

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return Number(amount) * multipliers[unit];
};

module.exports = {
  parseExpiryToMs,
};
