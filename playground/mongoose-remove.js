const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {Users} = require('../server/models/user');

// Todo.deleteMany({});
// Todo.deleteMany({}).then(result => {
//   console.log(result);
// });

// return docs
// Todo.findOneAndRemove();
// Todo.findByIdAndRemove();

Todo.findByIdAndRemove('5b9613725413ee12a278db35').then(todo => {
  console.log(todo);
});
