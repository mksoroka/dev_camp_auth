const { Message } = require('../models');

const createMessage = async (userBody) => Message.create(userBody);

const queryMessages = async (filter, options) => Message.paginate(filter, options);

module.exports = {
  createMessage,
  queryMessages,
};
