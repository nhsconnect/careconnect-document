#!/bin/sh

echo EntryPoint

set -xe

: "${KEYCLOAK_CLIENT_SECRET?Need an keycloak secret}"
: "${SMART_OAUTH2_CLIENT_SECRET?Need an SMART OAUTH2 secret}"

echo /usr/share/nginx/html/cat/main*bundle.js

ls /usr/share/nginx/html/cat

sed -i "s/KEYCLOAK_CLIENT_SECRET/$KEYCLOAK_CLIENT_SECRET/g" /usr/share/nginx/html/cat/main*bundle.js

sed -i "s/SMART_OAUTH2_CLIENT_SECRET/$SMART_OAUTH2_CLIENT_SECRET/g" /usr/share/nginx/html/cat/main*bundle.js

exec "$@"
