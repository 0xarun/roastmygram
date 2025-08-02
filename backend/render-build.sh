#!/bin/bash

# Render build script to force fresh installation
echo "🧹 Cleaning npm cache and node_modules..."
rm -rf node_modules
rm -rf package-lock.json
npm cache clean --force

echo "📦 Installing dependencies with fresh cache..."
npm install --no-cache --registry https://registry.npmjs.org/

echo "✅ Build completed successfully!" 