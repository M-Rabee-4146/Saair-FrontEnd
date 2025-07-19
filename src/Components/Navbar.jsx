// src/components/Navbar.jsx
import { Bars3Icon,  XMarkIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';
// import { AnimatePresence} from 'framer-motion';
import { AnimatePresence,motion } from 'framer-motion';
// import { title } from 'framer-motion/client';
import React, { useState } from 'react';
import { Link } from 'react-router';
// import { Menu, X } from 'lucide-react'; // Make sure to install lucide-react

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <AnimatePresence mode='wait'>
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .5 }}
                className="fixed top-0 w-full z-50  bg-[#00000027] backdrop-filter backdrop-blur-[1px] border-b border-b-[#0000001c] text-gray-100">
                <div className="max-w-[1378px] h-[60px] mx-auto px-6 py-1  flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <h1 className='text-gray-100 text-3xl -mb-2 font-qurova' >AuraWatch</h1>
                        {/* <img src="/logo-mark.svg" alt="logo" className="w-[30px]" /> */}
                    </div>

                    {/* Desktop Links */}
                    <div  className="hidden md:flex lg:space-x-5 md:space-x-5 font-medium bg-[#fefefe1c] px-3 py-1 rounded-full backdrop-filter backdrop-blur-sm">
                        {[
                            { title: 'Home', to: '/' },
                            { title: 'Courses', to: '/Courses' },
                            { title: 'About', to: '/' },
                            { title: 'Contact Us', to: '/' },
                        ].map((text) => (
                            <Link
                                key={text.title}
                                to={text.to}
                                className="hover:text-white  focus:text-gray-900 rounded-full px-4 py-1 focus:bg-white hover:scale-102 transition duration-200"
                            >
                                {text.title}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/Login" className="hover:bg-white hover:text-gray-900 font-[450] py-1 px-4 rounded-full border border-[#ffffff71] hover:shadow-md transition duration-200">
                         <div className="flex justify-between items-center"> <UserIcon className='size-4 mr-2'/>  Login</div>
                        </Link>
                        {/* <Link to="/Signup">
                            <button className="py-1 px-6 rounded-full  text-white bg-green-500 font-bold hover:bg-green-600  hover:shadow-md transition duration-200">
                                Sign up
                            </button>
                        </Link> */}
                    </div>

                    {/* Mobile Menu Icon */}
                    <div className="md:hidden -mb-1">
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white ">
                            {mobileOpen ? <XMarkIcon className='size-5' /> : <Bars3Icon className='size-5' />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20  }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: .5}}

                        className="md:hidden bg-[#000000] bg-bootm bg-[url(./Images/hero.jpg)] text-white font-semibold space-y-4 px-6 pb-12 w-screen h-screen flex justify-center items-center flex-col ">
                        {[
                            { title: 'Home', to: '/' },
                            { title: 'Courses', to: '/Courses' },
                            { title: 'About', to: '/' },
                            { title: 'Contact Us', to: '/' },
                        ].map((item) => (
                            <Link
                                key={item.title}
                                to={item.to}
                                className="block hover:text-gray-900 hover:font-bold transition duration-150"
                            >
                                {item.title}
                            </Link>
                        ))}

                        <Link to="Login" className="block mt-2">
                            Login
                        </Link>
                        <Link to="/Signup">
                            <button className=" w-[100px] py-2 rounded-full text-white bg-green-500 font-bold hover:bg-white hover:text-gray-700 transition duration-200">
                                Sign up
                            </button>
                        </Link>
                    </motion.div>
                )}
            </motion.nav>
        </AnimatePresence>
    );
};

export default Navbar;
