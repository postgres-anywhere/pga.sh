#!/bin/bash
set -euo pipefail
cd ${0%/*}

echo "starting Hugo server"
chromium http://localhost:8313/ &> /dev/null &
docker run -v "$(pwd)/:/src" -p 8313:8313 klakegg/hugo:0.111.3-ubuntu server --bind 0.0.0.0 --port 8313
