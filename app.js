require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { limiter } = require('./utils/constants');
const { auth } = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateSignUp, validateSignIn } = require('./middlewares/validate');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cors({ origin: ['http://localhost:3001'] }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);
app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/moviesdb', {
  useNewUrlParser: true,
});

/* логгер запросов */
app.use(requestLogger);

/* обработка путей */
app.post('/signup', validateSignUp, createUser);
app.post('/signin', validateSignIn, login);

app.use('/users', auth, require('./routes/users'));
app.use('/movies', auth, require('./routes/movies'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

/* логгер ошибок */
app.use(errorLogger);

/* обработчик ошибок celebrate */
app.use(errors());

/* централизованный обработчик ошибок */
app.use(errorHandler);

app.listen(PORT);
