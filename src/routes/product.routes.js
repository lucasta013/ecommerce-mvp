const router = require('express').Router();
const c = require('../controllers/product.controller');

router.get('/', c.list);
module.exports = router;
