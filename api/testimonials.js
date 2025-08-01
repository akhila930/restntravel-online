// Vercel API function for testimonials with persistent storage
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testimonialsFile = path.join(__dirname, '..', 'data', 'testimonials.json');
const dataDir = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load testimonials from file or initialize with defaults
const loadTestimonials = () => {
  try {
    if (fs.existsSync(testimonialsFile)) {
      const data = fs.readFileSync(testimonialsFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading testimonials:', error);
  }
  
  // Default testimonials if file doesn't exist
  const defaultTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing quality products! The organic cotton t-shirt is so comfortable and the bamboo water bottle keeps my drinks cold for hours. Highly recommend RestNTravel!",
      image: "/testimonials/sarah.jpg",
      product: "Clothing",
      date: "2024-07-15",
      is_active: true
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      comment: "Great customer service and fast delivery. The hemp backpack is perfect for my daily commute. Love supporting eco-friendly brands!",
      image: "/testimonials/michael.jpg",
      product: "Bags",
      date: "2024-07-10",
      is_active: true
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 4,
      comment: "The recycled paper notebook is exactly what I needed for my studies. Good quality and environmentally conscious. Will definitely buy more!",
      image: "/testimonials/emily.jpg",
      product: "Stationery",
      date: "2024-07-08",
      is_active: true
    },
    {
      id: 4,
      name: "David Thompson",
      rating: 5,
      comment: "Switched to the bamboo toothbrush and organic soap. My teeth feel cleaner and my skin is healthier. Great sustainable alternatives!",
      image: "/testimonials/david.jpg",
      product: "Personal Care",
      date: "2024-07-05",
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

// Handle file upload (for now, store as base64 in JSON - in production use cloud storage)
const handleFileUpload = async (base64Data, filename, type) => {
  try {
    // For now, we'll store the base64 data directly
    // In production, you should upload to cloud storage (Cloudinary, AWS S3, etc.)
    return `data:${type};base64,${base64Data}`;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const testimonials = loadTestimonials();
      const activeTestimonials = testimonials.filter(t => t.is_active);
      return res.status(200).json({
        success: true,
        testimonials: activeTestimonials
      });
    } catch (error) {
      console.error('Testimonials GET error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to load testimonials'
      });
    }
  }

  if (req.method === 'POST') {
    const { action, testimonialData } = req.body;
    
    if (action === 'add') {
      try {
        const testimonials = loadTestimonials();
        const newTestimonial = {
          ...testimonialData,
          id: testimonials.length + 1,
          date: new Date().toISOString(),
          created_at: new Date().toISOString()
        };
        
        // Handle image upload if provided
        if (testimonialData.imageFile) {
          newTestimonial.image = await handleFileUpload(
            testimonialData.imageFile.data,
            testimonialData.imageFile.name,
            testimonialData.imageFile.type
          );
        }
        
        // Handle video upload if provided
        if (testimonialData.videoFile) {
          newTestimonial.video = await handleFileUpload(
            testimonialData.videoFile.data,
            testimonialData.videoFile.name,
            testimonialData.videoFile.type
          );
        }
        
        testimonials.push(newTestimonial);
        saveTestimonials(testimonials);
        
        return res.status(201).json({
          success: true,
          message: 'Testimonial added successfully'
        });
      } catch (error) {
        console.error('Testimonial add error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to add testimonial'
        });
      }
    }

    if (action === 'update') {
      try {
        const testimonials = loadTestimonials();
        const testimonialIndex = testimonials.findIndex(t => t.id === testimonialData.id);
        
        if (testimonialIndex !== -1) {
          const updatedTestimonial = { ...testimonials[testimonialIndex], ...testimonialData };
          
          // Handle image upload if provided
          if (testimonialData.imageFile) {
            updatedTestimonial.image = await handleFileUpload(
              testimonialData.imageFile.data,
              testimonialData.imageFile.name,
              testimonialData.imageFile.type
            );
          }
          
          // Handle video upload if provided
          if (testimonialData.videoFile) {
            updatedTestimonial.video = await handleFileUpload(
              testimonialData.videoFile.data,
              testimonialData.videoFile.name,
              testimonialData.videoFile.type
            );
          }
          
          testimonials[testimonialIndex] = updatedTestimonial;
          saveTestimonials(testimonials);
          
          return res.status(200).json({
            success: true,
            message: 'Testimonial updated successfully'
          });
        } else {
          return res.status(404).json({
            success: false,
            message: 'Testimonial not found'
          });
        }
      } catch (error) {
        console.error('Testimonial update error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to update testimonial'
        });
      }
    }

    if (action === 'delete') {
      try {
        const testimonials = loadTestimonials();
        const filteredTestimonials = testimonials.filter(t => t.id !== testimonialData.id);
        saveTestimonials(filteredTestimonials);
        
        return res.status(200).json({
          success: true,
          message: 'Testimonial deleted successfully'
        });
      } catch (error) {
        console.error('Testimonial delete error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to delete testimonial'
        });
      }
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
} 