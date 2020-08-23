/* eslint-env node, mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import chaiJsonSchema from 'chai-json-schema';
import Transaction from '../src/app/models/transaction';
import Cashier from '../src/app/models/cashier';
import User from '../src/app/models/user';
import server, { stop } from '../src/server';
import authenticateUser from './authenticateUser';

should();

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);
chai.use(chaiJsonSchema);

const transactionSchema = {
  title: 'Transaction schema',
  type: 'object',
  required: ['transaction'],
  properties: {
    transaction: {
      type: 'object',
      required: ['type', 'value', 'category', 'description'],
      properties: {
        type: { type: 'number' },
        value: { type: 'number' },
        category: { type: 'number' },
        description: { type: 'string' },
      },
    },
  },
};

const transactionCollectionSchema = {
  title: 'Transaction collection schema',
  type: 'object',
  required: ['transactions'],
  properties: {
    transactions: {
      type: 'array',
      items: {
        type: 'object',
        required: ['type', 'value', 'category'],
        properties: {
          type: { type: 'number' },
          value: { type: 'number' },
          category: { type: 'number' },
          description: { type: 'string' },
        },
      },
    },
  },
};

describe('Transactions', () => {
  beforeEach(async () => {
    //  Before each test we empty the database
    await Transaction.destroy({
      where: {},
    });
    await Cashier.destroy({
      where: {},
    });
    await User.destroy({
      where: {},
    });
  });

  /*
   * Stops the server
   */
  after(stop);

  /*
   * Test the /GET route
   */
  describe('/GET transaction', () => {
    it('it should GET all transactions', async () => {
      const user = await User.create({
        name: 'testinaldo',
        email: 'testinaldo@email.com',
        password: 'password',
      });

      const cashier = await user.createCashier(
        {
          name: 'teste',
          transactions: [
            { type: 0, value: 15, category: 3, description: 'not mandatory' },
            { type: 0, value: 15, category: 3, description: 'not mandatory' },
          ],
        },
        {
          include: [{ model: Transaction, as: 'transactions' }],
        }
      );

      const token = authenticateUser(user);

      chai
        .request(server)
        .get(`/cashiers/${cashier.id}/transactions`)
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.be.jsonSchema(transactionCollectionSchema);
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('/POST transaction', () => {
    it('it should POST a transaction', async () => {
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const cashier = await user.createCashier({
        name: 'teste',
      });
      const transactionData = {
        type: 0,
        value: 15,
        category: 3,
        description: 'not mandatory',
      };
      const token = authenticateUser(user);
      chai
        .request(server)
        .post(`/cashiers/${cashier.id}/transactions`)
        .set('authorization', `Bearer ${token}`)
        .send(transactionData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('transaction');
          res.body.should.be.jsonSchema(transactionSchema);
        });
    });

    it('it should not POST a empty transaction', async () => {
      const transaction = {};
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const cashier = await user.createCashier({
        name: 'teste',
      });
      const token = authenticateUser(user);

      chai
        .request(server)
        .post(`/cashiers/${cashier.id}/transactions`)
        .set('authorization', `Bearer ${token}`)
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.should.have.property('fields');
          res.body.fields.should.have.property('type');
          res.body.fields.should.have.property('value');
          res.body.fields.should.have.property('category');
        });
    });
  });
});
