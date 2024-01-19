const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
      }

      const user = await Users.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ msg: 'User not found' });
      }

      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;
