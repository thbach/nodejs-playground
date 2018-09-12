const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

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
UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  return {
    _id: userObject._id,
    email: userObject.email,
  };
};

UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({_id: user._id.toHexString(), access}, '123abc').toString();

  user.tokens = user.tokens.concat({access, token});
  return user.save().then(() => token);
};

const User = mongoose.model('Users', UserSchema);

module.exports = {
  User,
};
