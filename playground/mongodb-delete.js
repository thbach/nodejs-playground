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
    //   .deleteMany({
    //     text: 'Eat lunch',
    //   })
    //   .then(result => {
    //     console.log(result);
    //   });

    // db.collection('Todos')
    //   .deleteOne({
    //     text: 'Eat lunch',
    //   })
    //   .then(result => {
    //     console.log(result);
    //   });

    // db.collection('Todos')
    //   .findOneAndDelete({ completed: false })
    //   .then(result => {
    //     console.log(result);
    //   });

    db.collection('Users')
      .deleteMany({name: 'Thai'})
      .then(result => {
        console.log(result);
      });

    db.collection('Users')
      .findOneAndDelete({_id: ObjectID('5b920b235badf61600fc72f5')})
      .then(result => {
        console.log(result);
      });

    return client.close();
  }
);
