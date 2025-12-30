import React from 'react';
import { motion } from 'framer-motion';
import { FaGooglePlay, FaQrcode, FaTv, FaFilePdf, FaStar, FaDownload, FaVolumeUp, FaEnvelope, FaBook, FaMusic, FaFolder } from 'react-icons/fa';

const Projects = () => {
  const projects = [
    {
      name: 'QR & Barcode Scanner',
      developer: 'Muhammad Zohaib Talha',
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
      developer: 'Muhammad Zohaib Talha',
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
      developer: 'Muhammad Zohaib Talha',
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
      developer: 'Muhammad Zohaib Talha',
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
      developer: 'Muhammad Zohaib Talha',
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
      developer: 'Muhammad Zohaib Talha',
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
      developer: 'Muhammad Zohaib Talha',
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
      developer: 'Muhammad Zohaib Talha',
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

  return (
    <section id="projects" className="section-container bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="section-title">Featured Android Projects</h2>
        <p className="section-subtitle max-w-3xl mx-auto">
          A collection of high-quality Android applications showcasing diverse skills and
          technologies, each with unique features and excellent user experience.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {projects.map((project, index) => (
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

              {/* Install Button - Play Store Style */}
              <a
                href={project.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  project.playStore === '#'
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                }`}
                onClick={(e) => {
                  if (project.playStore === '#') {
                    e.preventDefault();
                  }
                }}
              >
                <FaGooglePlay className="text-lg" />
                <span>{project.price === 'Free' ? 'Install' : project.price}</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;

