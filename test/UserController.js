/* eslint-env node, mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import User from '../src/app/models/user';
import server, { stop } from '../src/server';
should();

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

describe('Users', () => {
  beforeEach(async () => {
    //  Before each test we empty the database
    await User.destroy({
      where: {},
    });
  });

  /*
   * Stops the server
   */
  after(stop);

  /*
   * Test the /POST route
   */
  describe('/POST user', () => {
    it('it should POST a user', async () => {
      let user = {
        name: 'Testenaldo',
        email: 'testenaldo@email.com',
        password: 'grandetestenaldo',
      };
      const res = await chai
        .request(server)
        .post('/users')
        .send(user);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('user');
      res.body.user.should.have.property('id');
      res.body.user.should.have.property('name');
      res.body.user.should.have.property('email');
      res.body.user.should.not.have.property('password');
    });

    it('it should not POST a empty user', async () => {
      let user = {};
      const res = await chai
        .request(server)
        .post('/users')
        .send(user);
      res.should.have.status(422);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      res.body.should.have.property('fields');
      res.body.fields.should.have.property('name');
      res.body.fields.should.have.property('email');
      res.body.fields.should.have.property('password');
    });
  });
});
