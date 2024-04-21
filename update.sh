#!/bin/sh
echo "Starting Yuuko Update..."
echo "Fetching repo changes..."
git pull origin main
echo "Fetching packages..."
bun i --production
echo "Fetched packages successfully."