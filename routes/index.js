const router = require('express').Router();
const { validateSignUp, validateSignIn } = require('../middlewares/validate');
const { auth } = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const { errorMessages } = require('../utils/constants');

/* обработка путей */
router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFoundError(errorMessages.pageNotFound));
});

module.exports = router;
