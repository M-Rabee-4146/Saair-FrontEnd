import { MapIcon, ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline'
import React from 'react'

const Services = () => {
  return (
    <div className='bg-[#080708] text-gray-300 py-10 min-h-[70vh] mx-auto'>
      <div className="flex justify-center items-center flex-col lg:flex-row px-4 md:px-10 gap-6">
        {[
          { name: 'Explore', paragraph: 'Watches built for every bold journey', icon: <MapIcon className='size-15 text-cyan-400' /> },
          { name: 'Trust', paragraph: 'Original timepieces. Verified. Guaranteed.', icon: <ShieldCheckIcon className='size-15 text-cyan-400' /> },
          { name: 'Deliver', paragraph: 'Fast, secure delivery across Pakistan', icon: <TruckIcon className='size-15 text-cyan-400' /> }
        ].map((item, index) =>
          <div key={index} className="card bg-[#0E0E0E] w-full h-[300px] rounded-2xl flex flex-col justify-start items-center gap-3
hover:bg-[#191919] transition-all duration-400 ease-in-out border-[.1px] border-transparent  hover:border-[#383838] p-6 py-10 group hover:shadow-2xl shadow ">
            <div className="icon size-26  bg-[linear-gradient(to_right,#181818,#181818)] rounded-2xl  groups-hover:bg-[linear-gradient(to_right,#4D4D4D,#292929)] transition-all duration3500 ease-in-out flex justify-center items-center relative overflow-hidden">{item.icon}
              <div className="absolute z-0 inset-0 transition-all duration-400 ease-in-out group-hover:opacity-100 opacity-0 bg-[linear-gradient(to_left,#d9d9d910,#d9d9d940)] "></div></div>
            <h1 className='text-5xl font-gothic-1'>{item.name}</h1>
            <p className='text-sm font-poppins text-center'>{item.paragraph}</p>
          </div>)}
      </div>
    </div>
  )
}

export default Services
