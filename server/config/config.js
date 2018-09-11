const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 8888;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 8888;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
} else if (env === 'production') {
  process.env.MONGODB_URI = `mongodb://${process.env.DB_USERNAME}:${
    process.env.DB_PASSWORD
  }@ds151382.mlab.com:51382/node-todo-api`;
}
