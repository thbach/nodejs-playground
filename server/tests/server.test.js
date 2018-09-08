const expect = require('expect');
const mocha = require('mocha');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/todo');

mocha.beforeEach(done => {
  Todo.deleteMany({}).then(() => done());
});

mocha.describe('POST /todos', () => {
  mocha.it('Should create a new todo', done => {
    const text = 'This is a test todo';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end(err => {
        if (err) {
          return done(err);
        }

        return Todo.find()
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(dbErr => done(dbErr));
      });
  });

  mocha.it('Should not create todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .send({text: ''})
      .expect(400)
      .end(err => {
        if (err) {
          return done(err);
        }
        return Todo.find()
          .then(todos => {
            expect(todos.length).toBe(0);
            done();
          })
          .catch(dbErr => done(dbErr));
      });
  });
});
