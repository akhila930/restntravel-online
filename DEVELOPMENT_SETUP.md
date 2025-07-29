# Development Setup Guide

This guide will help you run the RestNTravel application locally with working authentication and order functionality.

## Quick Start

### Option 1: Simple Development (Recommended)
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the development server (includes API)
npm run dev:api
```

Then open your browser to `http://localhost:3001`

### Option 2: Full Development with Hot Reload
```bash
# Install dependencies
npm install

# Start both frontend and API servers
npm run dev:full
```

This will start:
- Frontend: `http://localhost:8080` (with hot reload)
- API Server: `http://localhost:3001`

## Development Features

### Authentication
- **In-memory user storage** - No database required
- **JWT tokens** - Secure authentication
- **User registration** - Complete signup with all fields
- **User login** - Secure login with password hashing

### Order Management
- **Order creation** - Full order processing
- **Order numbers** - Unique order number generation
- **Console logging** - Order details logged to console
- **Email simulation** - Email sending simulated

### Testing
1. **Create an account** at `/login`
2. **Browse products** at `/shop`
3. **Add items to cart**
4. **Place an order** - Check console for order details

## Development Mode vs Production

### Development Mode
- Uses in-memory storage for users
- Logs orders to console instead of database
- Simulates email sending
- No database connection required

### Production Mode
- Uses MySQL database
- Stores orders in database
- Sends real emails to sales@restNtravel.com
- Full Hostinger deployment

## API Endpoints

### Authentication
- `POST /api/auth` - Login/Signup
  - Body: `{ action: 'login'|'signup', email, password, ... }`

### Orders
- `POST /api/order` - Place order
  - Body: `{ user, billingInfo, items, total }`

## Troubleshooting

### Login Button Not Working
1. Make sure the API server is running (`npm run dev:api`)
2. Check browser console for errors
3. Verify the proxy is working in Vite config

### API Errors
1. Check server console for error messages
2. Verify all dependencies are installed
3. Make sure ports 3001 and 8080 are available

### Build Issues
1. Run `npm install` to ensure all dependencies are installed
2. Clear node_modules and reinstall if needed
3. Check for TypeScript errors

## Next Steps

Once development is working:
1. Test all functionality
2. Deploy to Hostinger using `DEPLOYMENT_GUIDE.md`
3. Set up real database and email configuration
4. Switch to production API endpoints

## Development Scripts

- `npm run dev` - Start Vite dev server only
- `npm run dev:api` - Start API server only
- `npm run dev:full` - Start both servers
- `npm run build` - Build for production
- `npm run preview` - Preview production build 