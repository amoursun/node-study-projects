#!/usr/bin/env bash

export PATH=$NODEJS_BIN_LATEST:$PATH
echo "node: $(node -v)"
echo "npm: v$(npm -v)"

npm install
pm2 start app.js
