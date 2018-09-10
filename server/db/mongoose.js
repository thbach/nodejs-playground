const mongoose = require('mongoose');

const MONGODB_URI =
  process.env.NODE_ENV === 'production'
    ? `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds151382.mlab.com:51382/node-todo-api`
    : 'mongodb://localhost:27017/TodoApp';

mongoose.Promise = global.Promise;
mongoose.connect(
  MONGODB_URI,
  {useNewUrlParser: true}
);

module.exports = {
  mongoose,
};
