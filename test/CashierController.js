/* eslint-env node, mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import chaiJsonSchema from 'chai-json-schema';
import Cashier from '../src/app/models/cashier';
import User from '../src/app/models/user';
import server from '../src/server';
import authenticateUser from './authenticateUser';

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
  beforeEach(async () => {
    //  Before each test we empty the database
    await Cashier.destroy({
      where: {},
    });
    await User.destroy({
      where: {},
    });
  });

  /*
   * Test the /GET route
   */
  describe('/GET cashier', () => {
    it('it should GET all cashiers', async () => {
      const user = await User.create(
        {
          name: 'testinaldo',
          email: 'testinaldo@email.com',
          password: 'password',
          cashiers: [{ name: 'first' }, { name: 'second' }],
        },
        {
          include: [{ model: Cashier, as: 'cashiers' }],
        }
      );

      const token = authenticateUser(user);

      chai
        .request(server)
        .get('/cashiers')
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.be.jsonSchema(cashierCollectionSchema);
        });
    });

    it('it should GET a single cashier', async () => {
      const user = await User.create({
        name: 'testinaldo',
        email: 'testinaldo@email.com',
        password: 'password',
      });
      const cashier = await user.createCashier({
        name: 'cashier',
      });
      const token = authenticateUser(user);
      const { id } = cashier;

      chai
        .request(server)
        .get(`/cashiers/${id}`)
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('cashier');
          res.body.should.be.jsonSchema(cashierSchema);
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('/POST cashier', () => {
    it('it should POST a cashier', async () => {
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const cashierData = {
        name: 'Test chashier',
      };
      const token = authenticateUser(user);
      chai
        .request(server)
        .post('/cashiers')
        .set('authorization', `Bearer ${token}`)
        .send(cashierData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('cashier');
          res.body.should.be.jsonSchema(cashierSchema);
        });
    });

    it('it should not POST a empty cashier', async () => {
      const cashier = {};
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const token = authenticateUser(user);

      chai
        .request(server)
        .post('/cashiers')
        .set('authorization', `Bearer ${token}`)
        .send(cashier)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.should.have.property('fields');
          res.body.fields.should.have.property('name');
        });
    });
  });
});
