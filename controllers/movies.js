const { HTTP_STATUS_CREATED } = require('http2').constants;

const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const { deletedFilmMessage } = require('../utils/constants');
const { errorMessages } = require('../utils/constants');

const {
  serverErr,
  badRequestId,
  badRequestCreateFilm,
  filmNotFound,
  forbiddenErr,
} = errorMessages;

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((cards) => res.send(cards))
    .catch(() => next(new ServerError(serverErr)));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink: trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(HTTP_STATUS_CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(badRequestCreateFilm));
      }
      return next(new ServerError(serverErr));
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError(filmNotFound));
      }
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError(forbiddenErr));
      }

      return Movie.deleteOne(movie)
        .then(() => res.send({ message: deletedFilmMessage }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(badRequestId));
      }
      return next(new ServerError(serverErr));
    });
};
