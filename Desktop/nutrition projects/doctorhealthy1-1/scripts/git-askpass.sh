#!/bin/sh
if [ -z "$GH_TOKEN" ]; then
  echo "Missing GH_TOKEN" >&2
  exit 1
fi
echo "$GH_TOKEN"
