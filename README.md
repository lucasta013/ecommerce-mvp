# E-commerce MVP (Monolithic)

REST API thương mại điện tử: Node.js, Express 5, Prisma 6, PostgreSQL, JWT, Docker Compose.

## Chạy hệ thống

```bash
cp .env.example .env      # rồi sửa JWT_SECRET và mật khẩu DB
docker compose up -d --build
curl http://localhost:3001/health
```

Lưu ý: `POSTGRES_PASSWORD` phải khớp với mật khẩu trong `DATABASE_URL`.

## API chính

| Method | Đường dẫn | Mô tả |
|---|---|---|
| POST | /api/auth/register | Đăng ký (tự gán role normal, score 10) |
| POST | /api/auth/login | Đăng nhập, nhận JWT |
| GET | /api/products | Danh sách sản phẩm |
| POST | /api/orders | Đặt hàng (cần Bearer token) |
| GET | /api/orders/:oid | Xem đơn hàng |
| GET | /api/orders/:oid/shipments | Xem shipment |
| GET | /health | Health check |

## Ghi chú bảo mật

- `.env` không được commit; chỉ commit `.env.example`.
- `npm audit` còn 1 cảnh báo (deepmerge-ts, thuộc Prisma CLI), không nằm trong luồng xử lý request, chưa có bản vá tương thích với Prisma 6.