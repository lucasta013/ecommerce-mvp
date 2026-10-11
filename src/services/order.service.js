const prisma = require('../lib/prisma');
const HttpError = require('../utils/httpError');

exports.createOrder = async (uid, items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpError(400, 'items phai la mang khong rong');
  }
  // Gop cac dong trung pid, kiem tra du lieu
  const wanted = new Map();
  for (const it of items) {
    const pid = Number(it.pid);
    const qty = Number(it.qty);
    if (!Number.isInteger(pid) || !Number.isInteger(qty) || qty <= 0) {
      throw new HttpError(400, 'pid va qty phai la so nguyen duong');
    }
    wanted.set(pid, (wanted.get(pid) || 0) + qty);
  }

  // Toan bo trong 1 transaction: loi o bat ky buoc nao thi rollback het
  return prisma.$transaction(async (tx) => {
    const pids = [...wanted.keys()];
    const products = await tx.product.findMany({ where: { pid: { in: pids } } });
    if (products.length !== pids.length) throw new HttpError(404, 'Co san pham khong ton tai');

    // Tru kho co dieu kien (quantity >= qty) de tranh ban lo khi dat cung luc
    for (const p of products) {
      const r = await tx.product.updateMany({
        where: { pid: p.pid, quantity: { gte: wanted.get(p.pid) } },
        data: { quantity: { decrement: wanted.get(p.pid) } },
      });
      if (r.count === 0) throw new HttpError(409, `San pham "${p.pname}" khong du ton kho`);
    }

    return tx.order.create({
      data: {
        uid,
        createat: new Date(), // thoi gian hien hanh
        details: {
          create: products.map((p) => ({
            pid: p.pid,
            qty: wanted.get(p.pid),
            unit_price: p.price, // luu gia tai thoi diem mua
          })),
        },
        shipments: { create: { status: 'PENDING' } }, // dat hang thanh cong -> sang shipment
      },
      include: { details: { include: { product: true } }, shipments: true },
    });
  });
};

exports.getOrder = async (uid, oid) => {
  if (!Number.isInteger(oid)) throw new HttpError(400, 'oid khong hop le');
  const order = await prisma.order.findFirst({
    where: { oid, uid }, // chi xem duoc don cua chinh minh
    include: { details: { include: { product: true } }, shipments: true },
  });
  if (!order) throw new HttpError(404, 'Khong tim thay don hang');
  return order;
};
