#!/bin/sh
git pull origin main
bun i --production
git rev-parse --short HEAD > commit.hash

# Cron job to reset logs every month
LOG_DIRECTORY=$(readlink -f src/Logging/logs.json)
crontab -l > mycron

# TO prevent duplicate cron jobs f  rom being added  we remove all lines that contain the path to the logs.json file
# so it won't disrupt the user's other cron jobs
grep -v "> ${LOG_DIRECTORY}" mycron > tmpfile
mv tmpfile mycron
echo "0 0 1 * * echo '[{ \"date\": \"\$(date +\%Y-\%m-\%d \%T)\", \"user\": \"SYSTEM_LOGGER\", \"info\": \"Reset log!\" }]' > ${LOG_DIRECTORY}" >> mycron
crontab mycron
rm mycron           

pm2 start ecosystem.config.cjs --env production