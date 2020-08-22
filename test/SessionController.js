/* eslint-env node, mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import User from '../src/app/models/user';
import server from '../src/server';

should();

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

describe('Sessions', () => {
  beforeEach(() => {
    //  Before each test we empty the database
    User.destroy({
      where: {},
    });
  });
  /*
   * Test the /POST route
   */
  describe('/POST login', () => {
    it('it should POST a login', async () => {
      const userData = {
        name: 'Testenaldo',
        email: 'testenaldo@email.com',
        password: 'grandetestenaldo',
      };
      await User.create(userData);
      chai
        .request(server)
        .post('/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.user.should.have.property('id');
          res.body.user.should.have.property('name');
          res.body.user.should.have.property('email');
          res.body.user.should.not.have.property('password');
          res.body.should.have.property('token');
        });
    });

    it('it should not POST a login with invalid password', async () => {
      const userData = {
        name: 'Testenaldo',
        email: 'testenaldo@email.com',
        password: 'grandetestenaldo',
      };
      await User.create(userData);
      chai
        .request(server)
        .post('/login')
        .send({
          email: userData.email,
          password: 'obivouslywrongpassword',
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
        });
    });

    it('it should not POST a empty login', done => {
      const userData = {};
      chai
        .request(server)
        .post('/login')
        .send(userData)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.should.have.property('fields');
          res.body.fields.should.have.property('email');
          res.body.fields.should.have.property('password');
          done();
        });
    });

    it('it should not POST a login with an invalid user', done => {
      const userData = {
        email: 'testenaldo@email.com',
        password: 'grandetestenaldo',
      };
      chai
        .request(server)
        .post('/login')
        .send(userData)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
  });
});
