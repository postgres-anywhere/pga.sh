#!/bin/bash
set -euo pipefail

cd "${0%/*}"

if [ $# -eq 0 ]; then
  set -- build
fi

while [[ "$#" -gt 0 ]]; do
    case "$1" in
        clean)
            sudo rm -rf build/
        ;;
        build)
            mkdir -p build/
            echo "building site"
            docker run \
                -v "$(pwd):/src" \
                klakegg/hugo:0.111.3-ubuntu \
                -v \
                --destination "build/" \
                --baseURL="/docs/"
        ;;
        dev)
            echo "Check: http://localhost:8000/docs/"
            docker run \
                -p 8000:80 \
                -v "$(pwd)/build:/usr/share/nginx/html/docs" \
                nginx:latest
        ;;
    esac
    shift
done
