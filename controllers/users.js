const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CREATED } = require('http2').constants;
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ServerError = require('../errors/ServerError');

const { NODE_ENV, JWT_SECRET = 'very-secret-key' } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный _id'));
      }
      return next(new ServerError('Ошибка сервера'));
    });
};

module.exports.updateUserData = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        email,
        name,
      },
    },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(new ServerError('Ошибка сервера'));
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then(() => res.status(HTTP_STATUS_CREATED).send({ email, name }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с данным email уже существует'));
      }
      return next(new ServerError('Ошибка сервера'));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'very-secret-key', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};
