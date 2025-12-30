import React from 'react';
import { motion } from 'framer-motion';
import {
  FaCode,
  FaSearch,
  FaChartLine,
  FaMobile,
  FaShoppingCart,
  FaBullhorn,
  FaPalette,
  FaCloud,
  FaShieldAlt,
  FaRocket,
} from 'react-icons/fa';

const Services = () => {
  const services = [
    {
      icon: <FaCode className="text-4xl" />,
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies. Responsive, fast, and scalable solutions tailored to your business needs.',
      detailedDescription: 'From simple landing pages to complex web applications, we build solutions that work seamlessly across all devices. Our web development services include frontend design, backend architecture, database integration, and third-party API connections.',
      features: ['React.js & Next.js', 'Node.js Backend', 'Full-Stack Solutions', 'API Integration', 'Responsive Design', 'Performance Optimization'],
      benefits: ['Faster Load Times', 'Better User Experience', 'Scalable Architecture', 'SEO Friendly'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FaMobile className="text-4xl" />,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android. High-performance apps with excellent user experience.',
      detailedDescription: 'We develop native and cross-platform mobile applications that deliver exceptional performance. Whether you need an Android app, iOS app, or both, we create solutions that users love and businesses trust.',
      features: ['Android Development', 'iOS Development', 'React Native', 'Flutter', 'App Store Optimization', 'Push Notifications'],
      benefits: ['Native Performance', 'Cross-Platform Support', 'Play Store Ready', 'Regular Updates'],
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <FaSearch className="text-4xl" />,
      title: 'SEO Optimization',
      description: 'Improve your search engine rankings and drive organic traffic. Comprehensive SEO strategies for better online visibility.',
      detailedDescription: 'Our SEO services help your website rank higher on search engines, driving organic traffic and increasing conversions. We use proven strategies including keyword optimization, technical SEO, content marketing, and link building.',
      features: ['Keyword Research', 'On-Page SEO', 'Technical SEO', 'Link Building', 'Content Optimization', 'Local SEO'],
      benefits: ['Higher Rankings', 'More Organic Traffic', 'Better Visibility', 'Increased Conversions'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: 'Digital Marketing',
      description: 'Data-driven marketing strategies to grow your business. Social media, content marketing, and PPC campaigns.',
      detailedDescription: 'We create and execute comprehensive digital marketing campaigns that drive results. From social media management to paid advertising, our strategies are data-driven and optimized for maximum ROI.',
      features: ['Social Media Marketing', 'Content Marketing', 'PPC Advertising', 'Analytics', 'Email Marketing', 'Influencer Marketing'],
      benefits: ['Increased Brand Awareness', 'Higher Engagement', 'Better ROI', 'Data-Driven Insights'],
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: <FaShoppingCart className="text-4xl" />,
      title: 'E-Commerce Solutions',
      description: 'Complete e-commerce platforms with payment integration, inventory management, and order tracking systems.',
      detailedDescription: 'Build a powerful online store that converts visitors into customers. We create secure, scalable e-commerce platforms with integrated payment gateways, inventory management, and comprehensive analytics.',
      features: ['Online Stores', 'Payment Gateways', 'Inventory Management', 'Order Tracking', 'Shopping Cart', 'Product Management'],
      benefits: ['Secure Payments', 'Easy Management', 'Mobile Optimized', 'Analytics Dashboard'],
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: <FaBullhorn className="text-4xl" />,
      title: 'Brand Marketing',
      description: 'Build a strong brand identity and increase brand awareness. Creative campaigns that resonate with your audience.',
      detailedDescription: 'We help you build a memorable brand that stands out in the market. From brand strategy to creative campaigns, we ensure your brand message resonates with your target audience and drives loyalty.',
      features: ['Brand Strategy', 'Creative Design', 'Campaign Management', 'Brand Guidelines', 'Logo Design', 'Brand Identity'],
      benefits: ['Strong Brand Identity', 'Increased Awareness', 'Customer Loyalty', 'Market Differentiation'],
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <FaPalette className="text-4xl" />,
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interfaces that enhance user experience. User-centered design for maximum engagement.',
      detailedDescription: 'Great design is more than just aesthetics. We create user-centered designs that are not only beautiful but also intuitive, accessible, and optimized for conversions. Our design process includes user research, wireframing, prototyping, and testing.',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'User Testing', 'Accessibility'],
      benefits: ['Better User Experience', 'Higher Conversions', 'Reduced Bounce Rate', 'Accessible Design'],
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: <FaCloud className="text-4xl" />,
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and deployment. AWS, Azure, and Google Cloud solutions for your business.',
      detailedDescription: 'Migrate to the cloud or optimize your existing cloud infrastructure. We provide scalable, secure, and cost-effective cloud solutions using AWS, Azure, and Google Cloud Platform with DevOps best practices.',
      features: ['Cloud Migration', 'DevOps', 'Serverless Architecture', 'CI/CD', 'Containerization', 'Auto Scaling'],
      benefits: ['Scalability', 'Cost Efficiency', 'High Availability', 'Automated Deployments'],
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'Security & Maintenance',
      description: 'Keep your applications secure and up-to-date. Regular updates, security audits, and performance optimization.',
      detailedDescription: 'Protect your digital assets with comprehensive security measures and keep your applications running smoothly with regular maintenance. We provide 24/7 monitoring, security audits, performance optimization, and timely updates.',
      features: ['Security Audits', 'Performance Optimization', 'Regular Updates', '24/7 Support', 'Backup Solutions', 'Monitoring'],
      benefits: ['Enhanced Security', 'Better Performance', 'Reduced Downtime', 'Peace of Mind'],
      color: 'from-red-500 to-pink-500',
    },
  ];

  return (
    <section id="services" className="section-container bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle max-w-3xl mx-auto">
          Comprehensive digital solutions to help your business grow. From web development to digital marketing,
          we provide end-to-end services tailored to your needs.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            {/* Gradient Header */}
            <div className={`bg-gradient-to-r ${service.color} p-6 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
              <p className="text-gray-500 mb-6 text-xs leading-relaxed">{service.detailedDescription}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaRocket className="text-primary-600" />
                    Key Features:
                  </h4>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.color}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaChartLine className="text-green-600" />
                    Benefits:
                  </h4>
                  <div className="space-y-2">
                    {service.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 md:p-12 text-center text-white"
      >
        <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Project?</h3>
        <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
          Let's discuss how we can help bring your vision to life. Get in touch for a free consultation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Get Started
          </a>
          <a
            href="#meeting"
            className="px-8 py-4 bg-white/10 text-white border-2 border-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            Book Consultation
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Services;

