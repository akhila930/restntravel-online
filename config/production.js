// Production Configuration for RestNTravel
// Update these values with your actual domain and email settings

export const productionConfig = {
  // Domain Configuration
  domain: {
    // Replace with your actual domain (e.g., 'restntravel.com')
    primary: process.env.DOMAIN || 'restntravel.shop',
    // Protocol (http or https)
    protocol: process.env.PROTOCOL || 'https',
    // Full URL
    fullUrl: `${process.env.PROTOCOL || 'https'}://${process.env.DOMAIN || 'restntravel.shop'}`,
  },

  // Email Configuration
  email: {
    // Replace with your new sales email
    sales: process.env.SALES_EMAIL || 'sales@restntravel.shop',
    // Replace with your new info email
    info: process.env.INFO_EMAIL || 'info@restntravel.shop',
    // SMTP Configuration for Hostinger
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'sales@restntravel.shop',
        pass: process.env.SMTP_PASS || 'your-smtp-password'
      }
    }
  },

  // Database Configuration (for Hostinger)
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'your_hostinger_db_user',
    password: process.env.DB_PASSWORD || 'your_hostinger_db_password',
    database: process.env.DB_NAME || 'your_hostinger_db_name',
    port: process.env.DB_PORT || 3306,
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: '7d'
  },

  // App Configuration
  app: {
    name: 'RestNTravel™',
    company: 'NatureTech SimpleInventions Pvt Ltd',
    contact: {
      phone1: '+91 9011065862',
      phone2: '+91 8999575387',
      address: 'B5 SOBA Savera Apartment, Behind Vidya Bank, Bibvewadi, Pune, Maharashtra, India 411037'
    }
  }
};

// Helper function to get full URL
export const getFullUrl = (path = '') => {
  const config = productionConfig;
  return `${config.domain.fullUrl}${path}`;
};

// Helper function to get email configuration
export const getEmailConfig = () => {
  return {
    // Sales team email
    sales: 'sales@restntravel.shop',
    
    // SMTP configuration
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'sales@restntravel.shop',
        pass: process.env.SMTP_PASS || 'your-smtp-password'
      }
    }
  };
};

// Helper function to get database configuration
export const getDatabaseConfig = () => {
  return productionConfig.database;
}; 