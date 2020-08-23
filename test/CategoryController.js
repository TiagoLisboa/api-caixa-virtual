/* eslint-env node, mocha */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import chaiJsonSchema from 'chai-json-schema';
import Category from '../src/app/models/category';
import User from '../src/app/models/user';
import server, { stop } from '../src/server';
import authenticateUser from './authenticateUser';

should();

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);
chai.use(chaiJsonSchema);

const categorySchema = {
  title: 'Category schema',
  type: 'object',
  required: ['category'],
  properties: {
    category: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' },
      },
    },
  },
};

const categoryCollectionSchema = {
  title: 'Category collection schema',
  type: 'object',
  required: ['categories'],
  properties: {
    categories: {
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

describe('Categories', () => {
  beforeEach(async () => {
    //  Before each test we empty the database
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
  describe('/GET category', () => {
    it('it should GET all categories', async () => {
      const user = await User.create(
        {
          name: 'testinaldo',
          email: 'testinaldo@email.com',
          password: 'password',
          categories: [{ name: 'first' }, { name: 'second' }],
        },
        {
          include: [{ model: Category, as: 'categories' }],
        }
      );

      const token = authenticateUser(user);

      const res = await chai
        .request(server)
        .get('/categories')
        .set('authorization', `Bearer ${token}`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.be.jsonSchema(categoryCollectionSchema);
    });
  });

  /*
   * Test the /POST route
   */
  describe('/POST category', () => {
    it('it should POST a category', async () => {
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const categoryData = {
        name: 'Test chashier',
      };
      const token = authenticateUser(user);
      const res = await chai
        .request(server)
        .post('/categories')
        .set('authorization', `Bearer ${token}`)
        .send(categoryData);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('category');
      res.body.should.be.jsonSchema(categorySchema);
    });

    it('it should not POST a empty category', async () => {
      const category = {};
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const token = authenticateUser(user);

      const res = await chai
        .request(server)
        .post('/categories')
        .set('authorization', `Bearer ${token}`)
        .send(category);
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
  describe('/PUT category', () => {
    it('it should PUT a category', async () => {
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const category = await user.createCategory({
        name: 'Old category name',
      });
      const categoryData = {
        name: 'Test chashier',
      };
      const token = authenticateUser(user);
      const res = await chai
        .request(server)
        .put(`/categories/${category.id}`)
        .set('authorization', `Bearer ${token}`)
        .send(categoryData);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('category');
      res.body.should.be.jsonSchema(categorySchema);
    });

    it('it should not PUT a empty category', async () => {
      const categoryData = {};
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const category = await user.createCategory({
        name: 'Old category name',
      });
      const token = authenticateUser(user);

      const res = await chai
        .request(server)
        .put(`/categories/${category.id}`)
        .set('authorization', `Bearer ${token}`)
        .send(categoryData);
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
  describe('/DELETE category', () => {
    it('it should DELETE a category', async () => {
      const user = await User.create({
        name: 'Fulaninho',
        email: 'fulano@email.com',
        password: 'password',
      });
      const category = await user.createCategory({
        name: 'Old category name',
      });
      const token = authenticateUser(user);
      const res = await chai
        .request(server)
        .delete(`/categories/${category.id}`)
        .set('authorization', `Bearer ${token}`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
    });
  });
});
