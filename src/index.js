require('dotenv').config();
const Hapi = require('@hapi/hapi');
const laabr = require('laabr');
const mongoose = require('mongoose');

const { plugin } = require('./MyPlugin');

const server = Hapi.Server({
  port: process.env.HTTP_PORT,
  host: process.env.HTTP_HOST,
});

const init = async () => {
  await server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      server.log('info', 'touched / url');
      return { name: 'hello World!!' };
    },
  });

  await server.register([
    {
      plugin: laabr,
      options: {},
    },
    {
      plugin,
      options: {
        name: 'Leo',
      },
      routes: {
        prefix: '/plugin',
      },
    },
  ]);

  await server.start();

  await mongoose.connect(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    },
    (error) => {
      if (error) {
        server.log('error', `Database unreachable: ${error}`);
        throw error;
      }
    }
  );
};

process.on('unhandledRejection', (err) => {
  server.log('error', err);
  process.exit(1);
});

init();
