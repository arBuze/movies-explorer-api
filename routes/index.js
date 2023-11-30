const router = require('express').Router();
const { validateSignUp, validateSignIn } = require('../middlewares/validate');
const { auth } = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');

/* обработка путей */
router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
