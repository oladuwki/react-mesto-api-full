const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.getUsers = (req, res, next) => {
  users.find({})
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Нет пользователя с таким id'));
      }
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Переданы некорректный данные'));
      }
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  const { _id } = req.user;
  return users.findOne({ _id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Нет пользователя с таким id'));
      }
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Переданы некорректный данные'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    users.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then(
        (user) =>
          // eslint-disable-next-line implicit-arrow-linebreak
          res.status(200).send({
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            // eslint-disable-next-line comma-dangle
          })
        // eslint-disable-next-line function-paren-newline
      )
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Переданы некорректный данные'));
        } else if (err.name === 'MongoError' && err.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже существует!'));
        }
        next(err);
      });
  });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  users.findByIdAndUpdate(owner, { name, about }, { runValidators: true, new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Нет пользователя с таким id'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректный данные'));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  users.findByIdAndUpdate(owner, { avatar }, { runValidators: true, new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Нет пользователя с таким id'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректный данные'));
      }
      next(err);
    });
};

module.exports.getUserId = (req, res, next) => {
  users.findById(req.params.id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Нет пользователя с таким id'));
      }
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Переданы некорректный данные'));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  users.findByIdAndUpdate(
    req.user._id,
    { name, about },
    // eslint-disable-next-line comma-dangle
    { runValidators: true, new: true }
  )
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Нет пользователя с таким id'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректный данные'));
      }
      next(err);
    });
};


module.exports.login = (req, res, next) => {

  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          // eslint-disable-next-line comma-dangle
          { expiresIn: '7d' }
        ),
      });
    })
    .catch(next);
};