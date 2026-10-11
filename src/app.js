const express = require('express');
const prisma = require('./lib/prisma');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      database: 'up',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({ status: 'error', database: 'down' });
  }
});

app.use('/api', routes);
app.use((req, res) => res.status(404).json({ message: 'Khong tim thay duong dan' }));
app.use(errorHandler);

module.exports = app;
