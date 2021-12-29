#!/usr/bin/bash


cd proxy-client-app/
npm run build-config

cd ../sapp
make build && make deploy