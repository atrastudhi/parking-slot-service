#!/bin/bash

# setup directory
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $SCRIPT_DIR
cd ../

# export default env PG_PASSWORD for local after running docker compose
export PG_PASSWORD=admin

echo RUNNING DOCKER COMPOSE...
docker-compose up -d

npm install

# Waits 2 seconds for docker running well
sleep 2

echo MIGRATING "&" SEEDS DATABASE...
npm run migrate:up
npm run seed:run

echo TESTING...
npm run test

echo RUNNING APP...
npm run start