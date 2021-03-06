/* eslint-env node, mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import chaiJsonSchema from 'chai-json-schema';
import Transaction from '../src/app/models/transaction';
import Cashier from '../src/app/models/cashier';
import Category from '../src/app/models/category';
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
      required: ['type', 'value'],
      properties: {
        type: { type: 'number' },
        value: { type: 'number' },
        categories: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name'],
            properties: { name: { type: 'string' } },
          },
        },
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
        required: ['type', 'value'],
        properties: {
          type: { type: 'number' },
          value: { type: 'number' },
          categories: {
            type: 'array',
            items: {
              type: 'object',
              required: ['name'],
              properties: { name: { type: 'string' } },
            },
          },
          description: { type: 'string' },
        },
      },
    },
  },
};

describe('Transactions', async () => {
  beforeEach(async () => {
    //  Before each test we empty the database
    await Transaction.destroy({
      where: {},
    });
    await Cashier.destroy({
      where: {},
    });
    await Category.destroy({
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
            { type: 0, value: 15, description: 'not mandatory' },
            { type: 0, value: 15, description: 'not mandatory' },
          ],
        },
        {
          include: [{ model: Transaction, as: 'transactions' }],
        }
      );

      const token = authenticateUser(user);

      const res = await chai
        .request(server)
        .get(`/cashiers/${cashier.id}/transactions`)
        .set('authorization', `Bearer ${token}`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.be.jsonSchema(transactionCollectionSchema);
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
      const cashier = await user.createCashier({ name: 'teste' });
      const category = await user.createCategory({
        name: 'Test Category',
      });
      const transactionData = {
        type: 0,
        value: 15,
        categories: [category.id],
        description: 'not mandatory',
      };
      const token = authenticateUser(user);
      const res = await chai
        .request(server)
        .post(`/cashiers/${cashier.id}/transactions`)
        .set('authorization', `Bearer ${token}`)
        .send(transactionData);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('transaction');
      res.body.should.be.jsonSchema(transactionSchema);
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

      const res = await chai
        .request(server)
        .post(`/cashiers/${cashier.id}/transactions`)
        .set('authorization', `Bearer ${token}`)
        .send(transaction);
      res.should.have.status(422);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      res.body.should.have.property('fields');
      res.body.fields.should.have.property('type');
      res.body.fields.should.have.property('value');
    });
  });

  /*
   * Test the /PUT route
   */
  describe('/PUT transaction', () => {
    it('it should PUT a transaction', async () => {
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const cashier = await user.createCashier({ name: 'teste' });
      const category = await user.createCategory({
        name: 'Test Category',
      });
      const transaction = await cashier.createTransaction({
        type: 0,
        value: 15,
        categories: [category.id],
        description: 'not mandatory',
      });
      const transactionData = {
        type: 1,
        value: 15,
        description: 'still not mandatory',
      };
      const token = authenticateUser(user);
      const res = await chai
        .request(server)
        .put(`/cashiers/${cashier.id}/transactions/${transaction.id}`)
        .set('authorization', `Bearer ${token}`)
        .send(transactionData);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('transaction');
      res.body.should.be.jsonSchema(transactionSchema);
    });

    it('it should not PUT a empty transaction', async () => {
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const cashier = await user.createCashier({ name: 'teste' });
      const category = await user.createCategory({
        name: 'Test Category',
      });
      const transaction = await cashier.createTransaction({
        type: 0,
        value: 15,
        categories: [category.id],
        description: 'not mandatory',
      });
      const transactionData = {};
      const token = authenticateUser(user);

      const res = await chai
        .request(server)
        .put(`/cashiers/${cashier.id}/transactions/${transaction.id}`)
        .set('authorization', `Bearer ${token}`)
        .send(transactionData);
      res.should.have.status(422);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      res.body.should.have.property('fields');
      res.body.fields.should.have.property('type');
      res.body.fields.should.have.property('value');
    });
  });

  /*
   * Test the /DELETE route
   */
  describe('/DELETE transaction', () => {
    it('it should DELETE a transaction', async () => {
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const cashier = await user.createCashier({ name: 'teste' });
      const category = await user.createCategory({
        name: 'Test Category',
      });
      const transaction = await cashier.createTransaction({
        type: 0,
        value: 15,
        categories: [category.id],
        description: 'not mandatory',
      });
      const token = authenticateUser(user);
      const res = await chai
        .request(server)
        .delete(`/cashiers/${cashier.id}/transactions/${transaction.id}`)
        .set('authorization', `Bearer ${token}`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
    });
  });
});
