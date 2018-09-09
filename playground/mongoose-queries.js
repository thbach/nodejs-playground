const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {Users} = require('../server/models/user');

// const id = '5b937ae72e6e1b0f17befebe';
const id = '5b921b010743794c6e5e5ac611';

if (!ObjectId.isValid(id)) {
  console.log('Id not valid');
}

// Todo.find({
//   _id: id,
// }).then(todos => {
//   console.log('Todos', todos);
// });

// Todo.findOne({
//   _id: id,
// }).then(todo => {
//   console.log('Todo', todo);
// });

// Todo.findById(id)
//   .then(todo => {
//     if (!todo) {
//       return console.log('id no found');
//     }
//     return console.log('TodobyID', todo);
//   })
//   .catch(e => console.log(e));

Users.findById(id)
  .then(user => {
    if (!user) {
      return console.log('user not found');
    }
    console.log('User', user);
  })
  .catch(() => console.log('invalid id'));
