const rateLimit = require('express-rate-limit');

const urlRegex = /^https?\:\/\/[w{3}\.]?[a-zA-Z0-9\-\._~\:\\?#\[\]@!\$&'\(\)\*\+,;=]{1,}[a-zA-Z0-9\-\._~\:\/\?#\[\]@!\$&'\(\)\*\+,%;=]{1,}#?$/; // eslint-disable-line
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

module.exports = {
  urlRegex,
  limiter,
};
