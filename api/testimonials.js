// Vercel API function for testimonials
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const testimonials = [
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

    return res.status(200).json({
      success: true,
      testimonials: testimonials.filter(t => t.is_active)
    });

  } catch (error) {
    console.error('Testimonials API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load testimonials'
    });
  }
} 