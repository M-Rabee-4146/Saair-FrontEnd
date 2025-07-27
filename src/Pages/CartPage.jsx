// Pages/CartPage.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router'; // Use react-router-dom for navigate
import Navbar2 from '../Components/Navbar2';
import Footer from '../Components/Footer';
import CartItem from '../Components/CartItem'; // Ensure this path is correct
// Import ClearCart specifically from the slice as it's exported by name
import { ClearCart } from '../Redux/features/cart'; // IMPORTANT: Use 'ClearCart' as per your slice export
import { toast } from 'react-hot-toast';

export default function CartPage() {
    // CORRECTED: Access cart items from state.cart.cart as per your CartSlice's initialState structure
    // Your slice's state is { cart: [] }, so if mounted as 'cart' in store, it's state.cart.cart
    const cartItems = useSelector((state) => state.cart.cart);

    // Calculate totalAmount directly here since it's not part of the slice's state
    const totalAmount = cartItems?.reduce((acc, item) => acc + (item.totalprice * item.quantity), 0) || 0;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClearCart = () => {
        dispatch(ClearCart()); // Use the exact action name 'ClearCart'
    };

    const handleCheckout = () => {
        if (cartItems?.length > 0) {
            navigate('/checkout'); // Navigate to your checkout page route
        } else {
            toast.error("Your cart is empty. Please add items before checking out.");
        }
    };

    return (
        <div className="min-h-screen bg-[#080708] text-white font-poppins flex flex-col">
            <Navbar2 />

            <div className="container mx-auto px-4 py-8 pt-16 md:pt-20 flex-1">
                <h1 className="text-4xl md:text-6xl font-gothic-1 text-white mb-8 text-center">Your Shopping Cart</h1>

                {cartItems?.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-xl text-gray-400 mb-4">Your cart is empty.</p>
                        <p className="text-md text-gray-500">Looks like you haven't added anything to your cart yet. Go <a href="/Shop" className="text-cyan-400 hover:underline">shopping</a>!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2">
                            <div className="space-y-4">
                                {cartItems?.map((item) => (
                                    // Make sure CartItem component correctly uses the item prop
                                    // Your slice's Increment/Decrement/Remove actions expect just the _id as payload
                                    <CartItem key={item._id} item={item} />
                                    // NOTE: If items can have same _id but different color/size,
                                    // your CartSlice's logic for increment/decrement/remove needs to be updated
                                    // to use _id, color, and size for unique identification in the payload.
                                    // As per your request, the slice itself is not modified.
                                ))}
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleClearCart}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 ease-in-out font-saira text-base sm:text-base shadow-md"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1 bg-[#141414] rounded-l p-6 sm:p-8 shadow-lg">
                            <h2 className="text-2xl sm:text-2xl font-saira font-semibold text-white mb-6 border-b border-gray-700 pb-4">Order Summary</h2>

                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-300 text-lg font-saira">Subtotal ({cartItems?.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                                <span className="text-white text-xl font-saira font-semibold">Rs: {totalAmount?.toLocaleString()}</span>
                            </div>

                            <div className="border-t border-gray-700 pt-4 mt-6 flex justify-between items-center">
                                <span className="text-white text-xl font-semibold sm:text-2xl font-saira">Order Total</span>
                                <span className="text-cyan-400 text-2xl sm:text-3xl font-saira font-bold">Rs: {totalAmount?.toLocaleString()}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-cyan-400 text-black font-bold text-lg sm:text-lg font-saira py-2 rounded-lg mt-8 hover:bg-cyan-600 hover:text-white transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={cartItems?.length === 0}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}