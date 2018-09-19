#!/usr/bin/env bash

cd /tmp/tests

bundle install --path=vendor
bundle exec rake spec