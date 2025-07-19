import React from 'react'
import Navbar2 from './Navbar2'

const Home2 = () => {
    return (
        <div className='min-h-screen  overflow-hidden text-white bg-[#080708]  '>
            <Navbar2/>
            <div className="px-4 flex flex-col-reverse md:flex-row justify-between items-center columns-2">

                <div className="text lg:mx-5 md:mt-20 md:my-5 mb-10 mt-5  "  >
                   
                    <h1 style={{ lineHeight: .8 }} className='font-gothic-1    uppercase md:text-8xl text-[100px] lg:text-[140px]'> Trends that <br /> makes a <br /><span className='text-cyan-400'>difference</span></h1>
                    <p className='font-light mx-2 my-1 text-gray-300'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos culpa esse <br className='hidden sm:block md:hidden lg:block' /> quae quaerat ducimus numquam sequi.</p>
                    <div className="btns mt-4 mx-2">
                        <button className='uppercase bg-cyan-400 hover:bg-cyan-600 hover:border-gray-900 border  text-gray-950 font-semibold w-38 h-10 rounded-xl  drop-shadow-lg   hover:drop-shadow-cyan-400 drop-shadow-gray-950 transition-all duration-300 ease-in-out mb-2 text-sm'>Shop now</button>
                        <button className='w-28 h-10 uppercase border-[#fefefe59] hover:border-cyan-400 border font-semibold  rounded-xl  shadow-md   hover:shadow-cyan-400 drop-shadow-gray-950 transition-all duration-300 ease-in-out lg:mx-4 mx-2 mb-2 text-xs'>join us</button>
                    </div>
                </div>
                <div className="h-[85vh] md:h-screen max-w-[600px] min-w-[500px] bg-[linear-gradient(to_bottom,transparent_90%,#080709a1_5%),url(/Images/updated.png)] bg-cover bg-right"></div>
                {/* <img className='h-[80vh] md:h-screen max-w-[600px]' src="/Images/updated.png" alt="" /> */}
                {/* <div className="img md:mx-15 overflow-hidden md:overflow-visible">

</div> */}
            </div>
        </div>
    )
}

export default Home2
