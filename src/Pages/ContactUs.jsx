import React, { useState, useEffect } from 'react';
import Navbar2 from '../Components/Navbar2';
import Footer from '../Components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { submitContactForm, selectContactSubmitState, clearFormData, resetSubmitState } from '../Redux/features/contactSlice'; // Adjust path if needed

export default function ContactUs() {
  const dispatch = useDispatch();
  const { loading, error, success } = selectContactSubmitState;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    help: '',
    about: ''
  });

  // Effect to clear form and show success/error messages
  useEffect(() => {
    if (success) {
      // Form cleared by Redux after successful submission
      setFormData({ name: '', email: '', about: '', help: '' });
      // You can add a toast message here if not already handled by Redux slice's toast
      // toast.success("Your message has been sent successfully!");
    }
    if (error) {
      // toast.error(error || "Failed to submit contact form"); // Toast handled by Redux slice
    }
    // Clean up submit state after showing messages or on component unmount
    return () => {
      dispatch(resetSubmitState());
    };
  }, [success, error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitContactForm(formData)); // Dispatch the Redux thunk
  };

  return (
    <div className="min-h-screen bg-[#080708] text-white">
      <Navbar2/>
      <div className="flex flex-col md:flex-row pt-20 md:pt-24 px-4 md:p-10 gap-12">
        {/* Left side */}
        <div className="flex-1">
          <h1 className="text-8xl mb-6 font-gothic-1">Contact Us</h1>
          <p className="text-lg mb-6 text-gray-300 max-w-lg font-poppins">
            Saair is your trusted destination for premium timepieces. Crafted for elegance, designed for simplicity, and made to move with you—because every traveler deserves a timeless companion.
          </p>
          <ul className="space-y-4 text-md font-poppins">
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">✔</span> Browse timeless, travel-inspired watches
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">✔</span> Discover luxury styles for every journey
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">✔</span> Get expert recommendations from our team
            </li>
          </ul>

          <div className="mt-12 text-sm text-gray-400">
            <p>Want to know more about us?</p>
            {/* Make sure this link points to your actual About Us page route */}
            <a href="/about" className="text-white underline hover:text-cyan-400 transition-colors">Go to About Us →</a>
          </div>
        </div>

        {/* Right side form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-[#141414] text-white border hover:border-cyan-600 border-transparent rounded px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-poppins"
            disabled={loading} // Disable input while loading
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-[#141414] text-white border hover:border-cyan-600 border-transparent rounded px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-poppins"
            disabled={loading}
          />
          <input
            type="text"
            name="help"
            placeholder="What can we help you with?"
            value={formData.help}
            onChange={handleChange}
            className="w-full bg-[#141414] text-white border hover:border-cyan-600 border-transparent rounded px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-poppins"
            disabled={loading}
          />
          <textarea
            name="about"
            placeholder="Tell us more..."
            rows="5"
            value={formData.about}
            onChange={handleChange}
            className="w-full bg-[#141414] text-white border hover:border-cyan-600 border-transparent rounded px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-poppins"
            disabled={loading}
          ></textarea>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400 font-poppins">
              You can also email us at <a className="underline hover:text-cyan-400 transition-colors" href="mailto:rabijamil8@gmail.com">rabijamil8@gmail.com</a>
            </p>
            <button
              type="submit"
              className="bg-cyan-400 text-black px-6 py-2 rounded-xl font-semibold font-saira hover:bg-cyan-300 transition-all duration-300 ease-in
                         disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Sending...' : 'Send message'}
            </button>
          </div>
        </form>
      </div>
      <Footer/>
    </div>
  );
}