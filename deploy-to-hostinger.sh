#!/bin/bash

echo "🚀 RestNTravel Deployment Script for Hostinger"
echo "=============================================="

# Build the React app
echo "📦 Building React app..."
npm run build

# Create deployment folder
echo "📁 Creating deployment folder..."
mkdir -p deployment

# Copy built React files
echo "📋 Copying built React files..."
cp -r dist/* deployment/

# Copy PHP backend
echo "🔧 Copying PHP backend..."
cp -r api deployment/

# Copy server configuration
echo "⚙️ Copying server configuration..."
cp .htaccess deployment/

# Copy product images (if not already in dist)
echo "🖼️ Copying product images..."
if [ -d "Products" ]; then
    cp -r Products deployment/
fi

echo ""
echo "✅ Deployment files ready!"
echo ""
echo "📋 Next steps:"
echo "1. Go to Hostinger File Manager"
echo "2. Navigate to public_html"
echo "3. Upload ALL contents of the 'deployment' folder"
echo "4. Visit https://restntravel.shop"
echo ""
echo "📁 Files to upload:"
echo "   - index.html"
echo "   - assets/ (folder)"
echo "   - api/ (folder)"
echo "   - Products/ (folder)"
echo "   - .htaccess"
echo "   - [other files]"
echo ""
echo "🎯 Your React site will work perfectly!" 