// Development QR Code Management API
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// QR code configuration file
const qrConfigFile = path.join(__dirname, '..', 'data', 'qr-config.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load QR code configuration
const loadQRConfig = () => {
  try {
    if (fs.existsSync(qrConfigFile)) {
      const data = fs.readFileSync(qrConfigFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading QR config:', error);
  }
  return {
    currentQR: '/payment-qr-code.png',
    qrHistory: []
  };
};

// Save QR code configuration
const saveQRConfig = (config) => {
  try {
    fs.writeFileSync(qrConfigFile, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Error saving QR config:', error);
  }
};

// Handle QR code file upload
const handleQRCodeUpload = async (base64Data, filename) => {
  try {
    // Remove data URL prefix
    const base64Image = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Image, 'base64');
    
    // Generate unique filename
    const timestamp = Date.now();
    const newFilename = `qr-code-${timestamp}.png`;
    const filePath = path.join(__dirname, '..', 'public', newFilename);
    
    // Save the new QR code file
    fs.writeFileSync(filePath, buffer);
    
    return newFilename;
  } catch (error) {
    console.error('Error uploading QR code:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get current QR code configuration
    const config = loadQRConfig();
    return res.status(200).json({
      success: true,
      currentQR: config.currentQR,
      qrHistory: config.qrHistory
    });
  }
  
  if (req.method === 'POST') {
    const { action, qrCodeData, filename } = req.body;
    
    if (action === 'update') {
      try {
        const config = loadQRConfig();
        
        // Upload new QR code
        const newFilename = await handleQRCodeUpload(qrCodeData, filename);
        
        // Update configuration
        const oldQR = config.currentQR;
        config.currentQR = `/${newFilename}`;
        config.qrHistory.unshift({
          filename: oldQR,
          updatedAt: new Date().toISOString(),
          updatedBy: 'admin'
        });
        
        // Keep only last 10 QR codes in history
        config.qrHistory = config.qrHistory.slice(0, 10);
        
        // Save configuration
        saveQRConfig(config);
        
        return res.status(200).json({
          success: true,
          message: 'QR code updated successfully',
          newQR: config.currentQR
        });
      } catch (error) {
        console.error('Error updating QR code:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to update QR code'
        });
      }
    }
    
    return res.status(400).json({
      success: false,
      message: 'Invalid action'
    });
  }
  
  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
} 