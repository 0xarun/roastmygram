#!/bin/bash

# Render.com optimized build script
echo "🚀 Starting optimized build for Render.com..."

# Set npm configuration for faster builds
npm config set cache .npm-cache
npm config set prefer-offline true
npm config set audit false
npm config set fund false

# Install dependencies with optimizations
echo "📦 Installing dependencies..."
npm ci --only=production --no-audit --no-fund --prefer-offline

# Create necessary directories
mkdir -p logs
mkdir -p .npm-cache

echo "✅ Build completed successfully!" 