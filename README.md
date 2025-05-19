# Daily AU Rewards

Ứng dụng web cho phép người dùng nhận phần thưởng AU hàng ngày thông qua việc xem quảng cáo và giới thiệu người dùng mới.

## Tính năng

- 🎁 Phần thưởng cơ bản: 0.1 AU mỗi ngày
- 📺 Tăng thưởng qua xem quảng cáo (tối đa x2)
- 👥 Hệ thống giới thiệu (tối đa x5)
- 🔐 Đăng nhập bằng Google
- 📱 Hỗ trợ PWA cho Android

## Cài đặt

1. Clone repository:
```bash
git clone [your-repo-url]
cd daily-au-rewards
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` với nội dung sau:
```
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# AdMob Configuration
REACT_APP_ADMOB_APP_ID=your_admob_app_id
REACT_APP_ADMOB_REWARDED_ID=your_admob_rewarded_id

# Database Configuration
DATABASE_URL=your_database_url

# API Configuration
REACT_APP_API_URL=http://localhost:3000
```

4. Chạy ứng dụng ở môi trường development:
```bash
npm start
```

## Triển khai

Ứng dụng được cấu hình để triển khai tự động trên Render.com. Mọi thay đổi trên nhánh main sẽ được tự động triển khai.

### Yêu cầu triển khai:

1. Tạo tài khoản Render.com
2. Liên kết repository GitHub
3. Tạo database PostgreSQL trên Neon
4. Cấu hình các biến môi trường trong Render dashboard

## Bảo mật

- KHÔNG commit file `.env` lên GitHub
- Bảo vệ các khóa API và thông tin nhạy cảm
- Sử dụng biến môi trường cho mọi thông tin xác thực

## Công nghệ sử dụng

- React + TypeScript
- Firebase (Authentication, Analytics)
- AdMob
- PostgreSQL (Neon)
- Render.com (Hosting)

## Liên hệ

Nếu có bất kỳ câu hỏi hoặc góp ý nào, vui lòng tạo issue trong repository. 