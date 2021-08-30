git pull origin main
yarn
git rev-parse --short HEAD > commit.hash
pm2 start ecosystem.config.js --env production