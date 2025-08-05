const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied: No token provided');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains id and type (user or vendor)
    next();
  } catch (err) {
    res.status(401).send('Access denied: Invalid token');
  }
};

const vendorMiddleware = (req, res, next) => {
  if (req.user.type !== 'vendor') {
    return res.status(403).send('Access denied: Vendor type required');
  }
  next();
};

module.exports = { authMiddleware, vendorMiddleware };