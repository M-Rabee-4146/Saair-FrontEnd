import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router'; // Corrected import to react-router-dom
import { useDispatch, useSelector } from 'react-redux';
import { getSingleOrder } from '../Redux/features/order&sales'; // Assuming this path

// No longer importing a separate CSS file for animations, defining it in tailwind.config.js instead
// import './OrderConfirmation.css';

const OrderConfirmation = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    // Selectors from Redux state
    const order = useSelector((state) => state.order?.selectedOrder);
    const loading = useSelector((state) => state.order.loading);
    // Corrected error selector: assuming 'error' state in Redux slice
    const error = useSelector((state) => state.order.error);

    useEffect(() => {
        if (id) { // Only dispatch if ID is available
            dispatch(getSingleOrder(id));
        }
    }, [id, dispatch]); // Added dispatch to dependency array for best practice

    // Log the order to see the data coming from Redux
    console.log("Order Data from Redux:", order);

    if (loading) {
        return (
            // Apply your main background color here for loading state
            <div className="min-h-screen bg-[#080708] flex items-center justify-center">
                <p className="text-xl text-gray-300">Loading order details...</p>
            </div>
        );
    }

    if (error) {
        return (
            // Apply your main background color here for error state
            <div className="min-h-screen bg-[#080708] flex items-center justify-center">
                <p className="text-xl text-red-400 font-bold">Failed to load order details: {error?.message || 'Unknown error'}</p>
            </div>
        );
    }

    // Check if order exists and is not empty
    if (!order || Object.keys(order).length === 0) {
        return (
            // Apply your main background color here for not-found state
            <div className="min-h-screen bg-[#080708] flex items-center justify-center">
                <p className="text-xl text-gray-300">Order not found.</p>
            </div>
        );
    }

    // Safely access nested properties, especially for shippingAddress and product images
    const shippingAddress = order.shippingAddress || {};
    const orderItems = order.items || [];

    return (
        // Main page container with your specified background and padding
        <div className="bg-[#080708] w-full py-10 min-h-screen">
            <div className="max-w-4xl mx-auto p-8 bg-[#0E0E0E] border-[.1px] border-transparent hover:border-[#383838] rounded-xl shadow-lg text-center font-sans text-gray-100 transition-all duration-300">
                <h1 className="text-5xl md:text-6xl font-extrabold text-cyan-400 mb-6 animate-bounce-in font-gothic-1">🎉 Order Confirmed! 🎉</h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-4">
                    Thank you for your purchase, <strong className="text-white">{order.user?.name || 'Valued Customer'}</strong>!
                </p>
                <p className="text-lg md:text-xl text-gray-400 mb-8">
                    Your Order ID: <strong className="text-white">#{order._id}</strong>
                </p>

                <div className="text-left border border-[#383838] rounded-lg p-6 mb-8 bg-[#080708]">
                    <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-5 pb-3 border-b-2 border-[#383838] font-gothic-1">Order Summary</h2>

                    <div className="mb-6 pb-4 border-b border-dashed border-gray-700">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-300 mb-2">Shipping Address:</h3>
                        {/* Using fields from your provided order data */}
                        <p className="text-gray-400 text-base md:text-lg">{shippingAddress.fullName}</p>
                        <p className="text-gray-400 text-base md:text-lg">{shippingAddress.address}</p>
                        <p className="text-gray-400 text-base md:text-lg">{shippingAddress.city}, {shippingAddress.postalCode}</p>
                        <p className="text-gray-400 text-base md:text-lg">{shippingAddress.country}</p>
                        <p className="text-gray-400 text-base md:text-lg">Phone: {shippingAddress.phoneNumber}</p>
                        <p className="text-gray-400 text-base md:text-lg">Email: {shippingAddress.email}</p>
                    </div>

                    <div className="mb-6 pb-4 border-b border-dashed border-gray-700">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-300 mb-3">Items:</h3>
                        {orderItems.length > 0 ? (
                            orderItems.map((item, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center mb-3 pb-3 border-b border-dotted border-gray-700 last:border-b-0 last:pb-0">
                                    {item.product?.images && item.product.images.length > 0 && (
                                        <img
                                            src={`http://localhost:3200${item?.product?.images[0].url || item?.product?.images[0]}`} // Handle both .url property or direct string
                                            alt={item.product.title}
                                            className="w-20 h-20 object-cover object-center mr-0 sm:mr-4 mb-2 sm:mb-0 border border-gray-700 rounded-md flex-shrink-0"
                                        />
                                    )}
                                    <p className="text-gray-200 flex-grow text-base md:text-lg">
                                        <span className="font-medium">{item.product ? item.product.title : 'Product not found'}</span> x {item.quantity}
                                    </p>
                                    <span className="text-white font-bold text-base md:text-lg mt-1 sm:mt-0">Rs.{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-base md:text-lg">No items found for this order.</p>
                        )}
                    </div>

                    <div className="summary-section order-totals space-y-2 mb-6">
                        <p className="flex justify-between text-lg md:text-xl text-gray-300">Subtotal: <span className="font-bold text-white">Rs.{order?.subtotal?.toLocaleString()}</span></p>
                        <p className="flex justify-between text-lg md:text-xl text-gray-300">Delivery Charge: <span className="font-bold text-white">Rs.{order?.deliveryCharge?.toLocaleString()}</span></p>
                        {order.isGiftWrapped && (
                            <p className="flex justify-between text-lg md:text-xl text-gray-300">Gift Wrap Charge: <span className="font-bold text-white">Rs.{order?.giftWrapCharge?.toLocaleString()}</span></p>
                        )}
                        <p className="flex justify-between text-2xl md:text-3xl font-bold text-cyan-400 pt-3 border-t border-gray-700 mt-4">Total Amount: <span>Rs.{order?.totalAmount?.toLocaleString()}</span></p>
                        <p className="flex justify-between text-lg md:text-xl text-gray-300">Payment Method: <span className="font-semibold text-white">{order?.paymentMethod}</span></p>
                        <p className="flex justify-between text-lg md:text-xl text-gray-300">Status: <span className="font-semibold text-green-400">{order?.orderStatus}</span></p>
                        <p className="flex justify-between text-lg md:text-xl text-gray-300">Placed At: <span className="font-semibold text-white">{new Date(order?.placedAt).toLocaleString()}</span></p>
                    </div>

                    {order.isGiftWrapped && order.giftWrapCaption && (
                        <div className="bg-cyan-900/30 border-l-4 border-cyan-500 text-cyan-100 p-4 rounded-md italic text-sm md:text-base">
                            <p className="font-semibold mb-1">Gift Message:</p>
                            <p>"{order.giftWrapCaption}"</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-4 mt-8 flex-wrap">
                    <Link to="/Shop" className="px-8 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 transition duration-300 ease-in-out text-base md:text-lg whitespace-nowrap">
                        Continue Shopping
                    </Link>
                    {/* Optional: Link to a "My Orders" page */}
                    {/* <Link to="/my-orders" className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition duration-300 ease-in-out text-base md:text-lg whitespace-nowrap">
                        View My Orders
                    </Link> */}
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;