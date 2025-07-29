
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
  image: string;
  video?: string;
  product: string;
  date: string;
  is_active: boolean;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        const data = await response.json();
        
        if (data.success) {
          setTestimonials(data.testimonials);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleVideoPlay = (testimonialId: number) => {
    setPlayingVideo(testimonialId);
  };

  const handleVideoPause = () => {
    setPlayingVideo(null);
  };

  const stats = [
    { number: '100+', label: 'Happy Customers' },
    { number: '4.9/5', label: 'Average Rating' },
    { number: '98%', label: 'Customer Satisfaction' },
    { number: 'Many', label: 'Cities Served' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Customer Testimonials</h1>
          <p className="text-gray-600 text-lg">
            See what our customers have to say about RestNTravel™ products
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Customer Info */}
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg?height=48&width=48';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(testimonial.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {new Date(testimonial.date).toLocaleDateString()}
                  </span>
                </div>

                {/* Product */}
                <div className="mb-3">
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                    {testimonial.product}
                  </span>
                </div>

                {/* Video Testimonial */}
                {testimonial.video && (
                  <div className="mb-4 relative">
                    <video
                      src={testimonial.video}
                      className="w-full h-48 object-cover rounded-lg"
                      controls
                      onPlay={() => handleVideoPlay(testimonial.id)}
                      onPause={handleVideoPause}
                    />
                    {playingVideo === testimonial.id && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                        <Play className="h-3 w-3 inline mr-1" />
                        Playing
                      </div>
                    )}
                  </div>
                )}

                {/* Comment */}
                <p className="text-gray-700 italic whitespace-pre-line">"{testimonial.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto bg-green-50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Join Our Happy Customers
              </h2>
              <p className="text-gray-600 mb-6">
                Experience the comfort and quality of our organic products. 
                Your satisfaction is our priority!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => window.location.href = '/shop'}
                >
                  Shop Now
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/contact'}
                >
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
