import React from 'react';
import { motion } from 'framer-motion';
// Using outline icons for a cleaner, more minimalist look as per your aesthetic
import { ClockIcon, GlobeAltIcon, UsersIcon, SparklesIcon, CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline'; 

const AboutUsPage = () => {
    // Framer Motion variants for staggered animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Small delay for sequential appearance
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
    };

    const iconItemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 150, damping: 20 } },
    };

    return (
        <motion.div
            // Exact main background color, default text color white/light gray
            className="min-h-screen bg-[#080708] text-gray-100 font-poppins py-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-4xl mx-auto z-10 relative"> {/* z-10 to ensure content is above any background effects */}
                {/* Header Section */}
                <motion.header
                    className="text-center mb-16"
                    variants={itemVariants}
                >
                    <h1 className="text-5xl font-extrabold font-gothic-1 tracking-tight text-white sm:text-6xl lg:text-7xl">
                        About <span className="text-cyan-400">Saair</span>
                    </h1>
                    <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-poppins">
                        Your trusted <span className="font-semibold text-cyan-300">"Companion of a Traveler"</span>
                        – crafting precision timepieces for life's every moment.
                    </p>
                </motion.header>

                {/* Our Story Section - Exact card styles */}
                <motion.section
                    className="bg-[#0E0E0E] shadow-xl rounded-xl p-8 md:p-10 mb-16
                                hover:bg-[#191919] transition-all duration-400 ease-in-out border-[.1px] border-transparent hover:border-[#383838]"
                    variants={itemVariants}
                >
                    <h2 className="text-3xl font-bold font-saira text-white mb-6 border-b border-[#383838] pb-4">
                        Our Story
                    </h2>
                    <p className="text-lg text-gray-200 leading-relaxed mb-6 font-poppins">
                        Welcome to <span className="font-semibold text-cyan-400">Saair</span>, where our passion lies in the seamless fusion of <span className="font-medium">clean aesthetic and modern watchmaking</span>. Founded on the principle that timepieces should not only tell time but also tell a story, we curate a collection for both the <span className="font-medium">young and the mature, for all genders</span>, who appreciate precision, design, and durability.
                    </p>
                    <p className="text-lg text-gray-200 leading-relaxed font-poppins">
                        Inspired by the spirit of exploration and personal journeys, our motto, <span className="font-medium text-cyan-300">'Companion of a Traveler'</span>, embodies our commitment to creating watches that are reliable, stylish, and ready for any adventure life throws your way. Every Saair watch is a testament to our dedication to quality and timeless appeal.
                    </p>
                </motion.section>

                {/* Mission & Vision Section - Grid layout with prominent icons, exact card styles */}
                <motion.section
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
                    variants={containerVariants}
                >
                    <motion.div
                        className="bg-[#0E0E0E] shadow-xl rounded-xl p-8 flex flex-col items-center text-center
                                    hover:bg-[#191919] transition-all duration-400 ease-in-out border-[.1px] border-transparent hover:border-[#383838]"
                        variants={itemVariants}
                    >
                        <motion.div variants={iconItemVariants} className="mb-6">
                            <ClockIcon className="h-20 w-20 text-cyan-500 animate-pulse-subtle" />
                        </motion.div>
                        <h3 className="text-3xl font-bold font-saira text-white mb-4">Our Mission</h3>
                        <p className="text-lg text-gray-200 font-poppins">
                            To empower individuals with meticulously designed, modern watches that serve as a testament to their unique journey, combining functionality with sophisticated style.
                        </p>
                    </motion.div>
                    <motion.div
                        className="bg-[#0E0E0E] shadow-xl rounded-xl p-8 flex flex-col items-center text-center
                                    hover:bg-[#191919] transition-all duration-400 ease-in-out border-[.1px] border-transparent hover:border-[#383838]"
                        variants={itemVariants}
                    >
                        <motion.div variants={iconItemVariants} className="mb-6">
                            <GlobeAltIcon className="h-20 w-20 text-teal-500 animate-pulse-subtle" /> {/* Using teal, common complement to cyan */}
                        </motion.div>
                        <h3 className="text-3xl font-bold font-saira text-white mb-4">Our Vision</h3>
                        <p className="text-lg text-gray-200 font-poppins">
                            To be recognized globally as the premier online watch store, fostering a community of travelers and connoisseurs who value design, precision, and the journey itself.
                        </p>
                    </motion.div>
                </motion.section>

                {/* Values Section - Exact card styles */}
                <motion.section
                    className="bg-[#0E0E0E] shadow-xl rounded-xl p-8 md:p-10 mb-16
                                hover:bg-[#191919] transition-all duration-400 ease-in-out border-[.1px] border-transparent hover:border-[#383838]"
                    variants={itemVariants}
                >
                    <h2 className="text-3xl font-bold font-saira text-white mb-8 border-b border-[#383838] pb-4">
                        Our Core Values
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                        <motion.li className="flex items-start" variants={itemVariants}>
                            <div className="flex-shrink-0">
                                <SparklesIcon className="h-8 w-8 text-cyan-400 mt-1" />
                            </div>
                            <div className="ml-4">
                                <h4 className="text-xl font-semibold font-saira text-white">Clean Aesthetic</h4>
                                <p className="mt-1 text-gray-300 font-poppins">
                                    We embrace minimalist designs that exude sophistication and timeless appeal, fitting seamlessly into any lifestyle.
                                </p>
                            </div>
                        </motion.li>
                        <motion.li className="flex items-start" variants={itemVariants}>
                            <div className="flex-shrink-0">
                                <CalendarDaysIcon className="h-8 w-8 text-teal-400 mt-1" />
                            </div>
                            <div className="ml-4">
                                <h4 className="text-xl font-semibold font-saira text-white">Modern & Enduring</h4>
                                <p className="mt-1 text-gray-300 font-poppins">
                                    Our collections are contemporary, yet built to last, designed for both today's trends and tomorrow's classics.
                                </p>
                            </div>
                        </motion.li>
                        <motion.li className="flex items-start" variants={itemVariants}>
                            <div className="flex-shrink-0">
                                <UsersIcon className="h-8 w-8 text-blue-400 mt-1" /> {/* Blue for users/community */}
                            </div>
                            <div className="ml-4">
                                <h4 className="text-xl font-semibold font-saira text-white">Universal Appeal</h4>
                                <p className="mt-1 text-gray-300 font-poppins">
                                    We design for everyone – whether young or mature, male or female, find your perfect Saair companion.
                                </p>
                            </div>
                        </motion.li>
                        <motion.li className="flex items-start" variants={itemVariants}>
                            <div className="flex-shrink-0">
                                <HandRaisedIcon className="h-8 w-8 text-green-400 mt-1" /> {/* HandRaised for trust/quality */}
                            </div>
                            <div className="ml-4">
                                <h4 className="text-xl font-semibold font-saira text-white">Uncompromising Quality</h4>
                                <p className="mt-1 text-gray-300 font-poppins">
                                    Each Saair timepiece is a product of meticulous craftsmanship and rigorous quality control.
                                </p>
                            </div>
                        </motion.li>
                    </ul>
                </motion.section>

                {/* Call to Action/Contact Section - Accent color button */}
                <motion.section
                    className="text-center py-12 bg-[#0E0E0E] text-white rounded-xl shadow-xl
                                hover:bg-[#191919] transition-all duration-400 ease-in-out border-[.1px] border-transparent hover:border-[#383838]"
                    variants={itemVariants}
                >
                    <h2 className="text-4xl font-bold font-saira mb-4">Start Your Journey with Saair</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto font-poppins">
                        Explore our full collection and discover the perfect timepiece to accompany you.
                    </p>
                    <motion.a
                        href="/products" // Link to your product listing page
                        className="inline-block bg-cyan-600 text-white font-bold font-poppins py-3 px-8 rounded-full shadow-lg
                                   hover:bg-cyan-500 hover:scale-105 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Explore Collections
                    </motion.a>
                </motion.section>
            </div>
            {/* Optional subtle background glow, matching landing page */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
                <div className="absolute top-[60%] right-[10%] w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>
            </div>
        </motion.div>
    );
};

export default AboutUsPage;