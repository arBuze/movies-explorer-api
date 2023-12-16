const rateLimit = require('express-rate-limit');

const urlRegex = /^https?\:\/\/[w{3}\.]?[a-zA-Z0-9\-\._~\:\\?#\[\]@!\$&'\(\)\*\+,;=]{1,}[a-zA-Z0-9\-\._~\:\/\?#\[\]@!\$&'\(\)\*\+,%;=]{1,}#?$/; // eslint-disable-line
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const deletedFilmMessage = 'Фильм удален';

const errorMessages = {
  serverErr: 'Ошибка сервера',
  userNotFound: 'Пользователь по указанному _id не найден',
  badRequestId: 'Некорректный _id',
  badRequestUpdateData: 'Переданы некорректные данные при обновлении профиля',
  badRequestCreateUser: 'Переданы некорректные данные при создании пользователя',
  conflictErr: 'Пользователь с данным email уже существует',
  badRequestCreateFilm: 'Переданы некорректные данные при создании фильма',
  filmNotFound: 'Фильм с указанным _id не найден',
  forbiddenErr: 'Нельзя удалить фильм другого пользователя',
  pageNotFound: 'Страница не найдена',
};

module.exports = {
  urlRegex,
  limiter,
  deletedFilmMessage,
  errorMessages,
};
