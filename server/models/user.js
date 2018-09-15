const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: `{VALUE} is not a valid email!`,
    },
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
  },
  tokens: [
    {
      access: {
        type: String,
        require: true,
      },
      token: {
        type: String,
        require: true,
      },
    },
  ],
});
UserSchema.methods.toJSON = function toJSON() {
  const user = this;
  const userObject = user.toObject();
  return {
    _id: userObject._id,
    email: userObject.email,
  };
};

UserSchema.methods.generateAuthToken = function generateAuthToken() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({_id: user._id.toHexString(), access}, '123abc').toString();

  user.tokens = user.tokens.concat({access, token});
  return user.save().then(() => token);
};

UserSchema.methods.removeToken = function removeToken(token) {
  const user = this;

  return user.update({
    $pull: {
      tokens: {token},
    },
  });
};

UserSchema.statics.findByToken = function findByToken(token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, '123abc');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
};

UserSchema.statics.findByCredentials = function findByCredentials(email, password) {
  const User = this;

  return User.findOne({email}).then(user => {
    if (!user) {
      return Promise.reject;
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (e, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function checkPassword(next) {
  const user = this;
  if (user.isModified('password')) {
    const {password} = user;
    bcrypt.genSalt(10, (e, salt) => {
      bcrypt.hash(password, salt, (e, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('Users', UserSchema);

module.exports = {
  User,
};
