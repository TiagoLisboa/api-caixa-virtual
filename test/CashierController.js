/* eslint-env node, mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import chaiJsonSchema from 'chai-json-schema';
import Cashier from '../src/app/models/cashier';
import User from '../src/app/models/user';
import server from '../src/server';
should();

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);
chai.use(chaiJsonSchema);

const cashierSchema = {
  title: 'Cashier schema',
  type: 'object',
  required: ['cashier'],
  properties: {
    cashier: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' },
      },
    },
  },
};

const cashierCollectionSchema = {
  title: 'Cashier collection schema',
  type: 'object',
  required: ['cashiers'],
  properties: {
    cashiers: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
        },
      },
    },
  },
};

describe('Cashiers', () => {
  beforeEach(() => {
    //  Before each test we empty the database
    Cashier.destroy({
      where: {},
    });
  });

  /*
   * Test the /GET route
   */
  describe('/GET cashier', () => {
    it('it should GET a cashier', done => {
      chai
        .request(server)
        .get('/cashiers')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('cashiers');
          res.body.cashiers.should.be.jsonSchema(cashierCollectionSchema);
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('/POST cashier', () => {
    it('it should POST a cashier', done => {
      const user = User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const cashier = {
        name: 'Test chashier',
        user_id: user.id,
      };
      chai
        .request(server)
        .post('/cashiers')
        .send(cashier)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('cashier');
          res.body.cashier.should.be.jsonSchema(cashierSchema);
          done();
        });
    });

    it('it should not POST a empty cashier', done => {
      let cashier = {};
      chai
        .request(server)
        .post('/cashiers')
        .send(cashier)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.should.have.property('fields');
          res.body.fields.should.have.property('name');
          res.body.fields.should.have.property('user_id');
          done();
        });
    });
  });
});
