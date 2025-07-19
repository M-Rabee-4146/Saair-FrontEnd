import React from "react";
import { ChevronUpIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router";

const Footer = () => {
  const location=useLocation()
  return (
    <footer className=" bg-[#080708] text-gray-300 rounded-t-[70px] border-t-1 border-gray-900">
      <div className={`max-w-7xl mx-auto ${location.pathname=='/Shop'?'px-0':'px-4 md:px-10'}  py-8 grid grid-cols-1 md:grid-cols-4 gap-4`}>

        {/* Logo & Socials */}
        <div>
          {/* <img src="/logo.svg" alt="LearnerO" className="w-10 mb-4" /> */}
           <h1 className='text-cyan-400 text-4xl  font-hadayat w-10' >Saair</h1>
          <p className="text-sm mb-3 font-semibold font-saira -ml-1 ">Companion of a Traveler</p>
          <div className="flex gap-3">
            <a href="#" className="hover:text-cyan-400">
              
              {/* <Facebook size={20} /> */}
            </a>
            <a href="#" className="hover:text-cyan-400">
              
              {/* <Instagram size={20} /> */}
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-md font-semibold mb-3 text-base">Navigation</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-cyan-400 text-sm  hover:text-base transition-all duration-300 ">Home</Link></li>
            <li><Link to="/Shop" className="hover:text-cyan-400 hover:text-base transition-all duration-300">Shop</Link></li>
            <li><Link to="/About" className="hover:text-cyan-400 hover:text-base transition-all duration-300">About</Link></li>
            <li><Link to="/Contact-Us" className="hover:text-cyan-400 hover:text-base transition-all duration-300">Contact</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-md font-semibold mb-3">Policies</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-cyan-400 hover:text-base transition-all duration-300">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-cyan-400 hover:text-base transition-all duration-300">Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-md font-semibold mb-3">Contact</h3>
          <div className="flex items-start gap-2 text-sm mb-2 text-gray-400">
            {/* <Mailicon size={16} /> */}
            <a href="mailto:rabijamil8@gmail.com" className="hover:text-cyan-400 hover:text-base transition-all duration-300">rabijamil8@gmail.com</a>
          </div>
          <div className="flex items-start origin-left text-sm hover:text-cyan-400 hover:text-base  transition-all duration-300 text-gray-400">
            <PhoneIcon className="size-5" />
            <a  href="tel:+923094053841" className="">+92 309 4053841</a>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <div className="text-center py-3 border-t border-gray-950  text-gray-500 text-sm">
        © 2025 Saair. All rights reserved.
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed z-50  bottom-6 right-6 bg-cyan-400 text-black p-3 rounded-full shadow-lg hover:bg-cyan-600 transition"
        >
          <ChevronUpIcon className="size-5" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
