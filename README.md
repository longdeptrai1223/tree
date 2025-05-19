# Modern Web Application

A full-stack web application built with React (frontend) and Express (backend).

## Project Structure

```
/
├── client/             # Frontend React application
│   ├── public/         # Static files
│   ├── src/           # React source code
│   ├── package.json   # Frontend dependencies
│   ├── Dockerfile     # Frontend Docker configuration
│   └── nginx.conf     # Nginx configuration
│
└── server/            # Backend Express application
    ├── server.js      # Express server
    ├── package.json   # Backend dependencies
    └── Dockerfile     # Backend Docker configuration
```

## Prerequisites

- Node.js 18.20.0
- npm 9.x
- Docker and Docker Compose (for containerized deployment)

## Development

### Using Docker (Recommended)

1. Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

2. Build and start the containers:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:5000

### Manual Development

#### Frontend (React)

```bash
cd client
npm install
npm start
```

The frontend will be available at http://localhost:3000

#### Backend (Express)

```bash
cd server
npm install
npm run dev
```

The backend API will be available at http://localhost:5000

## Production Deployment

### Using Docker

1. Build the images:
```bash
docker-compose -f docker-compose.prod.yml build
```

2. Start the containers:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

#### Frontend

```bash
cd client
npm install
npm run build
```

#### Backend

```bash
cd server
npm install
npm start
```

## Environment Variables

Copy `.env.example` to `.env` and update the values for your environment.

## Security Features

- Helmet for HTTP headers security
- CORS configuration
- Rate limiting
- Compression
- Environment variables for sensitive data
- Docker security best practices

## License

MIT

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

Ứng dụng được cấu hình để triển khai tự động trên Render.com với hai dịch vụ:
- Frontend: modern-web-app-frontend
- Backend: modern-web-app-backend

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