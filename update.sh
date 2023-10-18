#!/bin/sh
echo "Starting Yuuko Update..."
echo "Fetching repo changes..."
git pull origin main
echo "Fetching packages..."
yarn --no-progress
echo "Fetched packages successfully."