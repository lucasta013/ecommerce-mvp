const svc = require('../services/order.service');

exports.create = async (req, res) =>
  res.status(201).json(await svc.createOrder(req.user.uid, (req.body || {}).items));

exports.get = async (req, res) =>
  res.json(await svc.getOrder(req.user.uid, Number(req.params.oid)));

exports.getShipments = async (req, res) => {
  const order = await svc.getOrder(req.user.uid, Number(req.params.oid));
  res.json(order.shipments);
};
