const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    console.error('No token provided');
    return res.sendStatus(401);
  }

  jwt.verify(token, 'secret', (err, user) => {
    // console.log('Token before verification:', token);
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.sendStatus(403);
    }
    req.user = user;
    console.log('Token verified successfully:', user);
    next();
  });
}


module.exports = { authenticateToken };
