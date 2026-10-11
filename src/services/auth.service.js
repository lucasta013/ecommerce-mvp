const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const HttpError = require('../utils/httpError');

const sanitize = ({ password, ...rest }) => rest;

exports.register = async ({ username, fullname, password } = {}) => {
  if (!username || !fullname || !password || password.length < 6) {
    throw new HttpError(400, 'username, fullname, password (toi thieu 6 ky tu) la bat buoc');
  }
  if (await prisma.user.findUnique({ where: { username } })) {
    throw new HttpError(409, 'Username da ton tai');
  }
  const role = await prisma.role.findFirst({ where: { rolename: 'normal' } });
  const membership = await prisma.membership.findFirst({ where: { mname: 'Normal', score: 10 } });
  if (!role || !membership) throw new HttpError(500, 'Chua seed du lieu Role/Membership');

  const user = await prisma.user.create({
    data: {
      username,
      fullname,
      password: await bcrypt.hash(password, 10),
      roleid: role.roleid,
      mid: membership.mid,
    },
    include: { role: true, membership: true },
  });
  return sanitize(user);
};

exports.login = async ({ username, password } = {}) => {
  const user = await prisma.user.findUnique({ where: { username: username || '' } });
  if (!user || !(await bcrypt.compare(password || '', user.password))) {
    throw new HttpError(401, 'Sai username hoac password');
  }
  const token = jwt.sign({ uid: user.uid, roleid: user.roleid }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
  return { token, user: sanitize(user) };
};
