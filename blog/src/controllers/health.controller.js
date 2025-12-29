const getHealth = (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'arsys-blog-api',
  });
};

module.exports = {
  getHealth,
};

