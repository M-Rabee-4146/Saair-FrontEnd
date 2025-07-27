import React, { useEffect, useState } from 'react'
import Navbar2 from '../Components/Navbar2'
import { ArrowDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Cards from '../Components/Cards';
import Footer from '../Components/Footer';
import FAQs from '../Components/FAQs';
import { useDispatch, useSelector } from 'react-redux';
import { getallproducts } from '../Redux/features/product'; // Make sure this is imported
import { useParams } from 'react-router'; // Import useParams

const Shop = () => {
    // Get search term from URL params (e.g., /Shop/:initialSearchTerm)
    const { initialSearchTerm } = useParams();

    // Initialize searchTerm state with the URL param if it exists
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For Advanced Filter
    const [isDropdown2Open, setIsDropdown2Open] = useState(false); // For Category
    const [sortFilter, setSortFilter] = useState(''); // New state for sorting (New to Old, High to Low)
    const [category, setCategory] = useState('') // Category filter

    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.product); // Get products and loading/error states

    // Fetch all products on component mount
    useEffect(() => {
        dispatch(getallproducts());
    }, [dispatch]);

    // Update local searchTerm if initialSearchTerm param changes
    useEffect(() => {
        if (initialSearchTerm) {
            setSearchTerm(initialSearchTerm);
        }
    }, [initialSearchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // The search will be applied by passing searchTerm to Cards component
        // console.log('Search submitted for:', searchTerm);
    };

    // Handler for category selection
    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
        setIsDropdown2Open(false); // Close dropdown after selection
    };

    // Handler for advanced filter selection
    const handleSortFilterSelect = (selectedFilter) => {
        setSortFilter(selectedFilter);
        setIsDropdownOpen(false); // Close dropdown after selection
    };

    return (
        <div onClick={() => { setIsDropdown2Open(false); setIsDropdownOpen(false) }} className='bg-[#080708] min-h-screen pt-10 w-full'>
            <Navbar2 />
            <div className="main px-6 md:px-10">
                {/* <div className="w-full h-[50vh] bg-[url(https://wallpapersok.com/images/high/watch-black-screen-4k-z1rk79o46u3n96wl.webp)] bg-cover bg-center rounded-2xl mt-10">
                </div> */}
                <div className="mt-5">
                    <h1 style={{ lineHeight: .9 }} className='font-gothic-1 text-7xl lg:text-9xl  text-white leading-tight mt-10 mb- uppercase'> Your Time. Your Journey. <br /><span className='text-cyan-400 '> Your Watch.</span></h1>
                </div>
                <div className="searchbar mb-2 md:mb-4 mt-2 flex flex-col md:flex-row items-center justify-between ">
                    <form onSubmit={handleSearchSubmit} className='relative w-full sm:px-1 md:w-max '>
                        <input
                            onChange={handleSearchChange}
                            value={searchTerm} // Bind input value to state
                            type="search"
                            id='search'
                            className='border border-gray-500 active:border-cyan-400 focus:border-cyan-400 focus:shadow-lg shadow w-full md:w-[350px]  lg:w-[400px] h-[45px] rounded-xl p-4 active:outline-none outline outline-none placeholder:text-gray-500 text-white'
                            placeholder='Search for Watch'
                        />
                        <button type='submit' className="absolute sm:right-[4px] right-[1px] lg:top-[1px] top-[1px] border border-transparent transform h-ful hover:text-gray-90 font-[450] py-1 px-6 rounded-xl bg-[#fefefe1f] transition duration-200 backdrop-filter backdrop-blur-sm shadow-xl h-[43px] font-saira w-[75px] flex justify-center items-center">
                            <MagnifyingGlassIcon className='text-gray-100 size-5' />
                        </button>
                    </form>
                    <div className="flex w-full justify-between md:justify-end items-center my-4 md:my-0">
                        {/* Category Dropdown */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsDropdown2Open(!isDropdown2Open); setIsDropdownOpen(false); }}
                            className="border border-transparent transform h-ful hover:text-gray-90 font-[350] py-1 rounded-xl bg-[#fefefe1f] text-gray-300 active:border-cyan-400 transition-all duration-200 backdrop-filter backdrop-blur-sm shadow-xl h-[45px] md:min-w-max font-saira px-8 flex justify-center items-center md:mx-2 sm:mx-1 mx-0 hover:text-white hover:border-cyan-400 relative open:border-cyan-400"
                        >
                            {category === '' ? 'Category' : category}&nbsp;
                            {category === '' ? <ArrowDownIcon className='size-4' /> : <XMarkIcon className='size-4' onClick={(e) => { e.stopPropagation(); setCategory(''); setIsDropdown2Open(false); }} />}

                            <div className={`absolute top-12 w-[200px] h-max bg-[#080708] rounded-2xl py-3 border border-cyan-400 shadow-lg left-0 transform-3d origin-top ${isDropdown2Open ? 'opacity-100 z-[120]' : 'opacity-0 -z-[20] scale-y-[0]'} transition-all duration-300 ease-in-out`}>
                                {[
                                    { name: "Men's Choice", value: "Male" },
                                    { name: "Women's Choice", value: "Female" },
                                    { name: "Luxury", value: "Black" },
                                    { name: "Stainless Steel", value: "Stainless Steel" },
                                    { name: "Gold", value: "Gold" }
                                ].map((item, index) => (
                                    <div key={index} onClick={() => handleCategorySelect(item.value)} className="flex justify-start px-4 items-center w-full py-2 hover:bg-[#fefefe1f]">
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </button>

                        {/* Advanced Filter Dropdown */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); setIsDropdown2Open(false); }}
                            className="border border-transparent transform h-ful hover:text-gray-90 font-[350] py-1 rounded-xl bg-[#fefefe1f] text-gray-300 active:border-cyan-400 transition-all duration-200 backdrop-filter backdrop-blur-sm shadow-xl h-[45px] md:min-w-max font-saira px-8 flex justify-center items-center md:mx-2 sm:mx-1 mx-0 hover:text-white hover:border-cyan-400 relative open:border-cyan-400"
                        >
                            {sortFilter === '' ? 'Advanced Filter' : sortFilter}&nbsp;
                            {sortFilter === '' ? <ArrowDownIcon className='size-4' /> : <XMarkIcon className='size-4' onClick={(e) => { e.stopPropagation(); setSortFilter(''); setIsDropdownOpen(false); }} />}
                            <div className={`absolute top-12 w-[200px] h-max bg-[#080708] rounded-2xl py-3 border border-cyan-400 shadow-lg right-0 transform-3d origin-top ${isDropdownOpen ? 'opacity-100 z-[120]' : 'opacity-0 -z-[20] scale-y-[0]'} transition-all duration-300 ease-in-out`}>
                                <div onClick={() => handleSortFilterSelect('New to Old')} className="flex justify-start px-4 items-center w-full py-2 hover:bg-[#fefefe1f]">
                                    New to Old
                                </div>
                                <div onClick={() => handleSortFilterSelect('Old to New')} className="flex justify-start px-4 items-center w-full py-2 hover:bg-[#fefefe1f]"> {/* Added Old to New */}
                                    Old to New
                                </div>
                                <div onClick={() => handleSortFilterSelect('Price: High to Low')} className="flex justify-start px-4 items-center w-full py-2 hover:bg-[#fefefe1f]">
                                    Price: High to Low
                                </div>
                                <div onClick={() => handleSortFilterSelect('Price: Low to High')} className="flex justify-start px-4 items-center w-full py-2 hover:bg-[#fefefe1f]"> {/* Added Low to High */}
                                    Price: Low to High
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Pass all relevant filter states to Cards component */}
                <Cards
                    searchTerm={searchTerm}
                    filterCategory={category} // Renamed prop for clarity
                    sortFilter={sortFilter} // New prop for sorting
                    allProducts={products} // Pass the raw products from Redux
                    loading={loading}
                    error={error}
                />
                <FAQs />
                <Footer />
            </div>
        </div>
    )
}

export default Shop;