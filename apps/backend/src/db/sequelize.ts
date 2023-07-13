import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  database: 'some_db',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: ':memory:',
});


// Add models
