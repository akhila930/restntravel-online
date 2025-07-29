
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Heart, Shield, Users, Award, Globe } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: 'Organic & Natural',
      description: 'We use only the finest organic cotton, natural latex, and eco-friendly materials in all our products.'
    },
    {
      icon: <Heart className="h-8 w-8 text-green-600" />,
      title: 'Handcrafted with Love',
      description: 'Each product is carefully handcrafted by skilled artisans who take pride in their work.'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: 'Chemical Free',
      description: 'No harmful chemicals, synthetic materials, or toxic substances are used in our manufacturing process.'
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: 'Community Focused',
      description: 'We support local communities and provide fair employment opportunities to artisans.'
    },
    {
      icon: <Award className="h-8 w-8 text-green-600" />,
      title: 'Quality Assured',
      description: 'Every product undergoes rigorous quality checks to ensure it meets our high standards.'
    },
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      title: 'Sustainable Future',
      description: 'We are committed to creating a sustainable future through eco-conscious manufacturing practices.'
    }
  ];

  const timeline = [
    {
      year: '2024',
      title: 'The Beginning',
      description: 'Inception: Inspired by nature and sustainability, our founders set out to create a pillow unlike any other—one that\'s cool in summer, warm in winter, and gentle on the planet.'
    },
    {
      year: '2024',
      title: 'First Innovation',
      description: 'The Organic Pillow, crafted from biodegradable and recyclable materials like rice husk and other organic fibers, was designed to provide natural support while reducing waste.'
    },
    {
      year: '2024',
      title: 'A Pillow Like No Other',
      description: 'Filled with partially dried rice husks and soft organic fibers, the pillow\'s natural porosity ensures breathability and comfort—keeping you cool during hot seasons and cozy in the cold or monsoon weather.'
    },
    {
      year: '2024',
      title: 'Growing with Purpose',
      description: 'Since launching our first product, we\'ve continued to develop more natural sleep and travel comfort solutions—each reflecting our core belief: rest should be restorative, ethical, and eco-friendly.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Product Image Background */}
      <section 
        className="bg-gradient-to-r from-green-100 to-amber-100 py-16 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('/lovable-uploads/2756c085-7f1e-46da-9615-af344327af7d.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">Our Story</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Founded in 2024, RestNTravel™ was born from a simple yet powerful vision: 
              to bring nature's pure essence into everyday rest. Our journey began with one groundbreaking product—the Organic Pillow.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement with Product Images */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4 text-lg">
                At RestNTravel™, we believe that good sleep and comfort shouldn't come at the cost of our planet's health. 
                Our mission is to create premium organic comfort products that provide exceptional rest while supporting 
                sustainable practices.
              </p>
              <p className="text-gray-600 mb-4">
                This unique blend delivers gentle neck and back support, while aligning with our ethos of health, 
                wellness, and sustainable living. Every item we make carries the DNA of that first pillow—designed 
                thoughtfully, rooted in nature, and crafted for mindful living.
              </p>
            </div>
            <div className="relative">
              <img
                src="/lovable-uploads/b54036c1-98d4-4297-a868-25194c0c43bb.png"
                alt="Our natural jute pillow with sunflower"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600 text-lg">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Journey</h2>
            <p className="text-gray-600 text-lg">
              From vision to reality - the RestNTravel™ story
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-200"></div>
            
            {timeline.map((item, index) => (
              <div key={index} className={`flex items-center mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="text-lg font-bold text-green-600 mb-2">🌱 {item.year}</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="w-4 h-4 bg-green-600 rounded-full relative z-10"></div>
                <div className="flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🛌 A Pillow Like No Other</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Filled with partially dried rice husks and soft organic fibers, the pillow's natural porosity 
              ensures breathability and comfort—keeping you cool during hot seasons and cozy in the cold or monsoon weather.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <img
                src="/lovable-uploads/6b05d0cd-03f7-48bc-a464-28d2141730d6.png"
                alt="Natural jute pillow with flowers"
                className="rounded-lg shadow-lg mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">Natural Beauty</h3>
            </div>
            <div className="text-center">
              <img
                src="/lovable-uploads/9db5b207-5caa-40d7-8183-f8b39e6dd3b6.png"
                alt="Organic pillows with blue flowers"
                className="rounded-lg shadow-lg mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">Comfort & Style</h3>
            </div>
            <div className="text-center">
              <img
                src="/lovable-uploads/4f929f3a-a4fa-4bb1-91a2-913d9657d314.png"
                alt="Cat resting on organic pillow"
                className="rounded-lg shadow-lg mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">Pure Comfort</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Philosophy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sustainable Living</h3>
                <p className="text-gray-600 mb-4">
                  We believe that sustainable living is not just a choice, but a responsibility. 
                  Our products are designed to last longer, reducing waste and promoting a circular economy.
                </p>
                <p className="text-gray-600">
                  By choosing natural materials and traditional crafting methods, we create products 
                  that are biodegradable and leave minimal environmental footprint.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Healthy Living</h3>
                <p className="text-gray-600 mb-4">
                  Your health and well-being are our top priorities. We ensure that all our products 
                  are free from harmful chemicals, synthetic materials, and toxic substances.
                </p>
                <p className="text-gray-600">
                  Natural materials like organic cotton, rice husk, and jute are not only comfortable 
                  but also hypoallergenic and breathable, promoting better sleep and overall health.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🌿 Join Our Mission</h2>
          <p className="text-xl mb-8">
            Be part of the movement towards sustainable, healthy living. 
            Experience the difference that organic comfort can make in your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Our Products
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
