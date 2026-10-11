const HttpError = require('../utils/httpError');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON khong hop le' });
  }
  console.error(err);
  res.status(500).json({ message: 'Loi he thong' });
};
