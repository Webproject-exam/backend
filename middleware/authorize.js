/*
 * @Author Cornflourblue
 * @Date June 17 2020
 * @Title Node.js + MongoDB API - JWT Authentication with Refresh Tokens
 * @Type Forum post code
 * @URL = https://jasonwatmore.com/post/2020/06/17/nodejs-mongodb-api-jwt-authentication-with-refresh-tokens
 */

const jwt = require('express-jwt');
const secret = process.env.TOKEN_SECRET;
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

module.exports = authorize;

function authorize(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    jwt({ secret, algorithms: ['HS256'] }),

    async (req, res, next) => {
      const user = await User.findById(req.user._id);
      const refreshToken = await RefreshToken.find({ user: user.id });

      if (!user || (roles.length && !roles.includes(user.role))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      req.user.role = user.role;
      req.user.ownsToken = token => !!refreshToken.find(x => x.token === token);
      next();
    },
  ];
}
