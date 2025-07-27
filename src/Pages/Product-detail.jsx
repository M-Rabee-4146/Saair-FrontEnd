import React, { useEffect, useState } from 'react';
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';
import Navbar2 from '../Components/Navbar2';
import Footer from '../Components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getsingleproduct } from '../Redux/features/product'; // Assuming this exists
import { addToCart } from '../Redux/features/cart';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router'; // Import useNavigate for redirection

export default function ProductDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate

    const { selectedProduct, loading, error } = useSelector((state) => state.product); // Assuming 'product' slice is correct

    // Local state for UI interactions
    const [mainImage, setMainImage] = useState('');
    const [selectedColorName, setSelectedColorName] = useState('');
    const [selectedSizeValue, setSelectedSizeValue] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (id) {
            dispatch(getsingleproduct(id));
        }
    }, [dispatch, id]);

    // Effect to set initial state for image, color, and size once product data is loaded
    useEffect(() => {
        if (selectedProduct) {
            if (selectedProduct.images && selectedProduct.images.length > 0) {
                setMainImage(selectedProduct.images[0]);
            } else {
                setMainImage(''); // Default or placeholder if no images
            }

            // Ensure color and size are set, even if they are 'N/A' from the product data
            setSelectedColorName(selectedProduct.color || 'N/A');
            setSelectedSizeValue(selectedProduct.size || 'N/A');
            setQuantity(1); // Reset quantity to 1 when a new product loads
        }
    }, [selectedProduct]);

    // Function to map color names to hex codes for the display swatch
    const getColorHex = (colorName) => {
        switch (colorName?.toLowerCase()) {
            case 'dark cyan': return '#008B8B';
            case 'black': return '#000000';
            case 'silver': return '#C0C0C0';
            case 'gold': return '#FFD700';
            case 'blue': return '#0000FF';
            case 'white': return '#FFFFFF';
            case 'red': return '#FF0000';
            default: return '#6b7280'; // Default gray if color is unknown
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080708] text-white font-poppins flex flex-col justify-center items-center">
                <p className="text-xl">Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#080708] text-white font-poppins flex flex-col justify-center items-center">
                <p className="text-xl text-red-500">Error loading product: {error}</p>
            </div>
        );
    }

    if (!selectedProduct) {
        return (
            <div className="min-h-screen bg-[#080708] text-white font-poppins flex flex-col justify-center items-center">
                <p className="text-xl">Product not found.</p>
            </div>
        );
    }

    const handleThumbnailClick = (imagePath) => {
        setMainImage(imagePath);
    };

    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const handleAddToCart = () => {
        if (selectedProduct) {
            dispatch(addToCart({
                _id: selectedProduct._id,
                title: selectedProduct.title,
                images: selectedProduct.images,
                totalprice: selectedProduct.totalprice,
                color: selectedColorName,
                size: selectedSizeValue,
                quantity: quantity
            }));
            toast.success(`${quantity} ${selectedProduct.title} added to cart!`);
        } else {
            toast.error("Cannot add to cart, product data not loaded.");
        }
    };

    // New: handleBuyNow function
    const handleBuyNow = () => {
        if (selectedProduct) {
            // Add product to cart
            dispatch(addToCart({
                _id: selectedProduct._id,
                title: selectedProduct.title,
                images: selectedProduct.images,
                totalprice: selectedProduct.totalprice,
                color: selectedColorName,
                size: selectedSizeValue,
                quantity: quantity
            }));
            toast.success(`${quantity} ${selectedProduct.title} added to cart and redirecting to checkout!`);
            // Redirect to checkout page
            navigate('/Cart');
        } else {
            toast.error("Cannot proceed to checkout, product data not loaded.");
        }
    };

    // Function to render star rating (still commented out as no rating data)
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<StarIcon key={`full-${i}`} className="h-5 w-5 text-cyan-400" />);
        }
        if (hasHalfStar) {
            stars.push(
                <StarIcon key="half" className="h-5 w-5 text-cyan-400 opacity-50"
                    style={{ clipPath: 'inset(0 50% 0 0)' }}
                />
            );
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<StarIcon key={`empty-${i}`} className="h-5 w-5 text-gray-700" />);
        }
        return <div className="flex">{stars}</div>;
    };

    return (
        <div className="min-h-screen bg-[#080708] text-white font-poppins flex flex-col">
            <Navbar2 />

            <div className="md:px-10 px-6 pt-20 flex-1 pb-10">

                {/* Product Grid Layout */}
                <div className="md:grid md:grid-cols-2 md:gap-6 lg:gap-8 ">
                    {/* Left Column (Images & Thumbnails) */}
                    <div className="flex flex-col lg:flex-col lg:items-start">
                        {/* Main Product Image */}
                        <div className="w-full max-h-[430px] flex-shrink-0 mb-6 lg:mb-4 bg-[#141414] rounded-lg overflow-hidden flex items-center justify-center ">
                            {mainImage ? (
                                <img
                                src={`https://saair-backend-production.up.railway.app${mainImage}`}
                                    alt={selectedProduct.title}
                                    className="w-full h-auto object-contain max-h-[500px]"
                                />
                            ) : (
                                <div className="text-gray-500">No Image Available</div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {selectedProduct.images && selectedProduct.images.length > 0 && (
                            <div className="w-full lg:w-1/5 flex-grow lg:flex lg:flex-col lg:space-y-4 space-x-3 lg:space-x-0 overflow-x-auto lg:overflow-y-auto pb-2 custom-scrollbar">
                                <div className="flex lg:flex-col">
                                    {selectedProduct.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`flex-shrink-0 w-20 h-20 lg:w-full lg:h-auto lg:aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200
                                                ${mainImage === image ? 'border-cyan-400' : 'border-[#383838] hover:border-gray-500'}
                                                bg-[#141414] p-1 flex items-center justify-center
                                                ${index > 0 ? 'ml-3 lg:ml-0 lg:mt-3' : ''}
                                            `}
                                            onClick={() => handleThumbnailClick(image)}
                                        >
                                            <img
                                                src={`https://saair-backend-production.up.railway.app${image}`}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Product Details) */}
                    <div className="pt-6 lg:pt-0 max-w-xl">
                        {/* Mobile-specific Product Header */}
                        <div className="md:hidden flex flex-col items-start mb-2">
                            <h2 className="text-5xl font-gothic-1 text-white leading-tight">{selectedProduct.title}</h2>
                            <p className="text-md text-gray-400 font-poppins">{selectedProduct.category[0] || 'N/A'}</p>
                            {/* Rating/Reviews if you add them: */}
                            {/* <div className="flex items-center mt-2">
                                {renderStars(selectedProduct.rating)}
                                <span className="text-gray-400 ml-2 text-sm font-saira">({selectedProduct.reviews} Reviews)</span>
                            </div> */}
                        </div>

                        {/* Desktop-specific Product Header */}
                        <div className="hidden md:block">
                            <h1 className="text-4xl md:text-6xl font-gothic-1 text-white leading-tight">{selectedProduct.title}</h1>
                            <p className="text-xl text-gray-400 font-saira mb-4">{selectedProduct.category?.join(', ') || 'N/A'}</p>
                            {/* Rating/Reviews if you add them: */}
                            {/* <div className="flex items-center mb-6">
                                {renderStars(selectedProduct.rating)}
                                <span className="text-gray-300 ml-3 text-lg font-saira">({selectedProduct.reviews} Reviews)</span>
                            </div> */}
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline  mb-3 md:mb-2">
                            <span className="md:text-4xl text-3xl font-saira text-cyan-400 mr-3 font-semibold">Rs: {selectedProduct.totalprice?.toLocaleString()}</span>
                            {selectedProduct.discountedPrice && selectedProduct.discountedPrice !== null && (
                                <span className="text-xl text-gray-500 line-through font-saira">Rs: {selectedProduct.discountedPrice.toLocaleString()}</span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <h3 className="md:text-2xl text-xl font-saira font-semibold text-white mb-1">Description:</h3>
                            <p className="text-gray-300 leading-relaxed text-[15px] font-poppins line-clamp-6">{selectedProduct.description}</p>
                            <ul className="list-disc list-inside text-gray-400 mt-1 text-sm font-poppins">
                                {selectedProduct.type && <li>Type: {selectedProduct.type}</li>}
                                {selectedProduct.material && <li>Material: {selectedProduct.material}</li>}
                                {selectedProduct.available !== undefined && <li>Available: {selectedProduct.available} in stock</li>}
                            </ul>
                        </div>

                        {/* Color Display (since it's a single string, not an array of choices) */}
                        <div className="flex mb-4 justify-between items-center">
                            {/* Size Display (since it's a single string, not an array of choices) */}
                            <div className="">
                                <h3 className="md:text-2xl text-xl font-saira font-semibold text-white">Size: <span className="font-normal text-gray-300">{selectedSizeValue}mm</span></h3>
                            </div>

                            {/* Quantity Control */}
                            <div className="flex justify-center items-center">
                                <h3 className="md:text-2xl text-xl font-saira font-semibold text-white ">Quantity:</h3>
                                <div className="flex items-center space-x-4 ml-2">
                                    <button
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1} // Disable if quantity is 1
                                        className="px-2 bg-[#1A1A1A] text-cyan-400 rounded-lg border border-cyan-400 hover:bg-cyan-400 hover:text-[#080708] transition-colors text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        -
                                    </button>
                                    <span className="md:text-3xl text-2xl font-saira text-white">{quantity}</span>
                                    <button
                                        onClick={increaseQuantity}
                                        disabled={selectedProduct.available === 0 || quantity >= selectedProduct.available} // Disable if out of stock or quantity reaches available stock
                                        className="px-2 bg-[#1A1A1A] text-cyan-400 rounded-lg border border-cyan-400 hover:bg-cyan-400 hover:text-[#080708] transition-colors text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Actions: Add to Cart / Buy Now */}
                        <div className="flex  space-x-4 space-y-4 sm:space-y-0 mt-2">
                            <button
                                onClick={handleAddToCart}
                                disabled={selectedProduct.available === 0} // Disable if out of stock
                                className="flex-1 bg-cyan-400 text-black font-bold text-sm font-saira w-28 h-10 uppercase rounded-lg hover:bg-cyan-600 transition-all flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed duration-300"
                            >
                                <ShoppingBagIcon className="h-4 w-4 mr-3 " />
                                {selectedProduct.available === 0 ? 'Out of Stock' : 'Add To Cart'}
                            </button>
                            <button
                                onClick={handleBuyNow} // Changed to call handleBuyNow
                                className="flex-1 -28 h-10 uppercase bg-[#1A1A1A] text-white text-sm font-saira py-4 rounded-lg border border-gray-400 hover:shadow-cyan-400  transition-all flex items-center justify-center shadow-md hover:border-cyan-400"
                                disabled={selectedProduct.available === 0} // Disable if out of stock
                            >
                                Buy Now
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
