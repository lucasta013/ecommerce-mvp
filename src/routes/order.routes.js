const router = require('express').Router();
const auth = require('../middlewares/auth');
const c = require('../controllers/order.controller');

router.use(auth); // moi route don hang deu yeu cau JWT
router.post('/', c.create);
router.get('/:oid', c.get);
router.get('/:oid/shipments', c.getShipments);
module.exports = router;
