#!/bin/sh
yarn sequelize db:migrate
node src/server.js

