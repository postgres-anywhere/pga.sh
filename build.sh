#!/bin/bash
set -euo pipefail
cd ${0%/*}

sudo rm -rf build/
mkdir -p build/
echo "building site"
docker run -v "$(pwd)/:/src" -ti klakegg/hugo:0.111.3-ubuntu -v --destination "build/" --baseURL="/docs/"

# for testing the build locally
#docker run -p 8000:80 -v $(pwd)/build:/usr/share/nginx/html/docs nginx:latest
# http://localhost:8000/docs/
