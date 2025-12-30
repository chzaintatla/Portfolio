import React from 'react';
import { FaLinkedin, FaInstagram, FaFacebook, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <FaLinkedin />,
      url: 'https://www.linkedin.com/company/digital-optimistic/',
      name: 'LinkedIn',
    },
    {
      icon: <FaInstagram />,
      url: 'https://www.instagram.com/digitaloptimisticllc?utm_source=qr&igsh=MWxtMzloZWEwZThlYw==',
      name: 'Instagram',
    },
    {
      icon: <FaFacebook />,
      url: 'https://www.facebook.com/people/Digital-Optimistic-LLC/61584332251308/',
      name: 'Facebook',
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Digital Optimistic</h3>
            <p className="text-gray-400 mb-4">
              Full-Stack Development & Digital Solutions Company with 6+ years of experience building high-performance
              digital solutions.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Skills
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Projects
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="mailto:mr.zaibe@gmail.com"
                  className="hover:text-primary-400 transition-colors"
                >
                  mr.zaibe@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+13073104711"
                  className="hover:text-primary-400 transition-colors"
                >
                  +1 (307) 310-4711
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/digital-optimistic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors"
                >
                  LinkedIn Profile
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            Copyright © {currentYear} All rights reserved.
          </p>
          <p className="text-gray-500 mt-2 text-sm">Digital Optimistic LLC</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

