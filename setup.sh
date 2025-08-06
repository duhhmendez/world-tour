#!/bin/bash

echo "🚀 Setting up World Tour App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "You can download it from: https://nodejs.org/"
    echo ""
    echo "For now, you can open index.html in your browser to test the app!"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎯 To start the development server:"
    echo "   npm run dev"
    echo ""
    echo "🌐 Then open http://localhost:3000 in your browser"
    echo ""
    echo "📱 For mobile testing, you can also open index.html directly in your browser"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi 