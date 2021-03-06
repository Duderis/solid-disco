const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const should = chai.should();

chai.use(chaiHttp);

const token = 'Mn1FNv8QhBVsLY5TsGPs3Ov05phOnIwwYbkDjbyndnNbCY3qbJ8SYEcx1k12t7h0aE5nvuFADLchlo6lZYIedtlXiuJRKIur0KqRPvXayLFVU6pwBWmUKoxvqWVy8BA6LlEKLpXIVRLi6Iz8B9aeMqsb3sO7rJPCNylhDgHyO0mRxXUvHhIJjTBwjfdhwo4jvM7XeZLyB1LTfLXFEwmpJXzz0qEOw4IuKCMtDhdR66AtZlp6G2QhblPJR6rtqYGH';

mongoose.Promise = global.Promise;

const db = mongoose.connect('mongodb://localhost:27017/solid_disco_test', { useMongoClient: true });
autoIncrement.initialize(db);

const Board = require('../app/models/board');

describe('Boards', () => {
  after((done) => {
    Board.remove({}, (err) => {
      done();
    });
  });

  describe(' GET boards', () => {
    it('it should GET all the boards', (done) => {
      chai.request(server)
        .get('/api/boards')
        .set('Authorization', 'Bearer ' + token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe(' POST board', () => {
    it('it should POST a board', (done) => {
      const board = {
        name: 'testboard',
        description: 'testdesc'
      }
      chai.request(server)
        .post('/api/boards')
        .set('Authorization', 'Bearer ' + token)
        .send(board)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('description');
          done();
        });
    });
    it('it should not Post a board', (done) => {
      const board = {
        name: 'testboard'
      };
      chai.request(server)
        .post('/api/boards')
        .set('Authorization', 'Bearer ' + token)
        .send(board)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('description');
          res.body.errors.description.should.have.property('kind').eql('required');
          done();
        });
    });
  });

  const board = new Board({ name: 'cooltestboard', description: 'cooltestdesc'});

  describe(' GET/:id board', () => {
    it('it should GET a board by the given id', (done) => {
      board.save((err, board) => {
        chai.request(server)
          .get('/api/boards/'+ board.boardId)
          .set('Authorization', 'Bearer ' + token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('description');
            res.body.should.have.property('boardId').eql(board.boardId);
            done();
          });
      });
    });
  });

  describe(' GET new boards', () => {
    it('it should GET all the boards', (done) => {
      chai.request(server)
        .get('/api/boards')
        .set('Authorization', 'Bearer ' + token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(2);
          done();
        });
    });
  });

  describe(' PUT board', () => {
    it('it should PUT the board', (done) => {
      chai.request(server)
        .put('/api/boards/'+ board.boardId)
        .set('Authorization', 'Bearer ' + token)
        .send({ name: 'newtestname'})
        .end((err,res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name').eql('newtestname');
          done();
        });
    });
  });

  describe(' DELETE board', () => {
    it('it should DELETE the board', (done) => {
      chai.request(server)
        .delete('/api/boards/'+ board.boardId)
        .set('Authorization', 'Bearer ' + token)
        .end((err,res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('deleted board');
          done();
        });
    });
  });

  describe(' GET 1 less board', () => {
    it('it should GET all the boards, one board less then previous one', (done) => {
      chai.request(server)
        .get('/api/boards')
        .set('Authorization', 'Bearer ' + token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(1);
          done();
        });
    });
  });
});
