const Joi = require('@hapi/joi');
const PersonModel = require('./Models/Person');

exports.plugin = {
  name: 'myPlugin',
  version: '1.0.0',
  register: async (server, options) => {
    server.route({
      method: 'GET',
      path: '/test',
      handler: (request, h) => {
        server.log('info', 'Hi Leo');
        return 'hello, world from TEST!!!';
      },
    });

    server.route({
      method: 'POST',
      path: '/person',
      options: {
        validate: {
          payload: Joi.object({
            name: Joi.string()
              .min(3)
              .required(),
            email: Joi.string()
              .email()
              .required(),
          }),
          failAction: (request, h, error) => {
            return error.isJoi ? h.response(error).takeover() : h.response(error).takeover();
          },
        },
      },
      handler: async (request, h) => {
        try {
          const person = new PersonModel(request.payload);
          const result = await person.save();
          return h.response(result);
        } catch (error) {
          return h.response(error).code(500);
        }
      },
    });
  },
};
