const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  for (const rolename of ['normal', 'admin']) {
    const found = await prisma.role.findFirst({ where: { rolename } });
    if (!found) await prisma.role.create({ data: { rolename } });
  }
  const m = await prisma.membership.findFirst({ where: { mname: 'Normal' } });
  if (!m) await prisma.membership.create({ data: { mname: 'Normal', score: 10 } });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
