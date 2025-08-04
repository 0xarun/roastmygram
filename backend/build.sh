#!/bin/bash

# Build script for Roast My Insta Backend
echo "🔥 Building Roast My Insta Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp example.env .env
    echo "⚠️  Please edit .env file with your configuration"
fi

# Run tests (if any)
echo "🧪 Running tests..."
npm test

# Build completed
echo "✅ Build completed successfully!"
echo "🚀 Start the server with: npm start"
echo "🔧 Development mode: npm run dev" 