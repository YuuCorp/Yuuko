#!/bin/sh
git pull origin main
bun i
git rev-parse --short HEAD > commit.hash
pm2 start ecosystem.config.cjs --env production