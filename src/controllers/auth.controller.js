const svc = require('../services/auth.service');

exports.register = async (req, res) => res.status(201).json(await svc.register(req.body));
exports.login = async (req, res) => res.json(await svc.login(req.body));
