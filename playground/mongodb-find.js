const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  { useNewUrlParser: true },
  (err, client) => {
    if (err) {
      return console.log('unable to connect to mongodb server');
    }
    console.log('connected to mongoDB server');

    const db = client.db('TodoApp');

    // db.collection('Todos')
    //   .find({ _id: new ObjectID('5b90c4f8025a8a34f62a2dcb') })
    //   .toArray()
    //   .then(
    //     docs => {
    //       console.log('Todos');
    //       console.log(JSON.stringify(docs, undefined, 2));
    //     },
    //     dbErr => {
    //       console.log('unable to fetch todos', dbErr);
    //     }
    //   );

    // db.collection('Todos')
    //   .find()
    //   .count()
    //   .then(count => {
    //     console.log(`Todos count: ${count}`);
    //   })
    //   .catch(dbErr => {
    //     console.log('unable to fetch todos', dbErr);
    //   });

    return db
      .collection('Users')
      .find({ name: 'Thai' })
      .toArray()
      .then(res => {
        console.log(JSON.stringify(res, undefined, 2));
      })
      .catch(dbErr => {
        console.log('Error', dbErr);
      });

    // return client.close();
  }
);
