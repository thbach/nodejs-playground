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

    // db.collection('Todos')
    //   .findOneAndUpdate(
    //     {
    //       _id: ObjectID('5b9209ed5badf61600fc72e9'),
    //     },
    //     {
    //       $set: {
    //         completed: true,
    //       },
    //     },
    //     {
    //       returnOriginal: false,
    //     }
    //   )
    //   .then(result => {
    //     console.log(result);
    //   });

    db.collection('Users')
      .findOneAndUpdate(
        {_id: ObjectID('5b90c841972f693e5af86c02')},
        {$set: {name: 'Thai'}, $inc: {age: 1}},
        {returnOriginal: false}
      )
      .then(result => {
        console.log(result);
      });

    return client.close();
  }
);

// 5b90c841972f693e5af86c02
