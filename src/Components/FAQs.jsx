import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { useLocation } from 'react-router';

const faqs = [
  {
    question: 'What does Saair offer?',
    answer: 'Saair offers a premium collection of watches crafted for modern travelers — blending simplicity, elegance, and luxury into every design.'
  },
  {
    question: 'Do you offer watches for kids?',
    answer: 'Our watches are designed for youth and adults aged 16 and above. They feature a clean, aesthetic look that fits both casual and formal wear.'
  },
  {
    question: 'Do you offer delivery to foreign countries?',
    answer: 'At the moment, Saair delivers only within Pakistan. We’re working to expand our reach soon.'
  },
  {
    question: 'How is the delivery process?',
    answer: 'Once you place your order, our team quickly processes and ships it to your doorstep anywhere in Pakistan with proper tracking and updates.'
  }
];


export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);
  const faqRefs = useRef([]);
  const location=useLocation()


  const toggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  useEffect(() => {
    const handleScroll = () => {
      faqRefs.current.forEach((ref) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top < window.innerHeight - 100) {
            ref.classList.add('opacity-100', 'translate-y-0');
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={`bg-[#080708]  text-white pb-20 ${location.pathname=='/Shop'?'px-0 ':'px-4 md:px-10'} max-w-[1300px] mx-auto`}>
      <h2 className="text-6xl  mb-8 font-gothic-1 ">FAQs</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            ref={(el) => (faqRefs.current[index] = el)}
            className="border-b border-gray-800 pb-8 transform  translate-y-4 transition-all duration-700 ease-out"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center text-left text-lg font-medium focus:outline-none"
            >
              <div className="flex items-center gap-2 font-saira">
                {/* <QuestionMarkCircleIcon className="w-5 h-5 text-yellow-400" /> */}
                {faq.question}
              </div>
              <ChevronDownIcon
                className={`w-5 h-5 transform transition-transform duration-300 ease-in-out ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr]'} text-sm text-gray-300`}
            >
              <div className="overflow-hidden font-poppins">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
