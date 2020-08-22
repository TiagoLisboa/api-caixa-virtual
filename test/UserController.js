/* eslint-env node, mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import User from '../src/app/models/user';
import server from '../src/server';
should();

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

describe('Users', () => {
  beforeEach(() => {
    //  Before each test we empty the database
    User.destroy({
      where: {},
    });
  });
  /*
   * Test the /POST route
   */
  describe('/POST user', () => {
    it('it should POST a user', done => {
      let user = {
        name: 'Testenaldo',
        email: 'testenaldo@email.com',
        password: 'grandetestenaldo',
      };
      chai
        .request(server)
        .post('/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.user.should.have.property('id');
          res.body.user.should.have.property('name');
          res.body.user.should.have.property('email');
          res.body.user.should.not.have.property('password');
          done();
        });
    });

    it('it should not POST a empty user', done => {
      let user = {};
      chai
        .request(server)
        .post('/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.should.have.property('fields');
          res.body.fields.should.have.property('name');
          res.body.fields.should.have.property('email');
          res.body.fields.should.have.property('password');
          done();
        });
    });
  });
});
