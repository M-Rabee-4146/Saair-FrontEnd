import React from 'react';
import Navbar2 from './Navbar2'; // Assuming Navbar2 is in the same directory
import { AnimatePresence,defaultEasing,easeInOut,motion } from 'framer-motion';
import { useNavigate } from 'react-router';

const Home2 = () => {
    const navigate=useNavigate()
    return (
        <AnimatePresence mode='wait'>
            <div className="bg-white">

           
        <motion.div   key={'bg'}
                            initial={{ x: 1500, }}
                            animate={{ opacity: 1, x: 0 ,rotate:0}}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 1.2,ease:easeInOut }} className='min-h-screen overflow-hidden text-white bg-[#080708]'>
            <Navbar2 />
            {/* Main content wrapper. pt-16 ensures space below fixed navbar */}
            <div className="pt-16 px-4 flex flex-col-reverse md:flex-row justify-between items-center max-w-8xl mx-auto w-full">
                {/* Text Content Section */}
                <div className="text lg:mx-5 -mt-0 my-5 mb-10 md:-mt-2 md:w-1/2">
                    {/* Reverted text sizes to your original input, except for the initial text-8xl */}
                    <motion.h1 
                      key={'heading'}
                            initial={{ x: -500,opacity:0 }}
                            animate={{ opacity: 1, x: 0 ,rotate:0}}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 1,delay:2.4 }}
                    style={{ lineHeight: .8 }} className='font-gothic-1 uppercase text-[100px] md:text-8xl lg:text-[140px] xl:text-[160px]  leading-tight'>
                        Trends that <br /> makes a <br /><span className='text-cyan-400'>difference</span>
                    </motion.h1>
                    <motion.p
                    key={'paragraph'}
                             initial={{ x: -500,opacity:0 }}
                            animate={{ opacity: 1, x: 0 ,rotate:0}}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 1,delay:2.4 }}
                     className='font-light mx-2 my-4 text-gray-300 max-w-lg'>
                       Where elegance meets innovation. Discover timeless designs and quality <br className='hidden sm:block md:hidden lg:block' />craftsmanship, elevating your unique style.
                    </motion.p>
                    <motion.div 
                       initial={{ x: -500,opacity:0 }}
                            animate={{ opacity: 1, x: 0 ,rotate:0}}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 1,delay:2.4 }}
                    className="btns mt-6 mx-2 flex flex-wrap gap-4">
                        <button onClick={()=>navigate('/Shop')} className='uppercase bg-cyan-400 hover:bg-cyan-600 hover:border-gray-900 border text-gray-950 hover:text-white font-semibold px-6 py-2 rounded-xl drop-shadow-lg hover:drop-shadow-400 drop-shadow-gray-950 transition-all duration-300 ease-in-out text-sm'>
                            Shop now
                        </button>
                        <button  onClick={()=>navigate('/Signup')} className='uppercase border border-[#fefefe59] hover:border-cyan-400 font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-cyan-400 drop-shadow-gray-950 transition-all duration-300 ease-in-out text-sm'>
                            Join us
                        </button>
                    </motion.div>
                </div>

                {/* Image Section */}
                <motion.div
                 key={'image'}
                            initial={{ x: 600,rotate:15 }}
                            animate={{ opacity: 1, x: 0 ,rotate:0}}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 1.3,delay:1.2 }}
                    // h-[85vh] for small screens, md:h-screen for medium+ to fill vertical space
                    // md:mt-[-80px] to pull image up on medium screens to align with text
                    // No negative margin on small screens (default mt-10)
                    className="h-[85vh] w-full md:h-screen md:w-[50%] max-w-[600px] bg-center bg-no-repeat relative  md:mt-[-80px] bg-cover md:bg-contain"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, transparent 90%, #080709a1 5%), url(/Images/updated.png)`,
                        // backgroundSize: 'contain',
                    }}
                >
                </motion.div>
            </div>
        </motion.div>
         </div>
        </AnimatePresence>
    );
};

export default Home2;