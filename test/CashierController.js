/* eslint-env node, mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import chaiJsonSchema from 'chai-json-schema';
import Cashier from '../src/app/models/cashier';
import Category from '../src/app/models/category';
import Transaction from '../src/app/models/transaction';
import User from '../src/app/models/user';
import server, { stop } from '../src/server';
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

const cashierReportSchema = {
  title: 'Cashier report schema',
  type: 'object',
  required: ['saldoTotal', 'movimentacoes'],
  properties: {
    saldoTotal: { type: 'number' },
    movimentacoes: {
      type: 'array',
      items: {
        type: 'object',
        required: ['data', 'id', 'categorias', 'tipo', 'valor', 'descricao'],
        properties: {
          data: { type: 'string', format: 'date-time' },
          id: { type: 'number' },
          tipo: { type: 'string' },
          valor: { type: 'number' },
          descricao: { type: 'string' },
          categorias: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'nome'],
              properties: {
                id: { type: 'number' },
                nome: { type: 'string' },
              },
            },
          },
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
    await Transaction.destroy({
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

      const res = await chai
        .request(server)
        .get('/cashiers')
        .set('authorization', `Bearer ${token}`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.be.jsonSchema(cashierCollectionSchema);
    });

    it('it should GET a single cashier, showing the financial report', async () => {
      const user = await User.create({
        name: 'testinaldo',
        email: 'testinaldo@email.com',
        password: 'password',
      });
      const category = await user.createCategory({
        name: 'Test Category',
      });
      const cashier = await user.createCashier(
        {
          name: 'teste',
        },
        {
          include: [{ model: Transaction, as: 'transactions' }],
        }
      );
      const transaction = await cashier.createTransaction({
        type: 0,
        value: 15,
        description: 'not mandatory',
      });
      await transaction.addCategories([category]);
      const transaction2 = await cashier.createTransaction({
        type: 1,
        value: 32,
        description: 'not mandatory',
      });
      await transaction.addCategories([category]);

      const token = authenticateUser(user);
      const { id } = cashier;

      const res = await chai
        .request(server)
        .get(`/cashiers/${id}`)
        .set('authorization', `Bearer ${token}`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.be.jsonSchema(cashierReportSchema);
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
      const res = await chai
        .request(server)
        .post('/cashiers')
        .set('authorization', `Bearer ${token}`)
        .send(cashierData);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('cashier');
      res.body.should.be.jsonSchema(cashierSchema);
    });

    it('it should not POST a empty cashier', async () => {
      const cashier = {};
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const token = authenticateUser(user);

      const res = await chai
        .request(server)
        .post('/cashiers')
        .set('authorization', `Bearer ${token}`)
        .send(cashier);
      res.should.have.status(422);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      res.body.should.have.property('fields');
      res.body.fields.should.have.property('name');
    });
  });

  /*
   * Test the /PUT route
   */
  describe('/PUT cashier', () => {
    it('it should PUT a cashier', async () => {
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const cashier = await user.createCashier({
        name: 'Old cashier name',
      });
      const cashierData = {
        name: 'Test chashier',
      };
      const token = authenticateUser(user);
      const res = await chai
        .request(server)
        .put(`/cashiers/${cashier.id}`)
        .set('authorization', `Bearer ${token}`)
        .send(cashierData);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('cashier');
      res.body.should.be.jsonSchema(cashierSchema);
    });

    it('it should not PUT a empty cashier', async () => {
      const cashierData = {};
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const cashier = await user.createCashier({
        name: 'Old cashier name',
      });
      const token = authenticateUser(user);

      const res = await chai
        .request(server)
        .put(`/cashiers/${cashier.id}`)
        .set('authorization', `Bearer ${token}`)
        .send(cashierData);
      res.should.have.status(422);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      res.body.should.have.property('fields');
      res.body.fields.should.have.property('name');
    });
  });

  /*
   * Test the /DELETE route
   */
  describe('/DELETE cashier', () => {
    it('it should DELETE a cashier', async () => {
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const cashier = await user.createCashier({
        name: 'Old cashier name',
      });
      const token = authenticateUser(user);
      const res = await chai
        .request(server)
        .delete(`/cashiers/${cashier.id}`)
        .set('authorization', `Bearer ${token}`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
    });
  });
});
