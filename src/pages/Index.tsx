
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, Shield, Heart, Star, ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import products from '../productsData';

const Index = () => {
  // Replace the featuredProducts array with a filtered/sliced version from products
  const featuredProducts = products.slice(0, 3); // or select by id/category as needed

  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: '100% Organic',
      description: 'Made with rice husk, organic cotton, and natural fibers'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: 'Chemical Free',
      description: 'No harmful chemicals or synthetic materials used'
    },
    {
      icon: <Heart className="h-8 w-8 text-green-600" />,
      title: 'Handcrafted',
      description: 'Each product is lovingly handcrafted by skilled artisans'
    }
  ];

  const testimonials = [
    {
      name: 'Suchitra Patra',
      rating: 5,
      comment: `My Experience with Rest N Travel’s Eco-Friendly Pillow\n\nI recently used the eco-friendly pillow from Rest N Travel, and I’m truly impressed! Not only is it made from sustainable materials, but it also has a gentle, soothing fragrance that instantly makes you feel relaxed and refreshed.\n\nWhat really touched me was how much it helped my grandmother. She has been dealing with back pain for years, and after using this pillow for just a few days, she said the pain had noticeably reduced. It’s soft, supportive, and perfectly designed for comfort.\n\nIf you're looking for a pillow that supports your well-being and cares for the planet too, I highly recommend Rest N Travel. It’s more than just a pillow — it’s a feel-good experience!`,
      image: '/placeholder.svg?height=60&width=60',
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-20 md:py-32 bg-gradient-to-r from-green-100 to-amber-100 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('/lovable-uploads/ad284249-75de-4e86-8db8-f0ba8165716b.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img 
                src="/NatureTech SimpleInventions Pvt Ltd  (Only Logo).png" 
                alt="RestNTravel Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-6">
              RestNTravel™
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Organic Comfort for Every Journey
            </p>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Experience nature's pure essence in every rest with our handcrafted organic pillows, 
              made from rice husk and natural fibers for ultimate comfort.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Link to="/shop">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose RestNTravel™?</h2>
            <p className="text-gray-600 text-lg">Natural comfort that's good for you and the planet</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg">Discover our most popular organic comfort products</p>
          </div>

          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <img
                        src={`/Products/${product.image}`}
                        alt={product.name}
                        className="w-full h-48 object-contain bg-white rounded-lg mb-4 p-2 border"
                      />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-2xl font-bold text-green-600 mb-4">{product.price}</p>
                      <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                        <Link to={`/product/${product.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
              <Link to="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 text-lg">Real experiences from our satisfied customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center justify-center space-x-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
              <Link to="/testimonials">Read More Reviews</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Natural Comfort?</h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied customers who have chosen organic, sustainable comfort.
          </p>
          <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
            <Link to="/shop">Start Shopping</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
