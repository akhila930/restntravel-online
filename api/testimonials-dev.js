// Development Testimonials Management API
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Testimonials configuration file
const testimonialsFile = path.join(__dirname, '..', 'data', 'testimonials.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load testimonials from file or initialize with default
const loadTestimonials = () => {
  try {
    if (fs.existsSync(testimonialsFile)) {
      const data = fs.readFileSync(testimonialsFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading testimonials:', error);
  }
  
  // Initialize with default testimonial
  const defaultTestimonials = [
    {
      id: 1,
      name: 'Suchitra Patra',
      rating: 5,
      comment: `My Experience with Rest N Travel's Eco-Friendly Pillow\n\nI recently used the eco-friendly pillow from Rest N Travel, and I'm truly impressed! Not only is it made from sustainable materials, but it also has a gentle, soothing fragrance that instantly makes you feel relaxed and refreshed.\n\nWhat really touched me was how much it helped my grandmother. She has been dealing with back pain for years, and after using this pillow for just a few days, she said the pain had noticeably reduced. It's soft, supportive, and perfectly designed for comfort.\n\nIf you're looking for a pillow that supports your well-being and cares for the planet too, I highly recommend Rest N Travel. It's more than just a pillow — it's a feel-good experience!`,
      image: '/placeholder.svg?height=80&width=80',
      video: null,
      product: 'Eco-Friendly Pillow',
      date: new Date().toISOString(),
      is_active: true
    }
  ];
  
  saveTestimonials(defaultTestimonials);
  return defaultTestimonials;
};

// Save testimonials to file
const saveTestimonials = (testimonials) => {
  try {
    fs.writeFileSync(testimonialsFile, JSON.stringify(testimonials, null, 2));
  } catch (error) {
    console.error('Error saving testimonials:', error);
  }
};

// Handle file upload (image or video)
const handleFileUpload = async (base64Data, filename, type) => {
  try {
    // Remove data URL prefix
    const base64File = base64Data.replace(/^data:(image|video)\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64File, 'base64');
    
    // Generate unique filename
    const timestamp = Date.now();
    const extension = filename.split('.').pop();
    const newFilename = `${type}-${timestamp}.${extension}`;
    const filePath = path.join(__dirname, '..', 'public', newFilename);
    
    // Save the file
    fs.writeFileSync(filePath, buffer);
    
    return `/${newFilename}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get all testimonials (for public display)
    const testimonials = loadTestimonials();
    const activeTestimonials = testimonials.filter(t => t.is_active);
    
    return res.status(200).json({
      success: true,
      testimonials: activeTestimonials
    });
  }
  
  if (req.method === 'POST') {
    const { action, testimonialData } = req.body;
    
    if (action === 'add') {
      try {
        const testimonials = loadTestimonials();
        
        // Handle file uploads
        let imagePath = testimonialData.image || '/placeholder.svg?height=80&width=80';
        let videoPath = null;
        
        if (testimonialData.imageFile) {
          imagePath = await handleFileUpload(
            testimonialData.imageFile.base64,
            testimonialData.imageFile.filename,
            'testimonial-image'
          );
        }
        
        if (testimonialData.videoFile) {
          videoPath = await handleFileUpload(
            testimonialData.videoFile.base64,
            testimonialData.videoFile.filename,
            'testimonial-video'
          );
        }
        
        // Create new testimonial
        const newTestimonial = {
          id: testimonials.length + 1,
          name: testimonialData.name,
          rating: parseInt(testimonialData.rating),
          comment: testimonialData.comment,
          image: imagePath,
          video: videoPath,
          product: testimonialData.product,
          date: new Date().toISOString(),
          is_active: testimonialData.is_active !== false
        };
        
        testimonials.push(newTestimonial);
        saveTestimonials(testimonials);
        
        return res.status(200).json({
          success: true,
          message: 'Testimonial added successfully',
          testimonial: newTestimonial
        });
      } catch (error) {
        console.error('Error adding testimonial:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to add testimonial'
        });
      }
    }
    
    if (action === 'update') {
      try {
        const testimonials = loadTestimonials();
        const testimonial = testimonials.find(t => t.id === parseInt(testimonialData.id));
        
        if (!testimonial) {
          return res.status(404).json({
            success: false,
            message: 'Testimonial not found'
          });
        }
        
        // Handle file uploads
        if (testimonialData.imageFile) {
          testimonial.image = await handleFileUpload(
            testimonialData.imageFile.base64,
            testimonialData.imageFile.filename,
            'testimonial-image'
          );
        }
        
        if (testimonialData.videoFile) {
          testimonial.video = await handleFileUpload(
            testimonialData.videoFile.base64,
            testimonialData.videoFile.filename,
            'testimonial-video'
          );
        }
        
        // Update testimonial data
        testimonial.name = testimonialData.name;
        testimonial.rating = parseInt(testimonialData.rating);
        testimonial.comment = testimonialData.comment;
        testimonial.product = testimonialData.product;
        testimonial.is_active = testimonialData.is_active !== false;
        
        saveTestimonials(testimonials);
        
        return res.status(200).json({
          success: true,
          message: 'Testimonial updated successfully',
          testimonial
        });
      } catch (error) {
        console.error('Error updating testimonial:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to update testimonial'
        });
      }
    }
    
    if (action === 'delete') {
      try {
        const testimonials = loadTestimonials();
        const testimonialId = parseInt(testimonialData.id);
        const testimonialIndex = testimonials.findIndex(t => t.id === testimonialId);
        
        if (testimonialIndex === -1) {
          return res.status(404).json({
            success: false,
            message: 'Testimonial not found'
          });
        }
        
        testimonials.splice(testimonialIndex, 1);
        saveTestimonials(testimonials);
        
        return res.status(200).json({
          success: true,
          message: 'Testimonial deleted successfully'
        });
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to delete testimonial'
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