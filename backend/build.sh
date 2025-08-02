#!/bin/bash

set -e

echo "🚀 Starting fresh build for Render deployment..."

# Clean everything
echo "🧹 Cleaning all caches and previous installations..."
rm -rf node_modules
rm -rf package-lock.json
rm -rf .npm-cache
npm cache clean --force

# Clear npm config
echo "⚙️ Resetting npm configuration..."
npm config delete cache
npm config delete prefer-offline
npm config set registry https://registry.npmjs.org/

# Fresh install with explicit settings
echo "📦 Installing dependencies with fresh cache..."
npm install --no-cache --no-prefer-offline --registry https://registry.npmjs.org/

# Verify installation
echo "✅ Verifying installation..."
if npm list @botwall/middleware; then
    echo "✅ @botwall/middleware installed successfully!"
else
    echo "⚠️ @botwall/middleware not found, but continuing build..."
fi

echo "🎉 Build completed successfully!" 