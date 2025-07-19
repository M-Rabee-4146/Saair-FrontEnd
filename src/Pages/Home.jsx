import React from 'react'
import Home1 from '../Components/Home1'
import Home2 from '../Components/Home2'
import MenSection from '../Components/MenSection'
import Footer from '../Components/Footer'
import Services from '../Components/Services'
import Testimonials from '../Components/Testimonials'
import Cards from '../Components/Cards'
import { Link } from 'react-router'
import FAQs from '../Components/FAQs'


const Home = () => {
  return (
    <div className='bg-[#080708]  '>
      <header>
<Home2/>
      </header>
      <section>
        <Services/>
       <MenSection/>
      </section>
        {/* Heading and Navigation Buttons */}
                <div className="flex items-center justify-between mb-8 text-white px-10 max-w-7xl  mx-auto">
                    <h2 className="text-6xl font-gothic-1">Featured </h2>
                    <Link className="text-xl font-poppins hover:underline transition-all duration-300 ease-in-out ">See All </Link>
                </div>
      <Cards/>
      <Testimonials/>
<FAQs/>
      <Footer/>
    </div>
  )
}

export default Home
