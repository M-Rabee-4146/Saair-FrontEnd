import React from 'react'
import Navbar from '../Components/Navbar'
import { Link } from 'react-router'
const Home1 = () => {
  return (
    <div>
      
        <div className='bg-[url(./Images/hero.jpg)] h-screen bg-cover bg-center text-white'>
          <Navbar />
          <div className="relative flex items-center justify-center h-[90%]">
          <h1 className="md:text-[350px] text-8xl bottom-5 text-center text-gray-950 md:text-white  font-bold font-hadayat absolute md:top-27   left-[50%]  translate-x-[-50%] ">Aura</h1>
          <img className='h-[500px] absolute top-[60%]  left-[50%]  translate-x-[-50%] translate-y-[-50%]  hue-rotate-15  backdrop-filter' src="/Images/hero.png" alt="" />
          </div>
         <div className=" max-w-[1378px] mx-auto px-6 py-1 flex justify-between items-center">
          <div className="review">

          </div>
           <Link to="/watch">
            <button className='hover:bg-black bg-[#ffffff15] font-bold text-black hover:text-white backrop-filter backdrop-blur-xs py-1 px-4 rounded-full border border-[black] hover:shadow-md transition duration-200 '>Watch Now</button>
          </Link>
         </div>

        </div>
    </div>
  )
}

export default Home1
