import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGooglePlay, FaQrcode, FaTv, FaFilePdf, FaStar, FaDownload, FaVolumeUp, FaEnvelope, FaBook, FaMusic, FaFolder, FaGlobe, FaLaptopCode, FaStore, FaHospital, FaHome, FaUserMd, FaShoppingBag, FaBriefcase, FaMobile, FaCode, FaImage } from 'react-icons/fa';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'android', 'web'

  const projects = [
    {
      name: 'QR & Barcode Scanner',
      developer: 'Digital Optimistic',
      description: 'A versatile app that allows users to scan QR codes and barcodes effortlessly. Features auto-recognition, batch scanning, and a QR code generator for creating custom codes.',
      icon: <FaQrcode className="text-5xl" />,
      category: 'Productivity',
      rating: 4.5,
      reviews: 1250,
      downloads: '50M+',
      price: 'Free',
      tech: ['Kotlin', 'CameraX', 'ML Kit', 'Room DB'],
      playStore: 'https://play.google.com/store/apps/details?id=com.appswing.qr.barcodescanner.barcodereader',
    },
    {
      name: 'PDF Scanner - Document Scanner',
      developer: 'Digital Optimistic',
      description: 'Transform your Android device into a powerful portable scanner. High-quality scanning, image-to-PDF conversion, OCR for text extraction, and secure document management.',
      icon: <FaFilePdf className="text-5xl" />,
      category: 'Productivity',
      rating: 4.5,
      reviews: 1800,
      downloads: '50M+',
      price: 'Free',
      tech: ['Kotlin', 'OCR', 'PDF Library', 'Image Processing'],
      playStore: 'https://play.google.com/store/apps/details?id=com.camscanner.documentscanner.pdfscanner.textscanner.photos.scanner',
    },
    {
      name: 'Volume Booster - Sound Booster',
      developer: 'Digital Optimistic',
      description: 'Enhance your device\'s audio output with sound equalizer, bass booster, and volume amplifier. Supports various media types with high-quality sound enhancement.',
      icon: <FaVolumeUp className="text-5xl" />,
      category: 'Music & Audio',
      rating: 4.4,
      reviews: 950,
      downloads: '5M+',
      price: 'Free',
      tech: ['Kotlin', 'Audio Processing', 'Equalizer', 'Media Player'],
      playStore: 'https://play.google.com/store/apps/details?id=volumebooster.bassbooster.sound.speaker.equalizer',
    },
    {
      name: 'Universal TV Remote Control',
      developer: 'Digital Optimistic',
      description: 'Control your smart TV using your Android device. Supports multiple TV brands with both Wi-Fi and IR functionalities for seamless connectivity.',
      icon: <FaTv className="text-5xl" />,
      category: 'Tools',
      rating: 4.3,
      reviews: 3200,
      downloads: '1M+',
      price: 'Free',
      tech: ['Kotlin', 'IR Blaster', 'Wi-Fi', 'Device Database'],
      playStore: 'https://play.google.com/store/apps/details?id=com.universal.tv.remote.control.smart.tv.remote.controller',
    },
    {
      name: 'Recover Deleted Messages',
      developer: 'Digital Optimistic',
      description: 'Retrieve deleted messages and media from various messaging apps without triggering read notifications. Includes status saver feature for added convenience.',
      icon: <FaEnvelope className="text-5xl" />,
      category: 'Tools',
      rating: 4.6,
      reviews: 2100,
      downloads: '10M+',
      price: 'Free',
      tech: ['Kotlin', 'Notification Access', 'File Recovery', 'Media Store'],
      playStore: 'https://play.google.com/store/apps/details?id=recovermessages.restoredeleteddata.recoverdata.notifyme',
    },
    {
      name: 'Quran Majeed - القرآن الكريم',
      developer: 'Digital Optimistic',
      description: 'An authentic Islamic app providing the full Arabic text of the Quran, audio recitations, translations, prayer times, and an Islamic calendar to enhance your worship experience.',
      icon: <FaBook className="text-5xl" />,
      category: 'Education',
      rating: 4.7,
      reviews: 3500,
      downloads: '100k+',
      price: 'Free',
      tech: ['Kotlin', 'Audio Player', 'Database', 'Notifications'],
      playStore: 'https://play.google.com/store/apps/details?id=quran.holyquran.alquranapp',
    },
    {
      name: 'Music Player - MP3 Player',
      developer: 'Digital Optimistic',
      description: 'A feature-rich music player supporting various audio formats, offering an equalizer, playlist management, and a user-friendly interface for an enhanced listening experience.',
      icon: <FaMusic className="text-5xl" />,
      category: 'Music & Audio',
      rating: 4.5,
      reviews: 1200,
      downloads: '1M+',
      price: 'Free',
      tech: ['Kotlin', 'Media Player', 'Equalizer', 'Playlist Management'],
      playStore: 'https://play.google.com/store/apps/details?id=musicplayer.mp3player.audioplayer',
    },
    {
      name: 'File Manager - File Explorer',
      developer: 'Digital Optimistic',
      description: 'Manage your files efficiently with file categorization, storage analysis, compression, extraction, and support for various file formats with an intuitive interface.',
      icon: <FaFolder className="text-5xl" />,
      category: 'Productivity',
      rating: 4.4,
      reviews: 1800,
      downloads: '10M+',
      price: 'Free',
      tech: ['Kotlin', 'File System', 'Storage Analysis', 'File Operations'],
      playStore: 'https://play.google.com/store/apps/details?id=com.filemanager.managefile.fileexplorer.fileextractor',
    },
    // SolTekkers Web Development Projects
    {
      name: 'Therapist Visa',
      developer: 'Digital Optimistic',
      description: 'Professional visa application platform for therapists with streamlined documentation, appointment scheduling, and application tracking features.',
      icon: <FaUserMd className="text-5xl" />,
      category: 'Web Development',
      rating: 4.8,
      reviews: 150,
      downloads: 'Web App',
      price: 'Live',
      tech: ['React.js', 'Node.js', 'MongoDB', 'Payment Gateway'],
      playStore: 'https://therapistvisa.com/',
      isWebProject: true,
    },
    {
      name: 'Top Webs BTC',
      developer: 'Digital Optimistic',
      description: 'Business technology consulting website with service portfolio, client testimonials, and contact management system.',
      icon: <FaGlobe className="text-5xl" />,
      category: 'Web Development',
      rating: 4.7,
      reviews: 190,
      downloads: 'Web App',
      price: 'Live',
      tech: ['Next.js', 'Business Website', 'SEO', 'Contact Forms'],
      playStore: 'https://topwebsbtc.com/',
      isWebProject: true,
    },
    {
      name: 'Glow and Wear',
      developer: 'Digital Optimistic',
      description: 'E-commerce platform for beauty and fashion products with advanced filtering, wishlist, and secure checkout system.',
      icon: <FaShoppingBag className="text-5xl" />,
      category: 'Web Development',
      rating: 4.7,
      reviews: 230,
      downloads: 'Web App',
      price: 'Live',
      tech: ['React.js', 'E-Commerce', 'Stripe', 'Inventory Management'],
      playStore: 'https://glowandwear.com/',
      isWebProject: true,
    },
    {
      name: 'Tob Webs',
      developer: 'Digital Optimistic',
      description: 'Modern business website with responsive design, SEO optimization, and integrated contact forms for lead generation.',
      icon: <FaGlobe className="text-5xl" />,
      category: 'Web Development',
      rating: 4.6,
      reviews: 180,
      downloads: 'Web App',
      price: 'Live',
      tech: ['Next.js', 'Tailwind CSS', 'SEO', 'Contact Forms'],
      playStore: 'https://topwebsbtc.com/',
      isWebProject: true,
    },
    {
      name: 'Maddy Store',
      developer: 'Digital Optimistic',
      description: 'Full-featured online store with product catalog, shopping cart, payment integration, and order management system.',
      icon: <FaStore className="text-5xl" />,
      category: 'Web Development',
      rating: 4.9,
      reviews: 320,
      downloads: 'Web App',
      price: 'Live',
      tech: ['React.js', 'E-Commerce', 'Payment Gateway', 'Order Tracking'],
      playStore: 'https://maddystore.pk/',
      isWebProject: true,
    },
    {
      name: 'Digital Abouts',
      developer: 'Digital Optimistic',
      description: 'Digital marketing agency website showcasing services, portfolio, and client testimonials with modern UI/UX design.',
      icon: <FaBriefcase className="text-5xl" />,
      category: 'Web Development',
      rating: 4.7,
      reviews: 195,
      downloads: 'Web App',
      price: 'Live',
      tech: ['React.js', 'UI/UX Design', 'Portfolio', 'CMS'],
      playStore: 'https://digitalabouts.com/',
      isWebProject: true,
    },
    {
      name: 'Baba Hakeem',
      developer: 'Digital Optimistic',
      description: 'Healthcare information platform providing medical resources, appointment booking, and health consultation services.',
      icon: <FaUserMd className="text-5xl" />,
      category: 'Web Development',
      rating: 4.8,
      reviews: 145,
      downloads: 'Web App',
      price: 'Live',
      tech: ['React.js', 'Healthcare', 'Appointment System', 'Database'],
      playStore: 'http://babahakeem.com/',
      isWebProject: true,
    },
    {
      name: 'EPSCC Rehab',
      developer: 'Digital Optimistic',
      description: 'Rehabilitation center website with patient portal, appointment scheduling, and treatment information management.',
      icon: <FaHospital className="text-5xl" />,
      category: 'Web Development',
      rating: 4.9,
      reviews: 210,
      downloads: 'Web App',
      price: 'Live',
      tech: ['React.js', 'Healthcare', 'Patient Portal', 'Scheduling'],
      playStore: 'https://www.epsccrehab.com/',
      isWebProject: true,
    },
    {
      name: 'MT Unite',
      developer: 'Digital Optimistic',
      description: 'Business collaboration platform connecting teams with project management, communication tools, and file sharing.',
      icon: <FaBriefcase className="text-5xl" />,
      category: 'Web Development',
      rating: 4.6,
      reviews: 175,
      downloads: 'Web App',
      price: 'Live',
      tech: ['React.js', 'Collaboration', 'Project Management', 'Real-time'],
      playStore: 'https://mtunite.com/',
      isWebProject: true,
    },
    {
      name: 'Golden Maple Homes',
      developer: 'Digital Optimistic',
      description: 'Real estate platform featuring property listings, virtual tours, mortgage calculator, and agent contact system.',
      icon: <FaHome className="text-5xl" />,
      category: 'Web Development',
      rating: 4.8,
      reviews: 280,
      downloads: 'Web App',
      price: 'Live',
      tech: ['React.js', 'Real Estate', 'Property Listings', 'Virtual Tours'],
      playStore: 'https://goldenmaplehome.com/',
      isWebProject: true,
    },
    {
      name: 'Ayesha Health And Foundation',
      developer: 'Digital Optimistic',
      description: 'Non-profit organization website with donation system, event management, volunteer registration, and impact stories.',
      icon: <FaHospital className="text-5xl" />,
      category: 'Web Development',
      rating: 4.9,
      reviews: 165,
      downloads: 'Web App',
      price: 'Live',
      tech: ['React.js', 'Non-Profit', 'Donation System', 'Event Management'],
      playStore: 'https://aaishahealthedu.org/',
      isWebProject: true,
    },
    // New Web Projects
    {
      name: 'iLovePDF',
      developer: 'Digital Optimistic',
      description: 'Online PDF tools platform offering PDF conversion, merging, splitting, compression, and editing capabilities.',
      icon: <FaFilePdf className="text-5xl" />,
      category: 'Web Development',
      rating: 4.8,
      reviews: 1250,
      downloads: 'Web App',
      price: 'Live',
      tech: ['React.js', 'PDF Processing', 'File Conversion', 'Cloud Storage'],
      playStore: 'https://ilovepdf.biz/',
      isWebProject: true,
    },
    {
      name: 'PDF24',
      developer: 'Digital Optimistic',
      description: 'Comprehensive PDF solution with AI-powered features for document processing, conversion, and optimization.',
      icon: <FaFilePdf className="text-5xl" />,
      category: 'Web Development',
      rating: 4.9,
      reviews: 980,
      downloads: 'Web App',
      price: 'Live',
      tech: ['AI Integration', 'PDF Tools', 'Document Processing', 'React.js'],
      playStore: 'https://pdf24.ai/',
      isWebProject: true,
    },
    {
      name: 'PDF Convertly',
      developer: 'Digital Optimistic',
      description: 'Fast and reliable PDF conversion service supporting multiple formats with batch processing capabilities.',
      icon: <FaFilePdf className="text-5xl" />,
      category: 'Web Development',
      rating: 4.7,
      reviews: 750,
      downloads: 'Web App',
      price: 'Live',
      tech: ['Next.js', 'PDF Conversion', 'Batch Processing', 'API Integration'],
      playStore: 'https://pdfconvertly.com/',
      isWebProject: true,
    },
    {
      name: 'SmallPDF Converter',
      developer: 'Digital Optimistic',
      description: 'AI-powered PDF converter with smart compression, OCR, and advanced document manipulation features.',
      icon: <FaFilePdf className="text-5xl" />,
      category: 'Web Development',
      rating: 4.8,
      reviews: 1100,
      downloads: 'Web App',
      price: 'Live',
      tech: ['AI/ML', 'PDF Tools', 'OCR Technology', 'React.js'],
      playStore: 'https://Smallpdfconverter.ai/',
      isWebProject: true,
    },
    {
      name: 'Image Compressor',
      developer: 'Digital Optimistic',
      description: 'Online image compression tool that reduces file size while maintaining quality, supporting multiple formats.',
      icon: <FaImage className="text-5xl" />,
      category: 'Web Development',
      rating: 4.6,
      reviews: 850,
      downloads: 'Web App',
      price: 'Live',
      tech: ['Image Processing', 'Compression Algorithms', 'React.js', 'Cloud Storage'],
      playStore: 'https://imagecompressor.com/',
      isWebProject: true,
    },
    {
      name: 'Mirha Couture',
      developer: 'Digital Optimistic',
      description: 'Fashion e-commerce platform showcasing designer collections with virtual try-on and personalized styling features.',
      icon: <FaShoppingBag className="text-5xl" />,
      category: 'Web Development',
      rating: 4.9,
      reviews: 420,
      downloads: 'Web App',
      price: 'Live',
      tech: ['E-Commerce', 'Fashion Platform', 'Virtual Try-On', 'React.js'],
      playStore: 'https://mirhacouture.com/',
      isWebProject: true,
    },
    {
      name: 'Astral Heaven Realty',
      developer: 'Digital Optimistic',
      description: 'Real estate platform with property listings, virtual tours, mortgage calculator, and agent matching system.',
      icon: <FaHome className="text-5xl" />,
      category: 'Web Development',
      rating: 4.8,
      reviews: 320,
      downloads: 'Web App',
      price: 'Live',
      tech: ['Real Estate', 'Property Listings', 'Virtual Tours', 'Next.js'],
      playStore: 'https://astralheavenrealty.com/',
      isWebProject: true,
    },
    {
      name: 'Green Crockery',
      developer: 'Digital Optimistic',
      description: 'E-commerce platform for eco-friendly kitchenware and crockery with sustainable product catalog and ordering system.',
      icon: <FaShoppingBag className="text-5xl" />,
      category: 'Web Development',
      rating: 4.7,
      reviews: 280,
      downloads: 'Web App',
      price: 'Live',
      tech: ['E-Commerce', 'Product Catalog', 'Payment Gateway', 'React.js'],
      playStore: 'https://greencrockery.com.pk/',
      isWebProject: true,
    },
    {
      name: 'iLovePDF 6',
      developer: 'Digital Optimistic',
      description: 'Advanced PDF toolkit with enhanced features for document management, editing, and collaboration.',
      icon: <FaFilePdf className="text-5xl" />,
      category: 'Web Development',
      rating: 4.8,
      reviews: 650,
      downloads: 'Web App',
      price: 'Live',
      tech: ['PDF Tools', 'Document Management', 'Collaboration', 'React.js'],
      playStore: 'https://ilovepdf6.com/',
      isWebProject: true,
    },
    {
      name: 'Noorishay',
      developer: 'Digital Optimistic',
      description: 'E-commerce platform with modern design, product catalog, shopping cart, and secure payment processing.',
      icon: <FaShoppingBag className="text-5xl" />,
      category: 'Web Development',
      rating: 4.8,
      reviews: 340,
      downloads: 'Web App',
      price: 'Live',
      tech: ['E-Commerce', 'Product Catalog', 'Payment Gateway', 'React.js'],
      playStore: 'https://noorishay.com/',
      isWebProject: true,
    },
    {
      name: 'Barkat Fabrics',
      developer: 'Digital Optimistic',
      description: 'Textile and fabric e-commerce platform with product showcase, custom ordering, and inventory management.',
      icon: <FaShoppingBag className="text-5xl" />,
      category: 'Web Development',
      rating: 4.7,
      reviews: 280,
      downloads: 'Web App',
      price: 'Live',
      tech: ['E-Commerce', 'Textile Industry', 'Custom Orders', 'React.js'],
      playStore: 'https://barkatfabrics.com/',
      isWebProject: true,
    },
    {
      name: 'Heal Oral Life Store',
      developer: 'Digital Optimistic',
      description: 'Healthcare e-commerce platform for oral care products with product recommendations and health information.',
      icon: <FaHospital className="text-5xl" />,
      category: 'Web Development',
      rating: 4.8,
      reviews: 195,
      downloads: 'Web App',
      price: 'Live',
      tech: ['Healthcare E-Commerce', 'Product Recommendations', 'Health Info', 'React.js'],
      playStore: 'https://healoralifestore.com/',
      isWebProject: true,
    },
    {
      name: 'MHR Islamabad',
      developer: 'Digital Optimistic',
      description: 'Healthcare facility website with services information, appointment booking, and patient portal access.',
      icon: <FaHospital className="text-5xl" />,
      category: 'Web Development',
      rating: 4.9,
      reviews: 220,
      downloads: 'Web App',
      price: 'Live',
      tech: ['Healthcare', 'Appointment System', 'Patient Portal', 'Next.js'],
      playStore: 'https://www.mhrislamabad.com/',
      isWebProject: true,
    },
    {
      name: 'Rudraksh',
      developer: 'Digital Optimistic',
      description: 'E-commerce platform built on Shopify with product management, inventory tracking, and order fulfillment.',
      icon: <FaStore className="text-5xl" />,
      category: 'Web Development',
      rating: 4.8,
      reviews: 410,
      downloads: 'Web App',
      price: 'Live',
      tech: ['Shopify', 'E-Commerce', 'Inventory Management', 'Order Fulfillment'],
      playStore: 'https://g9ibra-me.myshopify.com/',
      isWebProject: true,
    },
    {
      name: 'SmallPDF Converter',
      developer: 'Digital Optimistic',
      description: 'Advanced PDF conversion tool with multiple format support, batch processing, and cloud storage integration.',
      icon: <FaFilePdf className="text-5xl" />,
      category: 'Web Development',
      rating: 4.7,
      reviews: 920,
      downloads: 'Web App',
      price: 'Live',
      tech: ['PDF Tools', 'File Conversion', 'Batch Processing', 'React.js'],
      playStore: 'https://smallpdfconverter.biz/',
      isWebProject: true,
    },
    {
      name: 'Electromart',
      developer: 'Digital Optimistic',
      description: 'Electronics e-commerce platform with product catalog, specifications comparison, and secure checkout.',
      icon: <FaShoppingBag className="text-5xl" />,
      category: 'Web Development',
      rating: 4.8,
      reviews: 380,
      downloads: 'Web App',
      price: 'Live',
      tech: ['E-Commerce', 'Electronics', 'Product Comparison', 'React.js'],
      playStore: 'https://electromart.pk/',
      isWebProject: true,
    },
  ];

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 fill-current" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 fill-current opacity-50" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    return stars;
  };

  // Filter projects based on active filter
  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'android') return !project.isWebProject;
    if (activeFilter === 'web') return project.isWebProject;
    return true;
  });

  return (
    <section id="projects" className="section-container bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-subtitle max-w-3xl mx-auto">
          A collection of high-quality Android applications and web development projects showcasing diverse skills and
          technologies, each with unique features and excellent user experience.
        </p>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeFilter === 'all'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
            }`}
          >
            All Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveFilter('android')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
              activeFilter === 'android'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
            }`}
          >
            <FaMobile />
            Android Apps ({projects.filter(p => !p.isWebProject).length})
          </button>
          <button
            onClick={() => setActiveFilter('web')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
              activeFilter === 'web'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
            }`}
          >
            <FaCode />
            Web Projects ({projects.filter(p => p.isWebProject).length})
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
          >
            {/* App Icon & Header */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-6">
              <div className="flex items-start gap-4">
                {/* App Icon - Play Store Style */}
                <div className="flex-shrink-0 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform duration-300">
                  {project.icon}
                </div>
                
                {/* App Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{project.developer}</p>
                  
                  {/* Rating & Downloads */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      {renderStars(project.rating)}
                      <span className="text-sm font-semibold text-gray-700 ml-1">{project.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 text-xs">
                      <FaDownload className="text-gray-400" />
                      <span>{project.downloads}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Category Badge */}
              <div className="mb-3">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                  {project.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.description}</p>

              {/* Technologies */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Reviews Count */}
              <div className="mb-4 text-xs text-gray-500">
                {project.reviews.toLocaleString()} reviews
              </div>

              {/* Install/Visit Button */}
              <a
                href={project.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  project.playStore === '#'
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : project.isWebProject
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                }`}
                onClick={(e) => {
                  if (project.playStore === '#') {
                    e.preventDefault();
                  }
                }}
              >
                {project.isWebProject ? (
                  <>
                    <FaGlobe className="text-lg" />
                    <span>Visit Website</span>
                  </>
                ) : (
                  <>
                <FaGooglePlay className="text-lg" />
                <span>{project.price === 'Free' ? 'Install' : project.price}</span>
                  </>
                )}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;

