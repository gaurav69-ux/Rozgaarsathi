import { Rocket, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-12 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Rocket className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold">RozgaarSathi</span>
            </Link>
            <p className="text-blue-100">
              Connecting local talent with local opportunities. Empowering workers and employers across India.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-blue-100">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/jobseeker/dashboard" className="hover:text-white transition-colors">Find Jobs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-blue-100">
              <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-blue-100">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1" />
                <span>Rajura- Maharashtra, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5" />
                <span>support@rozgaarsathi.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-500 mt-12 pt-8 text-center text-blue-200">
          <p>&copy; {new Date().getFullYear()} RozgaarSathi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
