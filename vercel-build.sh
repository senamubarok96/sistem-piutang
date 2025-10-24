#!/bin/bash
set -e

echo "🚀 Custom build script: Using legacy peer deps"
npm install --legacy-peer-deps
npm run build
