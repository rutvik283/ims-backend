const appEmitter = require("../utils/eventEmitter");
const dashboardService = require("../services/dashboard.service");

/**
 * Stream Live Dashboard Stats (SSE)
 * GET /api/v1/dashboard/stats/stream
 */
const streamStats = (req, res) => {
  // Set headers for Server-Sent Events (SSE)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Disable keep-alive timeout
  req.socket.setKeepAlive(true);
  req.socket.setTimeout(0);

  // Send updates to the client
  const sendStats = async () => {
    try {
      const stats = await dashboardService.getInventoryStats();
      res.write(`data: ${JSON.stringify(stats)}\n\n`);
    } catch (error) {
      console.error("Error streaming dashboard stats:", error);
    }
  };

  // Send initial data immediately upon connection
  sendStats();

  // Define listener function
  const updateListener = () => {
    sendStats();
  };

  // Subscribe to changes
  appEmitter.on("inventoryUpdated", updateListener);

  // Clean up subscription on connection close
  req.on("close", () => {
    appEmitter.off("inventoryUpdated", updateListener);
    res.end();
  });
};

module.exports = {
  streamStats,
};
