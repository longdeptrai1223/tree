module.exports = {
  apps: [{
    name: 'au-rewards-server',
    script: 'dist/index.js',
    instances: 'max', // Sử dụng tất cả CPU cores
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 3001
    }
  }]
}; 