const jwt = require('jsonwebtoken');
const secret = 'my_supper_pupper_secret_key_ctrhtn777';

module.exports = function (req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).json({msg: 'There is no token'});

  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({msg: 'Token is not valid'});
  }
};
