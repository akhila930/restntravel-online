# RestNTravel Deployment Guide for Hostinger

This guide will help you deploy the RestNTravel e-commerce application on Hostinger with full authentication and order management functionality.

## Prerequisites

- Hostinger hosting account with MySQL database
- Custom domain (optional but recommended)
- Email hosting for sales@restNtravel.com

## Step 1: Database Setup

### 1.1 Create MySQL Database
1. Log into your Hostinger control panel
2. Go to "Databases" → "MySQL Databases"
3. Create a new database (e.g., `restntravel_db`)
4. Create a database user with full privileges
5. Note down the database credentials:
   - Database name
   - Database username
   - Database password
   - Database host (usually `localhost`)

### 1.2 Import Database Schema
1. Go to "Databases" → "phpMyAdmin"
2. Select your database
3. Go to "Import" tab
4. Upload the `database_schema.sql` file
5. Click "Go" to import the schema

## Step 2: Environment Configuration

### 2.1 Create Environment File
Create a `.env` file in your project root with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_hostinger_db_user
DB_PASSWORD=your_hostinger_db_password
DB_NAME=your_hostinger_db_name
DB_PORT=3306

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# SMTP Configuration for Hostinger
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=sales@restNtravel.com
SMTP_PASS=your-smtp-password

# Application Configuration
NODE_ENV=production
```

### 2.2 Update Database Config
Update `config/database.js` with your actual database credentials:

```javascript
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'your_actual_db_user',
  password: process.env.DB_PASSWORD || 'your_actual_db_password',
  database: process.env.DB_NAME || 'your_actual_db_name',
  port: process.env.DB_PORT || 3306,
  // ... rest of config
};
```

## Step 3: Email Configuration

### 3.1 Set Up Email Hosting
1. In Hostinger control panel, go to "Email" → "Email Accounts"
2. Create an email account: `sales@restNtravel.com`
3. Set a strong password
4. Note down the SMTP settings:
   - SMTP Host: `smtp.hostinger.com`
   - SMTP Port: `587`
   - Username: `sales@restNtravel.com`
   - Password: (the one you set)

### 3.2 Update Email Configuration
Update the SMTP settings in `api/order.js`:

```javascript
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'sales@restNtravel.com',
    pass: process.env.SMTP_PASS || 'your-actual-smtp-password'
  }
};
```

## Step 4: Build and Deploy

### 4.1 Install Dependencies
```bash
npm install
```

### 4.2 Build the Application
```bash
npm run build
```

### 4.3 Upload to Hostinger
1. Log into Hostinger File Manager
2. Navigate to your domain's public_html folder
3. Upload all files from the `dist` folder
4. Upload the `api` folder to the root
5. Upload the `config` folder to the root
6. Upload the `public` folder to the root
7. Upload `vercel.json` to the root

### 4.4 Set Up .htaccess
Create a `.htaccess` file in your public_html root:

```apache
RewriteEngine On

# Handle API routes
RewriteRule ^api/(.*)$ api/$1 [L]

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

## Step 5: Domain Configuration

### 5.1 Custom Domain Setup
1. In Hostinger control panel, go to "Domains"
2. Add your custom domain (e.g., `restntravel.com`)
3. Point it to your hosting account
4. Update DNS settings if needed

### 5.2 SSL Certificate
1. Go to "SSL" in your control panel
2. Enable SSL for your domain
3. Force HTTPS redirect

## Step 6: Testing

### 6.1 Test Database Connection
1. Visit your website
2. Try to create a new account
3. Check if user is saved in the database

### 6.2 Test Order System
1. Add items to cart
2. Login with your account
3. Place a test order
4. Check if order is saved in database
5. Verify email is sent to sales@restNtravel.com

### 6.3 Test Email Functionality
1. Place a test order
2. Check if confirmation email is sent
3. Verify email content and formatting

## Step 7: Security Considerations

### 7.1 Environment Variables
- Never commit `.env` file to version control
- Use strong, unique passwords
- Rotate JWT secret regularly

### 7.2 Database Security
- Use strong database passwords
- Limit database user privileges
- Regular database backups

### 7.3 Application Security
- Enable HTTPS
- Set proper security headers
- Regular security updates

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify database credentials
   - Check if database exists
   - Ensure database user has proper privileges

2. **Email Not Sending**
   - Verify SMTP credentials
   - Check if email account is active
   - Test SMTP settings in email client

3. **API Routes Not Working**
   - Check `.htaccess` configuration
   - Verify file permissions
   - Check server error logs

4. **React Router Issues**
   - Ensure `.htaccess` is properly configured
   - Check if all routes redirect to index.html

### Error Logs
- Check Hostinger error logs in control panel
- Monitor application logs for debugging
- Use browser developer tools for frontend issues

## Maintenance

### Regular Tasks
1. **Database Backups**: Set up automatic daily backups
2. **Security Updates**: Keep dependencies updated
3. **Performance Monitoring**: Monitor site performance
4. **Order Management**: Regularly check and process orders

### Monitoring
- Set up uptime monitoring
- Monitor error rates
- Track order volume and success rates
- Monitor email delivery rates

## Support

For technical support:
- Check Hostinger documentation
- Review application logs
- Contact hosting support for server issues
- Review this deployment guide for common solutions

---

**Note**: This deployment guide assumes you're using Hostinger's shared hosting. For VPS or dedicated hosting, some steps may vary. Always refer to Hostinger's official documentation for the most up-to-date instructions. 