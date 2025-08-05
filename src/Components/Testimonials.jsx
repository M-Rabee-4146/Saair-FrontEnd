// src/components/Testimonials.jsx
import { useRef } from "react";
import { useSelector } from "react-redux";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Testimonials = () => {
const testimonials = [
  {
    name: 'Aisha K.',
    message:
      'Absolutely thrilled with my recent purchase from Saair! The quality of the product exceeded my expectations, and shipping was incredibly fast. Highly recommend!',
  },
  {
    name: 'Bilal R.',
    message:
      'Saair has become my go-to for online shopping. Their website is so easy to navigate, and the product descriptions are always accurate. Fantastic customer service too!',
  },
  {
    name: 'Zara S.',
    message:
      'I found exactly what I was looking for on Saair, and the entire process from Browse to checkout was seamless. Will definitely be a returning customer!',
  },
  {
    name: 'Hamza A.',
    message:
      'The items arrived well-packaged and in perfect condition. Saair offers great value for money and a wide selection. Very impressed!',
  },
  {
    name: 'Sana M.',
    message:
      'Had a question about my order and Saair\'s support team responded quickly and was very helpful. Excellent experience from start to finish!',
  },
  {
    name: 'Omar D.',
    message:
      'The product photos on Saair are true to life, which really helped my decision. I love the unique items they offer. Five stars!',
  },
];
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="bg-[#080708] text-white pb-16 px-4 md:px-10 max-w-7xl mx-auto">
      <div className="max-w-7xl mx-auto">
        {/* Heading and Navigation Buttons */}
        <div className="flex items-center justify-between mb-8 ">
          <h2 className="text-6xl font-gothic-1">Testimonials</h2>
          <div className="flex gap-2">
            <button
              ref={prevRef}
              className="bg-neutral-800 hover:bg-neutral-700 text-white rounded-full p-2"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              ref={nextRef}
              className="bg-neutral-800 hover:bg-neutral-700 text-white rounded-full p-2"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          loop={true}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
          }}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="py-3">
                <div className="
                transition-all duration-400 ease-in-out border-[.1px] border-[#383838a8]
                p-6 rounded-xl bg-gradient-to-b from-cyan-900  to-black   hover:border-cyan-900 shadow-inner min-h-[200px] relative">
                  <p className="text-sm md:text-[15px] font-light mb-6 font-poppins">{item.message}</p>
                  <div className="flex items-center gap-3 absolute bottom-6 left-6">
                    <div className="bg-cyan-700 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      {item.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-[14px] font-poppins ">{item.name}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 text-5xl text-white/10">“”</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;


  