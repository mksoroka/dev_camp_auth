const express = require('express');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('').get(auth(), (req, res) => {
  res.send('Just string');
});

module.exports = router;
