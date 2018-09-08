const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  {useNewUrlParser: true},
  (err, client) => {
    if (err) {
      return console.log('unable to connect to mongodb server');
    }
    console.log('connected to mongoDB server');

    const db = client.db('TodoApp');
    // db.collection('Todos').insertOne(
    //   {
    //     text: 'Something to do',
    //     completed: false,
    //   },
    //   (dbErr, result) => {
    //     if (dbErr) {
    //       return console.log('unable to insert to do', dbErr);
    //     }

    //     return console.log(JSON.stringify(result.ops, undefined, 2));
    //   }
    // );

    db.collection('Users').insertOne(
      {
        name: 'Thai',
        age: 30,
        location: 'the moon',
      },
      (dbErr, result) => {
        if (dbErr) {
          return console.log('unable to insert user', dbErr);
        }
        console.log(ObjectID(result.ops[0]._id).getTimestamp());
        return console.log(JSON.stringify(result.ops, undefined, 2));
      }
    );

    return client.close();
  }
);
