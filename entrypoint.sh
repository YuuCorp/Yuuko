#!/bin/bash

if [ ! -f ./src/database/*.sqlite ]; then
  bun db:push
fi

exec bun start:prod