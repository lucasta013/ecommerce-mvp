const svc = require('../services/product.service');

exports.list = async (req, res) => res.json(await svc.list());
