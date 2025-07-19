// Pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import Navbar2 from '../Components/Navbar2'; // Adjust path if necessary
import Footer from '../Components/Footer'; // Adjust path if necessary
import { createOrder, clearCreatedOrder, clearOrderError } from '../Redux/features/order&sales'; // Assuming you named it orderAndSalesSlice.js
import { ClearCart } from '../Redux/features/cart'; // Import ClearCart from your cart slice
import { toast } from 'react-hot-toast'; // For notifications

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Define fixed charges
    const DELIVERY_CHARGE = 200;
    const GIFT_WRAP_CHARGE = 100; // New: Gift wrap charge

    // Get cart items and total amount from the cart slice
    const cartItems = useSelector((state) => state.cart.cart);
    const subtotalAmount = cartItems?.reduce((acc, item) => acc + (item.totalprice * item.quantity), 0) || 0;

    // Get order creation state from orderSlice
    const { createLoading, error: orderError, createdOrder } = useSelector((state) => state.order);

    // Form state using useState (local component state for inputs)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        paymentMethod: 'Cash On Delivery', // Default payment method
        isGiftWrapped: false, // Gift Wrap option
        giftWrapCaption: '', // New: Gift wrap caption
    });

    // Calculate total amount including delivery charges and conditional gift wrap charge
    const totalAmount = subtotalAmount + DELIVERY_CHARGE + (formData.isGiftWrapped ? GIFT_WRAP_CHARGE : 0);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error("Your cart is empty. Please add items to checkout.");
            return;
        }

        // Validate gift wrap caption if gift wrap is selected
        if (formData.isGiftWrapped && !formData.giftWrapCaption.trim()) {
            toast.error("Please enter a caption for the gift wrap.");
            return;
        }

        // Construct the order details payload for the backend
        const orderDetails = {
            shippingAddress: {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
                country: formData.country,
            },
            items: cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity,
                price: item.totalprice,
                name: item.title,
                color: item.color,
                size: item.size
            })),
            subtotal: subtotalAmount,
            deliveryCharge: DELIVERY_CHARGE,
            isGiftWrapped: formData.isGiftWrapped,
            giftWrapCharge: formData.isGiftWrapped ? GIFT_WRAP_CHARGE : 0, // New: Include gift wrap charge
            giftWrapCaption: formData.isGiftWrapped ? formData.giftWrapCaption.trim() : '', // New: Include gift wrap caption
            totalAmount: totalAmount,
            paymentMethod: formData.paymentMethod,
            // user: currentUser._id, // e.g., if you have a user slice for the current user
        };

        // Dispatch the createOrder async thunk
        const resultAction = await dispatch(createOrder(orderDetails));

        // Check if the order creation was successful
        if (createOrder.fulfilled.match(resultAction)) {
            console.log(resultAction.payload)
            toast.success("Order placed successfully!");
            dispatch(ClearCart()); // Clear the cart after a successful order
            navigate(`/order-confirmation/${resultAction.payload.order._id}`);
            dispatch(clearCreatedOrder());
        } else {
            toast.error(orderError || "Failed to place order. Please try again.");
        }
    };

    // Effect to clear any previous order errors when component mounts or form data changes
    useEffect(() => {
        if (orderError) {
            dispatch(clearOrderError());
        }
    }, [dispatch, orderError, formData]);

    // Optional: Clear createdOrder if the user navigates away and then back to checkout page
    useEffect(() => {
        return () => {
            if (createdOrder) {
                dispatch(clearCreatedOrder());
            }
        };
    }, [dispatch, createdOrder]);


    return (
        <div className="min-h-screen bg-[#080708] text-white font-poppins flex flex-col">
            <Navbar2 />

            <div className="container mx-auto px-4 py-8 pt-16 md:pt-20 flex-1">
                <h1 className="text-4xl md:text-5xl font-gothic-1 text-white mb-8 text-center">Checkout</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipping Information Section */}
                    <div className="lg:col-span-2 bg-[#141414] rounded-lg p-6 sm:p-8 shadow-lg">
                        <h2 className="text-2xl sm:text-3xl font-gothic-1 text-white mb-6 border-b border-gray-700 pb-4">Shipping Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label htmlFor="fullName" className="block text-gray-300 text-sm font-semibold mb-2">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-[#080708] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-300 text-sm font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-[#080708] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                    placeholder="john.doe@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block text-gray-300 text-sm font-semibold mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-[#080708] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                    placeholder="+1 555 123 4567"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="address" className="block text-gray-300 text-sm font-semibold mb-2">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-[#080708] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                    placeholder="123 Main St"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="city" className="block text-gray-300 text-sm font-semibold mb-2">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-[#080708] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                    placeholder="New York"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="postalCode" className="block text-gray-300 text-sm font-semibold mb-2">Postal Code</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-[#080708] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                    placeholder="10001"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="country" className="block text-gray-300 text-sm font-semibold mb-2">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-[#080708] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                    placeholder="United States"
                                    required
                                />
                            </div>
                        </div>

                        {/* Payment Method Section */}
                        <h2 className="text-2xl sm:text-3xl font-gothic-1 text-white mb-6 border-b border-gray-700 pb-4 mt-8">Payment Method</h2>
                        <div className="space-y-4">
                            <label className="flex items-center text-gray-300 text-lg cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Cash On Delivery"
                                    checked={formData.paymentMethod === 'Cash On Delivery'}
                                    onChange={handleChange}
                                    className="hidden peer" // Add peer class for sibling styling
                                />
                                <span className="relative flex items-center justify-center w-5 h-5 border-2 border-cyan-400 rounded-full cursor-pointer transition-all duration-200 ease-in-out
                                        peer-checked:bg-cyan-400 peer-checked:border-cyan-400">
                                    {/* Inner dot for checked state */}
                                    <span className="w-2.5 h-2.5 bg-[#080708] rounded-full block
                                            transform scale-0 peer-checked:scale-100 transition-transform duration-200 ease-in-out">
                                    </span>
                                </span>
                                <span className="ml-3">Cash On Delivery (COD)</span>
                            </label>
                            {/* Other payment methods could go here */}
                        </div>

                        {/* Additional Options Section (including Gift Wrap) */}
                        <h2 className="text-2xl sm:text-3xl font-gothic-1 text-white mb-6 border-b border-gray-700 pb-4 mt-8">Additional Options</h2>
                        <div className="mb-6">
                            <label className="flex items-center text-gray-300 text-lg cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isGiftWrapped"
                                    checked={formData.isGiftWrapped}
                                    onChange={handleChange}
                                    className="form-checkbox h-5 w-5 text-cyan-400 bg-gray-700 border-gray-500 rounded focus:ring-cyan-400"
                                />
                                <span className="ml-3">Gift Wrap this order</span>
                            </label>

                            {/* New: Gift Wrap Caption Input (conditionally rendered) */}
                            {formData.isGiftWrapped && (
                                <div className="mt-4 pl-8"> {/* Indent the caption field */}
                                    <label htmlFor="giftWrapCaption" className="block text-gray-300 text-sm font-semibold mb-2">Gift Message/Caption</label>
                                    <textarea
                                        id="giftWrapCaption"
                                        name="giftWrapCaption"
                                        value={formData.giftWrapCaption}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full p-3 bg-[#080708] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                        placeholder="E.g., 'Happy Birthday, Mom! Love, [Your Name]'"
                                        maxLength="200"
                                        required // Make required if gift wrap is selected
                                    ></textarea>
                                    <p className="text-gray-500 text-sm mt-1">{formData.giftWrapCaption.length}/200 characters</p>
                                </div>
                            )}
                        </div>

                        {/* Error display */}
                        {orderError && (
                            <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 p-4 rounded-md mt-6">
                                <p className="font-semibold">Error:</p>
                                <p>{orderError}</p>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Section */}
                    <div className="lg:col-span-1 bg-[#141414] rounded-lg p-6 sm:p-8 shadow-lg h-fit sticky top-24">
                        <h2 className="text-2xl sm:text-3xl font-gothic-1 text-white mb-6 border-b border-gray-700 pb-4">Order Summary</h2>

                        {/* List of items in cart */}
                        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
                            {cartItems?.length > 0 ? (
                                cartItems.map((item) => (
                                    <div key={`${item._id}-${item.color || ''}-${item.size || ''}`} className="flex justify-between items-center text-sm text-gray-300">
                                        <span>{item.title} ({item.quantity})</span>
                                        <span>Rs: {(item.totalprice * item.quantity)?.toLocaleString()}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">Your cart is empty.</p>
                            )}
                        </div>

                        {/* Subtotal */}
                        <div className="flex justify-between items-center mb-4 border-t border-gray-700 pt-4">
                            <span className="text-gray-300 text-lg font-poppins">Subtotal ({cartItems?.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                            <span className="text-white text-xl font-saira font-semibold">Rs: {subtotalAmount?.toLocaleString()}</span>
                        </div>

                        {/* Delivery charges */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-300 text-lg font-poppins">Delivery Charges</span>
                            <span className="text-white text-xl font-saira font-semibold">Rs: {DELIVERY_CHARGE?.toLocaleString()}</span>
                        </div>

                        {/* New: Gift wrap charge (conditionally displayed) */}
                        {formData.isGiftWrapped && (
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-300 text-lg font-poppins">Gift Wrapping</span>
                                <span className="text-white text-xl font-saira font-semibold">Rs: {GIFT_WRAP_CHARGE?.toLocaleString()}</span>
                            </div>
                        )}

                        {/* Total */}
                        <div className="border-t border-gray-700 pt-4 mt-6 flex justify-between items-center">
                            <span className="text-white text-xl sm:text-2xl font-gothic-1">Order Total</span>
                            <span className="text-cyan-400 text-2xl sm:text-3xl font-saira font-bold">Rs: {totalAmount?.toLocaleString()}</span>
                        </div>

                        {/* Place Order Button */}
                        <button
                            type="submit"
                            className="w-full bg-cyan-400 text-black font-bold text-lg sm:text-xl font-saira py-3 rounded-lg mt-8 hover:bg-cyan-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            disabled={createLoading || cartItems?.length === 0}
                        >
                            {createLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : "Place Order"}
                        </button>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
}