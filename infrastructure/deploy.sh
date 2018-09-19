#!/usr/bin/env bash

npm run build

PROVIDED_REGION=${REGION:-eu-central-1}

cdk bootstrap --profile="white-rook-workshops" "${ACCOUNT}/${PROVIDED_REGION}"
cdk deploy --profile="white-rook-workshops" -c password="${PASSWORD}"
