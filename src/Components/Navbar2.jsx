// src/components/Navbar.jsx
import { Bars3Icon, ChatBubbleOvalLeftIcon, HomeIcon, MagnifyingGlassIcon, PhoneIcon, QuestionMarkCircleIcon, ShoppingBagIcon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router'; // Corrected import to react-router-dom
import { Logout } from '../Redux/features/auth';
import { useDispatch } from 'react-redux';

const Navbar2 = () => {
    const location=useLocation()
    const token=localStorage.getItem('token')
    const role=localStorage.getItem('role')
    const dispatch=useDispatch()
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false); // State for mobile search input visibility
    const [searchValue, setSearchValue] = useState(''); // Initialize with empty string
    const [backdropOpen, setBackdropOpen] = useState(false); // State for desktop search backdrop, renamed for consistency
    const navigate = useNavigate();

    // Helper function to manage body scroll lock
    const toggleScrollLock = (shouldLock) => {
        if (shouldLock) {
            document.body.classList.add('scroll-lock');
        } else {
            document.body.classList.remove('scroll-lock');
        }
    };

    // Function to handle desktop search submission
    const handleDesktopSearchSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (searchValue.trim()) { // Only navigate if search value is not empty
            navigate(`/Shop/${encodeURIComponent(searchValue.trim())}`); // Navigate with search term as URL param
            setBackdropOpen(false); // Close the search overlay
            toggleScrollLock(false); // Release scroll lock
            setSearchValue(''); // Clear search input after navigation
            // console.log('form submitted')
        }
    };

    // Function to handle mobile search submission
    const handleMobileSearchSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (searchValue.trim()) { // Only navigate if search value is not empty
            navigate(`/Shop/${encodeURIComponent(searchValue.trim())}`); // Navigate with search term as URL param
            setMobileOpen(false); // Close mobile menu
            setSearchOpen(false); // Close mobile search input
            toggleScrollLock(false); // Release scroll lock
            setSearchValue(''); // Clear search input after navigation
        }
    };

    // Handler for desktop search button click
    const handleDesktopSearchClick = () => {
        setBackdropOpen(!backdropOpen);
        toggleScrollLock(!backdropOpen); // Toggle scroll lock based on new state
    };

    // Handler for mobile menu icon click
    const handleMobileMenuClick = () => {
        setMobileOpen(!mobileOpen);
        toggleScrollLock(!mobileOpen); // Toggle scroll lock based on new state

        // Close mobile search when opening/closing main mobile menu
        if (searchOpen) setSearchOpen(false);
        // Clear search value if opening main mobile menu
        if (!mobileOpen) setSearchValue('');
    };

    // Handler for mobile navigation links click
    const handleMobileNavLinkClick = () => {
        setMobileOpen(false);
        toggleScrollLock(false); // Release scroll lock
        setSearchValue(''); // Clear search value
    };

    const logoutNow=()=>{
        dispatch(Logout())
        navigate('/')
    }

    return (
        <AnimatePresence mode='wait'>
            <motion.nav
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .5,delay:location.pathname==='/'?3.4:.1 }}
                // Ensure navbar itself is always on top (z-50 is good)
                className="fixed top-0 w-full md:z-50 z-[99] bg-[#00000040] border-b border-b-[#0000001c] text-gray-100"
            >
                <div className=" h-[60px] md:mx-4 px-6 py-1 backdrop-filter backdrop-blur-[2px] flex justify-between items-center relative">

                    {/* Logo */}
                    <div className="flex items-center space-x-3 z-[101]"> {/* Ensure logo is above mobile menu */}
                        <h1 className='text-cyan-400 text-3xl -mb-2 font-hadayat lg:min-w-[150px]'>Saair</h1>
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
                    <div className="hidden md:flex items-center space-x-4 z-[101]"> {/* Ensure these are above mobile menu */}
                        <button onClick={handleDesktopSearchClick}>
                            <MagnifyingGlassIcon className='size-4 hover:text-cyan-400 hover:scale-125 transition-all duration-300 ease-in-out ' />
                        </button>
                        <Link to={'/Cart'}><ShoppingBagIcon className='size-4 hover:text-cyan-400 hover:scale-125 transition-all duration-300 ease-in-out ' /> </Link>
                      {token && role? role=='admin'? <button onClick={navigate('/Dashboard')} className="hover:border-cyan-400 hover:text-gray-90 font-[450] py-1 px-6 rounded-xl border border-[#ffffff25] bg-[#fefefe1f] hover:shadow-md transition duration-200 backdrop-filter backdrop-blur-sm shadow-xl hover:shadow-cyan-600 font-saira">
                            <div className="flex justify-between items-center "> <UserIcon className='size-4 mr-2' /> Dashboard</div>
                        </button>:<button onClick={logoutNow} className="hover:border-cyan-400 hover:text-gray-90 font-[450] py-1 px-6 rounded-xl border border-[#ffffff25] bg-[#fefefe1f] hover:shadow-md transition duration-200 backdrop-filter backdrop-blur-sm shadow-xl hover:shadow-cyan-600 font-saira">
                            <div className="flex justify-between items-center "> <UserIcon className='size-4 mr-2' /> Logout</div>
                        </button>:<Link to="/Signup" className="hover:border-cyan-400 hover:text-gray-90 font-[450] py-1 px-6 rounded-xl border border-[#ffffff25] bg-[#fefefe1f] hover:shadow-md transition duration-200 backdrop-filter backdrop-blur-sm shadow-xl hover:shadow-cyan-600 font-saira">
                            <div className="flex justify-between items-center "> <UserIcon className='size-4 mr-2' /> Sign up</div>
                        </Link>}
                    </div>

                    {/* Mobile Menu Icon */}
                    <div className="md:hidden -mb-1 z-[101]"> {/* Ensure this is above mobile menu */}
                        <button onClick={handleMobileMenuClick} className="text-white">
                            {mobileOpen ? <XMarkIcon className='size-6' /> : <Bars3Icon className='size-6' />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu (Sidebar) */}
                <motion.div
                    initial={{ x: '-100%' }} // Start off-screen to the left
                    animate={{ x: mobileOpen ? '0%' : '-100%' }} // Animate to 0% for open, -100% for closed
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    // Increased z-index to be above most content but below search backdrop when open
                    className={`md:hidden bg-[#080708] text-white font-semibold fixed top-0 left-0 h-screen w-[75vw] overflow-y-auto z-[90]`}
                >
                    <div className={`bg-[#131212] ${searchOpen ? 'h-35' : 'h-15'} transition-all duration-300 ease-in-out px-2 overflow-hidden`}>
                        <div className="flex justify-between items-center h-14 px-4">
                            <h2 className="text-lg font-bold">Menu</h2>
                            <button className="text-white" onClick={() => { setSearchOpen(!searchOpen) }}>
                                <MagnifyingGlassIcon className='size-6' />
                            </button>
                        </div>
                        {/* Mobile Search Input */}
                        <form onSubmit={handleMobileSearchSubmit}>
                            <input
                                type="search"
                                name="search"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className={`border border-gray-500 active:border-cyan-400 focus:border-cyan-400 focus:shadow-lg shadow-cyan-400 w-[90%] h-14 rounded-xl my-2 mx-4 p-4 active:outline-none outline outline-none text-gray-800`}
                                id="mobile-search"
                                placeholder='Search products...' // More specific placeholder
                            />
                            {/* Hidden submit button for mobile search form, triggered by pressing Enter */}
                            <button type="submit" className="hidden"></button>
                        </form>
                    </div>
                    <div className="space-y-6 pr-6 pl-3 pb-12 w-[75vw] mt-8"> {/* Removed relative from here */}
                        {[
                            { title: `Home`, to: '/', icon: <HomeIcon className='size-5' /> },
                            { title: 'Shop', to: '/Shop', icon: <ShoppingBagIcon className='size-5' /> },
                            { title: 'Cart', to: '/Cart', icon: <ShoppingCartIcon className='size-5' /> },
                            { title: 'Sign in', to: '/Login', icon: <UserIcon className='size-5' /> },
                            { title: 'Ai Assistant', to: '/AI', icon: <ChatBubbleOvalLeftIcon className='size-5' /> },
                            { title: 'Contact Us', to: '/Contact-Us', icon: <PhoneIcon className='size-5' /> },
                            { title: 'About me', to: '/About', icon: <QuestionMarkCircleIcon className='size-5' /> },
                        ].map((item) => (
                            <Link
                                key={item.title}
                                to={item.to}
                                className="block hover:text-cyan-400 hover:font-bold font-normal transition duration-150 font-saira active:text-cyan-400 hover:scale-105 rounded-lg px-2 py-1 items-center space-x-3"
                                onClick={handleMobileNavLinkClick}
                            >
                                <h1 className='flex text-lg'> <span className='mr-7'>{item.icon}</span>{item.title}</h1>
                            </Link>
                        ))}
                    </div>
                    <h4 className='absolute bottom-10 text-sm text-gray-700 mx-4'>&#169; Copyright 2025-Designed by Rabee</h4>
                </motion.div>

                {/* Desktop Search Backdrop Overlay */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: backdropOpen ? 1 : 0, scale: backdropOpen ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  
                    // Higher z-index for the backdrop so it appears on top of everything
                    className={`bg-[#08070860] fixed inset-0 w-full h-full backdrop-filter backdrop-blur-sm z-[100] ${backdropOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                >
                    <div className="search flex justify-center items-center h-full"  onClick={() => { // Close backdrop and release scroll lock when clicking outside search input
                        setBackdropOpen(false);
                        toggleScrollLock(false);
                        setSearchValue('');
                         // Clear search value
                    }}>
                         {/* Prevent click from closing backdrop */}
                         <div onClick={(e)=>e.stopPropagation()} className="">
                        <form onSubmit={handleDesktopSearchSubmit} className="relative"> {/* Added relative to form for button positioning */}
                            <input
                                type="search"
                                name="search"
                                value={searchValue}
                                onClick={(e)=>e.stopPropagation()}
                                onChange={(e) =>{ setSearchValue(e.target.value)}}
                                className={`border border-gray-500 active:border-cyan-400 focus:border-cyan-400 focus:shadow-lg shadow-cyan-400 w-[500px] h-[45px] rounded-2xl p-4 active:outline-none outline outline-none text-white`}
                                id="desktop-search"
                                placeholder='Search products here'
                            />
                            {/* Submit button for desktop search form */}
                            <button type="submit" className="absolute right-[1px] top-[1px] h-[43px] w-[75px] bg-[#fefefe1f] text-gray-100 rounded-xl flex justify-center items-center hover:bg-[#fefefe2f] transition-colors duration-200">
                                <MagnifyingGlassIcon className='size-5' />
                            </button>
                        </form>
                        </div>
                    </div>
                </motion.div>

            </motion.nav>
        </AnimatePresence>
    );
};

export default Navbar2;