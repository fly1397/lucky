var express = require('express');
var lucky = require('../controllers/lucky');
var router = express.Router();

/* GET home page. */
router.get('/', lucky.index);
router.get('/api', lucky.api);
router.post('/api', lucky.api);

module.exports = router;
