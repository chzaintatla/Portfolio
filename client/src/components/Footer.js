import React from 'react';
import { FaLinkedin, FaInstagram, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <FaLinkedin />,
      url: 'https://www.linkedin.com/company/sparkwave-digital-solutions/',
      name: 'LinkedIn',
    },
    {
      icon: <FaInstagram />,
      url: 'https://instagram.com/sparkwave.digitals',
      name: 'Instagram',
    },
  ];

  return (
    <footer className="bg-[#0a192f] text-gray-400 border-t border-blue-500/10 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">
              SparkWave <span className="text-blue-500 italic">Digital Systems</span>
            </h3>
            <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
              Empowering businesses to build, scale, and succeed through cutting-edge technology and data-driven marketing.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#112240] flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all border border-blue-500/5"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium">
              {['About', 'Skills', 'Projects', 'Services', 'Blog', 'Contact'].map(item => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-blue-500 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <a href="mailto:connect@sparkwave.dev" className="hover:text-blue-500 transition-colors">connect@sparkwave.dev</a>
              </li>
              <li>
                <a href="https://wa.me/923134750136" className="hover:text-blue-500 transition-colors">+92 313 4750136</a>
              </li>
              <li>
                <span className="text-gray-500">Institutional Hub: PK</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-blue-500/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest uppercase font-bold text-gray-500">
          <p>© {currentYear} SPARKWAVE DIGITAL SOLUTIONS. ALL RIGHTS RESERVED.</p>
          <p className="flex items-center">
            MADE WITH <FaHeart className="mx-2 text-red-500" /> FOR THE WORLD
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
