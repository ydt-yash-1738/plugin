const express = require('express');
const router = express.Router();
const { sqFt } = require('../controllers/sqFt.js');

router.post('/', sqFt);

module.exports = router;
