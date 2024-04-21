#!/bin/sh
git pull origin main
bun i --production
git rev-parse --short HEAD > commit.hash

# Cron job to reset logs every month
LOG_DIRECTORY=$(readlink -f src/Logging/logs.txt)
crontab -l > mycron

# TO prevent duplicate cron jobs from being added we remove all lines that contain the path to the logs.txt file
# so it won't disrupt the user's other cron jobs
grep -v "> ${LOG_DIRECTORY}" mycron > tmpfile
mv tmpfile mycron

echo "0 0 1 * * echo date "+%Y-%m-%d %T: Resetting logs" > ${LOG_DIRECTORY}" >> mycron
crontab mycron
rm mycron

pm2 start ecosystem.config.cjs --env production