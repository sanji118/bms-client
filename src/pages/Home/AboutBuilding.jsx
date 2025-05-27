import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { 
  Landmark,
  MapPin,
  Waves,
  Home,
  Award,
  Leaf,
  ShieldCheck,
  Sun
} from 'lucide-react';

const AboutBuilding = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const features = [
    {
      title: "Architectural Marvel",
      description: "Designed by award-winning architects with sustainable materials.",
      icon: <Landmark className="w-6 h-6" />
    },
    {
      title: "Prime Location",
      description: "Heart of the city with access to business and entertainment districts.",
      icon: <MapPin className="w-6 h-6" />
    },
    {
      title: "Luxury Amenities",
      description: "Rooftop pool, fitness center, and 24/7 concierge service.",
      icon: <Waves className="w-6 h-6" />
    },
    {
      title: "Smart Living",
      description: "Smart home technology for security and energy efficiency.",
      icon: <Home className="w-6 h-6" />
    },
    {
      title: "Award-Winning Design",
      description: "Recognized for innovative architecture and sustainable practices.",
      icon: <Award className="w-6 h-6" />
    },
    {
      title: "Eco-Friendly",
      description: "Green building certified with energy-efficient systems.",
      icon: <Leaf className="w-6 h-6" />
    }
  ];

  return (
    <section ref={ref} className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            About The <span className="text-yellow-600">Building</span>
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto"></div>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-xl overflow-hidden shadow-2xl h-full min-h-[400px]"
          >
            <img 
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="Luxury Building" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/20 flex items-end p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-white"
              >
                <div className="flex items-center mb-2">
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  <span className="font-medium">Certified Luxury Residence</span>
                </div>
                <div className="flex items-center">
                  <Sun className="w-5 h-5 mr-2" />
                  <span className="font-medium">24/7 Natural Light Design</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Text */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-3xl font-serif font-semibold text-gray-800 mb-6">
              A Masterpiece of <span className="text-yellow-600">Modern Architecture</span>
            </h3>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg text-gray-600 leading-relaxed mb-8"
            >
              Our award-winning building redefines urban luxury living through innovative design 
              and exceptional craftsmanship. Each element has been meticulously curated to create 
              spaces that inspire while prioritizing sustainability and comfort.
            </motion.p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-2 bg-indigo-50 rounded-full text-yellow-600 mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-1">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Signature */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="mt-10 pt-6 border-t border-gray-200"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-yellow-600 mr-4">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-700 italic font-serif">
                    "Where innovative design meets sustainable living"
                  </p>
                  <p className="text-sm text-gray-500 mt-1">- Architectural Digest, 2023</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutBuilding;