import fs from 'fs';
import path from 'path';

// Simple QR code data (base64 encoded 1x1 pixel PNG)
const qrCodeBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

// Convert base64 to buffer and save as PNG
const qrCodeBuffer = Buffer.from(qrCodeBase64, 'base64');
const qrCodePath = path.join(process.cwd(), 'public', 'payment-qr.png');

fs.writeFileSync(qrCodePath, qrCodeBuffer);
console.log('✅ QR code image created:', qrCodePath); 