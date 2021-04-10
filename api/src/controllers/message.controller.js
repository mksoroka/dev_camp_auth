const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { messageService } = require('../services');

const createMessage = catchAsync(async (req, res) => {
  const user = await messageService.createMessage(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getMessages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await messageService.queryMessages(filter, options);
  res.send(result);
});

module.exports = {
  createMessage,
  getMessages,
};
