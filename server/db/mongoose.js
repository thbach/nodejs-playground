const mongoose = require('mongoose');

const MONGODB_URI = `mongodb://${process.env.DB_USERNAME}:${
  process.env.DB_PASSWORD
}@ds151382.mlab.com:51382/node-todo-api`;

mongoose.Promise = global.Promise;
mongoose.connect(
  MONGODB_URI || 'mongodb://localhost:27017/TodoApp',
  {useNewUrlParser: true}
);

module.exports = {
  mongoose,
};
