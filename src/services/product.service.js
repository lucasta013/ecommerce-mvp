const prisma = require('../lib/prisma');

exports.list = () => prisma.product.findMany({ orderBy: { pid: 'asc' } });
