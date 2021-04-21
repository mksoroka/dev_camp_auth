const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { messageService } = require('../services');

const store = {
  cbs: {},
  addCB(id, cb) {
    this.cbs[id] = cb;
  },
  deleteCb(id) {
    delete this.cbs[id];
  },
  addMessage(message) {
    Object.entries(this.cbs).forEach(([id, cb]) => {
      try {
        cb(message);
      } catch (e) {
        this.deleteCb(id);
      }
    });
  },
};

const createMessage = catchAsync(async (req, res) => {
  const message = await messageService.createMessage(req.body);
  store.addMessage(message);
  res.status(httpStatus.CREATED).send(message);
});

const getMessages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await messageService.queryMessages(filter, options);
  res.send(result);
});

const subscribe = catchAsync(async (req, res) => {
  const id = new Date().getTime();
  store.addCB(id, (message) => {
    res.send(message);
  });
  req.on('close', () => {
    store.deleteCb(id);
  });
});

const subscribeSSE = catchAsync(async (req, res) => {
  const id = new Date().getTime();
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache',
  });

  store.addCB(id, (message) => {
    const data = `data: ${JSON.stringify(message)}\n\n`;
    res.write(data);
  });
  req.on('close', () => {
    store.deleteCb(id);
  });
});

const subscribeWS = (ws, req) => {
  const id = new Date().getTime();

  ws.on('message', async (m) => {
    const message = await messageService.createMessage(JSON.parse(m));
    store.addMessage(message);
  });

  store.addCB(id, (message) => {
    const data = JSON.stringify(message);
    ws.send(data);
  });

  req.on('close', () => {
    store.deleteCb(id);
  });
};

module.exports = {
  createMessage,
  getMessages,
  subscribe,
  subscribeSSE,
  subscribeWS,
};
