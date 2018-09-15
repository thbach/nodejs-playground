const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const mocha = require('mocha');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {populateTodos, populateUsers, todos, users} = require('./seed/seed');

mocha.beforeEach(populateUsers);
mocha.beforeEach(populateTodos);

mocha.describe('POST /todos', () => {
  mocha.it('should create a new todo', done => {
    const text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text})
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  mocha.it('should not create todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text: ''})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

mocha.describe('GET /todos', () => {
  mocha.it('should get todos of first user', done => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

mocha.describe('GET /todos/:id', () => {
  mocha.it('should return todo doc', done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  mocha.it('should return 404 if todo not found', done => {
    const hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  mocha.it('should return 404 for non-object ids', done => {
    request(app)
      .get('/todos/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  mocha.it('should not return todo doc created by another user', done => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

mocha.describe('DELETE /todos/:id', () => {
  mocha.it('should delete a todo', done => {
    const hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toBeNull();
            done();
          })
          .catch(e => done(e));
      });
  });

  mocha.it('should not delete a todo from another user', done => {
    const hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toBeDefined();
            done();
          })
          .catch(e => done(e));
      });
  });

  mocha.it('should return 404 if todo not found', done => {
    const hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  mocha.it('should return 404 for non-object ids', done => {
    request(app)
      .delete('/todos/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

mocha.describe('PATCH /todos/:id', () => {
  mocha.it('should update the todo', done => {
    const hexId = todos[0]._id.toHexString();
    const body = {text: 'text test', completed: true};

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send(body)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(body.text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  mocha.it('should not update the todo from another user', done => {
    const hexId = todos[1]._id.toHexString();
    const body = {text: 'text test', completed: true};

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send(body)
      .expect(404)
      .end(done);
  });

  mocha.it('should clear completedAt when todo is not completed', done => {
    const hexId = todos[1]._id.toHexString();
    const body = {text: 'test text', completed: false};

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send(body)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(body.text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });
});

mocha.describe('GET /users/me', () => {
  mocha.it('should return users if auth', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  mocha.it('should reutnr 404 if not autrh', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

mocha.describe('POST /users', () => {
  mocha.it('should create a user', done => {
    const email = 'example@example.com';
    const password = '123amb';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeDefined();
        expect(res.body._id).toBeDefined();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) {
          return done(err);
        }
        User.findOne({email})
          .then(user => {
            expect(user).toBeDefined();
            done();
          })
          .catch(e => done(e));
      });
  });

  mocha.it('should reutnr validation error if request invalid', done => {
    const email = 'example2gmail.com';
    const password = '1';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  mocha.it('should not create user if email in use', done => {
    const {email} = users[1];
    const password = '1234566';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});

mocha.describe('POST /users/login', () => {
  mocha.it('should login user and return auth token', done => {
    request(app)
      .post('/users/login')
      .send({email: users[1].email, password: users[1].password})
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeDefined();
      })
      .end((e, res) => {
        if (e) {
          return done(e);
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens[1].access).toBe('auth');
            expect(user.tokens[1].token).toBe(res.headers['x-auth']);
            done();
          })
          .catch(e => done(e));
      });
  });

  mocha.it('should reject invalid login', done => {
    request(app)
      .post('/users/login')
      .send({email: users[1].email, password: 'passfswod'})
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).toBeUndefined();
      })
      .end((e, res) => {
        if (e) {
          return done(e);
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens).toHaveLength(1);
            done();
          })
          .catch(e => done(e));
      });
  });
});

mocha.describe('DELETE /users/me/token', () => {
  mocha.it('it should remove auth token on auth out', done => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((e, res) => {
        if (e) {
          return done(e);
        }
        User.findOne({email: users[0].email})
          .then(user => {
            expect(user.tokens).toHaveLength(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});
