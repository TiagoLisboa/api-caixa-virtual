require('dotenv/config');

module.exports = {
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
  test: {
    dialect: 'sqlite',
    storage: 'test.sqlite',
    logging: false,
    foreignKey: true,
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
};
