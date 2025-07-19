// Components/CartItem.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
// Corrected: Imported action names to match your CartSlice's exports
import { RemoveItem, IncrementQuantity, DecrementQuantity } from '../Redux/features/cart';
import { TrashIcon } from '@heroicons/react/24/outline'; // Icon for removal

export default function CartItem({ item }) {
    const dispatch = useDispatch();

    const handleRemove = () => {
        // Corrected: Pass only the _id as payload, as per your CartSlice's RemoveItem reducer
        dispatch(RemoveItem(item._id));
    };

    const handleIncrease = () => {
        // Corrected: Pass only the _id as payload, as per your CartSlice's IncrementQuantity reducer
        dispatch(IncrementQuantity(item._id));
    };

    const handleDecrease = () => {
        // Corrected: Pass only the _id as payload, as per your CartSlice's DecrementQuantity reducer
        dispatch(DecrementQuantity(item._id));
    };

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
            default: return '#6b7280'; // Default gray
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center bg-[#141414] rounded-lg p-4 sm:p-6 mb-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.005]">
            {/* Product Image */}
            <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-[#080708] rounded-md overflow-hidden flex items-center justify-center p-2 mb-4 sm:mb-0 sm:mr-6">
                <img
                    src={`http://localhost:3200${item.images?.[0]}`}
                    alt={item.title}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Product Details */}
            <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between w-full">
                <div className="flex-grow mb-4 sm:mb-0">
                    <h3 className="text-xl sm:text-2xl font-gothic-1 text-white leading-tight mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm sm:text-base font-poppins mb-2">
                        {item.color !== 'N/A' && (
                            <span className="flex items-center">
                                Color: <span className="ml-1 font-semibold">{item.color}</span>
                                <span
                                    className={`w-4 h-4 rounded-full border border-gray-500 ml-2`}
                                    style={{ backgroundColor: getColorHex(item.color) }}
                                    title={item.color}
                                ></span>
                            </span>
                        )}
                        {item.size !== 'N/A' && (
                            <span className="ml-0 sm:ml-4">Size: <span className="font-semibold">{item.size}</span></span>
                        )}
                    </p>
                    <p className="text-cyan-400 text-lg sm:text-xl font-saira font-semibold">Rs: {item.totalprice?.toLocaleString()}</p>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-0 sm:mr-6">
                    <button
                        onClick={handleDecrease}
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-[#080708] text-cyan-400 rounded-lg border border-cyan-400 hover:bg-cyan-400 hover:text-[#080708] transition-colors text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        -
                    </button>
                    <span className="text-2xl sm:text-3xl font-saira text-white">{item.quantity}</span>
                    <button
                        onClick={handleIncrease}
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-[#080708] text-cyan-400 rounded-lg border border-cyan-400 hover:bg-cyan-400 hover:text-[#080708] transition-colors text-lg font-bold"
                    >
                        +
                    </button>
                </div>

                {/* Total Price for item & Remove Button */}
                <div className="flex flex-col items-end space-y-2">
                    <span className="text-white text-xl sm:text-2xl font-saira font-bold">Rs: {(item.totalprice * item.quantity)?.toLocaleString()}</span>
                    <button
                        onClick={handleRemove}
                        className="text-red-400 hover:text-red-600 transition-colors flex items-center text-sm sm:text-base"
                    >
                        <TrashIcon className="h-4 w-4 mr-1" /> Remove
                    </button>
                </div>
            </div>
        </div>
    );
}