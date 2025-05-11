import { Link } from 'react-router-dom';
import { CalendarDays, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <CalendarDays className="h-8 w-8 text-primary-400" />
              <span className="font-bold text-xl">GatherSpace</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Connecting communities through meaningful events. Discover, create, and join events that matter to you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h5 className="font-semibold text-lg mb-4 text-white">Discover</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=workshop" className="text-gray-400 hover:text-white transition-colors">
                  Workshops
                </Link>
              </li>
              <li>
                <Link to="/events?category=charity" className="text-gray-400 hover:text-white transition-colors">
                  Charity Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=social" className="text-gray-400 hover:text-white transition-colors">
                  Social Gatherings
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h5 className="font-semibold text-lg mb-4 text-white">Account</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors">
                  Profile Settings
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h5 className="font-semibold text-lg mb-4 text-white">Create</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/events/create" className="text-gray-400 hover:text-white transition-colors">
                  Host an Event
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Hosting Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Community Standards
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Resources
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} GatherSpace. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-300">Cookie Policy</a>
          </div>
        </div>
        
        <div className="text-center mt-6 text-gray-500 text-sm flex items-center justify-center">
          <span>Made with</span>
          <Heart className="h-4 w-4 mx-1 text-red-500" />
          <span>in 2025</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;