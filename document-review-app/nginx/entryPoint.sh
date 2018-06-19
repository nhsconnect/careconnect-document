#!/bin/sh

echo EntryPoint

set -xe

: "${KEYCLOAK_CLIENT_SECRET?Need an keycloak secret}"
: "${SMART_OAUTH2_CLIENT_SECRET?Need an SMART OAUTH2 secret}"

echo /usr/share/nginx/html/cat/*.js

ls /usr/share/nginx/html/cat

sed -i "s/KEYCLOAK_CLIENT_SECRET/$KEYCLOAK_CLIENT_SECRET/g" /usr/share/nginx/html/cat/main.js

sed -i "s/KEYCLOAK_CLIENT_ID/$KEYCLOAK_CLIENT_ID/g" /usr/share/nginx/html/cat/main.js

sed -i "s/KEYCLOAK_REALM/$KEYCLOAK_REALM/g" /usr/share/nginx/html/cat/main.js

sed -i "s~KEYCLOAK_AUTH_URL~$KEYCLOAK_AUTH_URL~g" /usr/share/nginx/html/cat/main.js

sed -i "s~KEYCLOAK_SERVER_URL~$KEYCLOAK_SERVER_URL~g" /usr/share/nginx/html/cat/main.js

sed -i "s/CAT_COOKIE_DOMAIN/$CAT_COOKIE_DOMAIN/g" /usr/share/nginx/html/cat/main.js

sed -i "s/SMART_OAUTH2_CLIENT_SECRET/$SMART_OAUTH2_CLIENT_SECRET/g" /usr/share/nginx/html/cat/main.js

sed -i "s~FHIR_SERVER_URL~$FHIR_SERVER_URL~g" /usr/share/nginx/html/cat/main.js

sed -i "s~SMART_CARDIAC_URL~$SMART_CARDIAC_URL~g" /usr/share/nginx/html/cat/main.js

sed -i "s~SMART_GROWTH_CHART_URL~$SMART_GROWTH_CHART_URL~g" /usr/share/nginx/html/cat/main.js

exec "$@"
