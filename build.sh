#!/bin/bash

# Build script for Netlify deployment
echo "🚀 Starting Web3 Prospector build process..."

# Change to client directory
cd client

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📂 Build output is in client/dist/"
else
    echo "❌ Build failed!"
    exit 1
fi

# List build contents
echo "📋 Build contents:"
ls -la dist/

echo "🎉 Build process completed!"