import React from 'react'

const MenSection = () => {
  return (
    <div>
      <div className="min-h-screen rounded-t-[70px] border-t-3 border-cyan-400 bg-[#080708] items-center  justify-between flex flex-col md:flex-row overflow-hidden p-6 ">


                <div className="flex-1">
                  <img
                    src="/Images/updated.png" alt="Arabic Boss Watch"
                    className=" w-full md:w-120  md:h-150 "
                  />
                </div>

                <div className="flex-1 space-y-4 w-full h-full flex flex-col justify-center items-center p-4 mt-8">
                  <h2 className="text-6xl  font-serif  text-center mx-auto text-white font-hadayat">
                    Arabic Boss
                  </h2>

                  <p className="text-sm text-gray-300 font-light w-[400px] text-center ">
                   Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet  sddaf consectetur, adipisicing elit. Laboriosam labore delectus                  </p>

                  <div className="flex items-center w-full justify-center  ">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrnnhKCbHMExmE9AaSknnGQHL5mD44v6Qn2w&s"
                      alt="Wearing Watch"
                      className="w-50 h-80 object-cover rounded-md mx-2  grayscale-100 hover:grayscale-0 transition duration-300 ease-in-out transform hover:scale-105"
                    />
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7684TsG32cu0CgAtX42QQkbbPa0S15rkEjw&s"
                      alt="Glitch Art"
                      className="w-50 h-80  object-cover rounded-md mx-2  grayscale-100 hover:grayscale-0 transition duration-300 ease-in-out transform hover:scale-105"
                    />
                  </div>
                </div>
      </div>
    </div>
  )
}

export default MenSection
