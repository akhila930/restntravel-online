#!/bin/bash

echo "🚀 RestNTravel Vercel Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo ""
print_info "Step 1: Checking prerequisites..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js first."
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

print_status "Prerequisites check completed"

echo ""
print_info "Step 2: Building the application..."

# Install dependencies
print_info "Installing dependencies..."
npm install

# Build the application
print_info "Building the application..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Build completed successfully"
else
    print_error "Build failed. Please check the errors above."
    exit 1
fi

echo ""
print_info "Step 3: Preparing for deployment..."

# Check if .git exists
if [ ! -d ".git" ]; then
    print_info "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for Vercel deployment"
fi

# Check if remote exists
if ! git remote get-url origin &> /dev/null; then
    print_warning "No Git remote found. Please add your GitHub repository:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/restntravel-online.git"
    echo "git push -u origin main"
fi

echo ""
print_info "Step 4: Deploying to Vercel..."

# Deploy to Vercel
print_info "Starting Vercel deployment..."
vercel --prod

if [ $? -eq 0 ]; then
    print_status "Deployment completed successfully!"
else
    print_error "Deployment failed. Please check the errors above."
    exit 1
fi

echo ""
print_info "Step 5: Next steps..."

echo ""
print_info "🎯 Manual steps required:"
echo "1. Go to your Vercel dashboard"
echo "2. Add your custom domain: restntravel.shop"
echo "3. Configure DNS records in your domain provider:"
echo "   - Type: A, Name: @, Value: 76.76.19.19"
echo "   - Type: CNAME, Name: www, Value: cname.vercel-dns.com"
echo "4. Wait for DNS propagation (up to 48 hours)"
echo "5. Test your live site at https://restntravel.shop"

echo ""
print_info "📧 Environment Variables to set in Vercel:"
echo "NODE_ENV=production"
echo "DOMAIN=restntravel.shop"
echo "PROTOCOL=https"
echo "SALES_EMAIL=sales@restntravel.shop"
echo "INFO_EMAIL=info@restntravel.shop"
echo "SMTP_HOST=smtp.hostinger.com"
echo "SMTP_PORT=587"
echo "SMTP_USER=sales@restntravel.shop"
echo "SMTP_PASS=SalesRNT@8912"

echo ""
print_info "🧪 Testing checklist:"
echo "1. Visit https://restntravel.shop"
echo "2. Test contact form"
echo "3. Test order placement"
echo "4. Check admin panel: https://restntravel.shop/admin"
echo "5. Verify emails received at sales@restntravel.shop"

echo ""
print_status "Deployment script completed!"
print_info "Your RestNTravel application is ready for production!" 