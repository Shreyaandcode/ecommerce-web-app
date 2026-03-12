import { Link } from "react-router-dom";
import { Instagram, Twitter, Mail, Phone, MapPin, Github } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-purple-900 text-white mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-emerald-400 text-lg font-bold mb-4">Glamify</h3>
            <p className="text-gray-300 mb-4">
              Your one-stop destination for all fashion needs. Quality products at affordable prices.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/Shreyaandcode" className="text-gray-300 hover:text-emerald-400 transition-colors">
                <Github size={20} />
              </a>
              <a href="https://www.instagram.com/_s_h_u_k_l__s_h_r_e_y_a_?igsh=OXJhMzR4ZjN6Nnll" className="text-gray-300 hover:text-emerald-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-emerald-400 text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-emerald-400 text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/saree" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Sarees
                </Link>
              </li>
              <li>
                <Link to="/category/top" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Tops
                </Link>
              </li>
              <li>
                <Link to="/category/footwear" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Footwear
                </Link>
              </li>
              <li>
                <Link to="/category/glasses" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Glasses
                </Link>
              </li>
              <li>
                <Link to="/category/jeans" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Jeans
                </Link>
              </li>
              <li>
                <Link to="/category/jewellary" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Jewellery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-emerald-400 text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-emerald-400 mr-2 mt-1" />
                <span className="text-gray-300">123, Civil lines, Prayagraj, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-emerald-400 mr-2" />
                <span className="text-gray-300">+91 8303761387, 7379793030</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-emerald-400 mr-2" />
                <span className="text-gray-300">shreyashukla9264@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Glamify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 