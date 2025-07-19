// src/components/Navbar.jsx
import { Bars3Icon, HomeIcon, MagnifyingGlassIcon, PhoneIcon, QuestionMarkCircleIcon, ShoppingBagIcon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router'; // Ensure Link is from react-router-dom

const Navbar2 = () => { 
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false); // State for mobile search input visibility
    const [searchValue, setSearchValue] = useState(''); // Initialize with empty string
    const [BackdropOpen, setBackdropOpen] = useState(false); // State for desktop search backdrop
    const navigate = useNavigate();

    // Function to handle desktop search submission
    const handleDesktopSearchSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (searchValue.trim()) { // Only navigate if search value is not empty
            navigate(`/Shop/${encodeURIComponent(searchValue.trim())}`); // Navigate with search term as URL param
            setBackdropOpen(false); // Close the search overlay
            document.body.classList.remove('scroll-lock'); // Release scroll lock
            setSearchValue(''); // Clear search input after navigation
        }
    };

    // Function to handle mobile search submission
    const handleMobileSearchSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (searchValue.trim()) { // Only navigate if search value is not empty
            navigate(`/Shop/${encodeURIComponent(searchValue.trim())}`); // Navigate with search term as URL param
            setMobileOpen(false); // Close mobile menu
            setSearchOpen(false); // Close mobile search input
            document.body.classList.remove('scroll-lock'); // Release scroll lock
            setSearchValue(''); // Clear search input after navigation
        }
    };


    return (
        <AnimatePresence mode='wait' className='relative'>
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .5 }}
                className="fixed top-0 w-full z-50 bg-[#00000040] border-b border-b-[#0000001c] text-gray-100"
            >
                <div className=" h-[60px] md:mx-4 px-6 py-1 backdrop-filter backdrop-blur-[2px] flex justify-between items-center relative">

                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <h1 className='text-cyan-400 text-3xl -mb-2 font-hadayat min-w-[150px]'>Saair</h1>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex lg:space-x-5 md:space-x-5 font-medium px-3 py-1 rounded-full ">
                        {[
                            { title: 'Home', to: '/' },
                            { title: 'Shop', to: '/Shop' },
                            { title: 'About me', to: '/About' },
                            { title: 'Contact Us', to: '/Contact-Us' },
                        ].map((text) => (
                            <Link
                                key={text.title}
                                to={text.to}
                                className="hover:text-cyan-500 rounded-full px-2 py-1 hover:scale-102 transition duration-200 font-saira"
                            >
                                {text.title}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button onClick={() => { setBackdropOpen(!BackdropOpen); document.body.classList.toggle('scroll-lock') }}>
                            <MagnifyingGlassIcon className='size-4 hover:text-cyan-400 hover:scale-125 transition-all duration-300 ease-in-out ' />
                        </button>
                        <Link to={'/Cart'}><ShoppingBagIcon className='size-4 hover:text-cyan-400 hover:scale-125 transition-all duration-300 ease-in-out ' /> </Link>
                        <Link to="/Signup" className="hover:border-cyan-400 hover:text-gray-90 font-[450] py-1 px-6 rounded-xl border border-[#ffffff25] bg-[#fefefe1f] hover:shadow-md transition duration-200 backdrop-filter backdrop-blur-sm shadow-xl hover:shadow-cyan-600 font-saira">
                            <div className="flex justify-between items-center "> <UserIcon className='size-4 mr-2' /> Sign up</div>
                        </Link>
                    </div>

                    {/* Mobile Menu Icon */}
                    <div className="md:hidden -mb-1">
                        <button onClick={() => {
                            setMobileOpen(!mobileOpen);
                            document.body.classList.toggle('scroll-lock');
                            // Close mobile search when opening/closing main mobile menu
                            if (searchOpen) setSearchOpen(false);
                            // Clear search value if opening main mobile menu
                            if (!mobileOpen) setSearchValue('');
                        }} className="text-white">
                            {mobileOpen ? <XMarkIcon className='size-6' /> : <Bars3Icon className='size-6' />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden bg-[#080708] backdrop-filter backdrop-blur-sm text-white font-semibold absolute h-[95vh] w-[75vw] ${mobileOpen ? 'translate-x-0' : '-translate-x-[600px]'} transition-all duration-300 ease-in-out relative`}
                >
                    <div className={`bg-[#131212] ${searchOpen ? 'h-35' : 'h-15'} transition-all duration-300 ease-in-out px-2 overflow-hidden`}>
                        <div className="flex justify-between items-center h-14 px-4">
                            <h2 className="text-lg font-bold">Menu</h2>
                            <button className="text-white" onClick={() => { setSearchOpen(!searchOpen) }}>
                                <MagnifyingGlassIcon className='size-6' />
                            </button>
                        </div>
                        {/* Mobile Search Input */}
                        <form onSubmit={handleMobileSearchSubmit}> {/* Use onSubmit */}
                            <input
                                type="search"
                                name="search"
                                value={searchValue} // Bind value to state
                                onChange={(e) => setSearchValue(e.target.value)} // Update state on change
                                className={`border border-gray-500 active:border-cyan-400 focus:border-cyan-400 focus:shadow-lg shadow-cyan-400 w-[90%] h-14 rounded-xl my-2 mx-4 p-4 active:outline-none outline outline-none`}
                                id="mobile-search"
                                placeholder='Search files here'
                            />
                            {/* Hidden submit button for mobile search form, triggered by pressing Enter */}
                            <button type="submit" className="hidden"></button>
                        </form>
                    </div>
                    <div className="space-y-8 pr-6 pl-3 pb-12 w-[75vw] mt-8 relative">
                        {[
                            { title: `Home`, to: '/', icon: <HomeIcon className='size-6' /> },
                            { title: 'Shop', to: '/Shop', icon: <ShoppingBagIcon className='size-6' /> },
                            { title: 'Signup', to: '/Signup', icon: <UserIcon className='size-6' /> },
                            { title: 'Contact Us', to: '/Contact-Us', icon: <PhoneIcon className='size-6' /> },
                            { title: 'About me', to: '/About', icon: <QuestionMarkCircleIcon className='size-6' /> },
                        ].map((item) => (
                            <Link
                                key={item.title}
                                to={item.to}
                                className="block hover:text-cyan-400 hover:font-bold font-normal transition duration-150 font-saira active:text-cyan-400 hover:scale-105 rounded-lg px-2 py-2 items-center space-x-3"
                                onClick={() => { // Close mobile menu and release scroll lock on navigation
                                    setMobileOpen(false);
                                    document.body.classList.remove('scroll-lock');
                                    setSearchValue(''); // Clear search value
                                }}
                            >
                                <h1 className='flex text-xl'> <span className='mr-7'>{item.icon}</span>{item.title}</h1>
                            </Link>
                        ))}
                    </div>
                    <h4 className='absolute bottom-10 text-sm text-gray-700 mx-4'>&#169; Copyright 2025-Designed by Rabee</h4>
                </div>

                {/* Desktop Search Backdrop Overlay */}
                <div
                    onClick={() => { // Close backdrop and release scroll lock when clicking outside search input
                        setBackdropOpen(false);
                        document.body.classList.remove('scroll-lock');
                        setSearchValue(''); // Clear search value
                    }}
                    className={`bg-[#08070860] h-screen absolute w-full top-0 backdrop-filter backdrop-blur-sm transition-all duration-300 ease-in-out ${BackdropOpen ? 'scale-100 z-10' : 'scale-0 -z-10'}`}
                >
                    <div className="search flex justify-center items-center h-full" onClick={(e) => e.stopPropagation()}> {/* Prevent click from closing backdrop */}
                        <form onSubmit={handleDesktopSearchSubmit} className="relative w-max"> {/* Use onSubmit */}
                            <input
                                type="search"
                                name="search"
                                value={searchValue} // Bind value to state
                                onChange={(e) => setSearchValue(e.target.value)} // Update state on change
                                className={`border border-gray-500 active:border-cyan-400 focus:border-cyan-400 focus:shadow-lg shadow-cyan-400 w-[500px] h-[45px] rounded-2xl p-4 active:outline-none outline outline-none text-white`}
                                id="desktop-search"
                                placeholder='Search files here '
                            />
                            {/* Submit button for desktop search form */}
                            <button type="submit" className="absolute right-[1px] top-[1px] h-[43px] w-[75px] bg-[#fefefe1f] text-gray-100 rounded-xl flex justify-center items-center hover:bg-[#fefefe2f] transition-colors duration-200">
                                <MagnifyingGlassIcon className='size-5' />
                            </button>
                        </form>
                    </div>
                </div>

            </motion.nav>
        </AnimatePresence>
    );
};

export default Navbar2;