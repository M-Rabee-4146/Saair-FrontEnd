import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router'; // Use react-router-dom
import { useDispatch, useSelector } from 'react-redux';
import { getSingleOrder, updateOrderStatus } from '../Redux/features/order&sales'; // Correct path
import toast from 'react-hot-toast';
import { ChevronLeftIcon, EyeIcon, CheckCircleIcon, XCircleIcon, TruckIcon, ClockIcon } from '@heroicons/react/24/outline'; // Added ChevronLeftIcon for back button
import ConfirmationModal from './components/ConfirmationModal'; // Adjust path if needed

const AdminOrderDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Selectors from Redux state for a single order
    const order = useSelector((state) => state.order?.selectedOrder);
    const loading = useSelector((state) => state.order.loading); // Loading state for fetching single order
    const error = useSelector((state) => state.order.error);   // Error state for fetching single order
    const updateLoading = useSelector((state) => state.order.updateLoading); // Loading state for status update

    const [selectedStatusOption, setSelectedStatusOption] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        if (id) {
            dispatch(getSingleOrder(id));
        }
    }, [id, dispatch]);

    // Set initial selectedStatusOption once order is loaded
    useEffect(() => {
        if (order && !selectedStatusOption) {
            setSelectedStatusOption(order.orderStatus || 'Pending'); // Use orderStatus, default to 'Pending'
        }
    }, [order, selectedStatusOption]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Pending': return 'text-yellow-400 bg-yellow-900/20';
            case 'Processing': return 'text-blue-400 bg-blue-900/20';
            case 'Shipped': return 'text-purple-400 bg-purple-900/20';
            case 'Delivered': return 'text-green-400 bg-green-900/20';
            case 'Cancelled': return 'text-red-400 bg-red-900/20';
            default: return 'text-gray-400 bg-gray-700/20';
        }
    };

    const handleUpdateClick = () => {
        if (!order) {
            toast.error("Order data not loaded.");
            return;
        }
        if (!selectedStatusOption || selectedStatusOption === order.orderStatus) {
            toast.info("No new status selected or already the current status.");
            return;
        }

        setModalTitle(`Confirm Status Update for Order #${order._id.substring(0, 8)}`);
        setModalMessage(`Are you sure you want to change the status of this order from "${order.orderStatus}" to "${selectedStatusOption}"?`);
        setIsModalOpen(true);
    };

    const handleUpdateConfirm = async () => {
        if (!order || !selectedStatusOption) return;

        setIsModalOpen(false); // Close modal immediately
        try {
            const resultAction = await dispatch(updateOrderStatus({ orderId: order._id, status: selectedStatusOption }));
            if (updateOrderStatus.fulfilled.match(resultAction)) {
                toast.success(`Order #${order._id.substring(0, 8)} status updated to "${selectedStatusOption}" successfully!`);
                // Re-fetch order to ensure UI is updated with latest data
                dispatch(getSingleOrder(id));
            } else if (updateOrderStatus.rejected.match(resultAction)) {
                toast.error(resultAction.payload || "Failed to update order status.");
            }
        } catch (err) {
            toast.error(err.message || "An error occurred during update.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080708] text-white flex items-center justify-center">
                <p className="text-xl text-gray-400">Loading order details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#080708] text-white flex flex-col items-center justify-center p-4">
                <p className="text-xl text-red-500 mb-4">Error: {error?.message || "Failed to load order details."}</p>
                <button
                    onClick={() => dispatch(getSingleOrder(id))}
                    className="text-cyan-400 hover:underline px-4 py-2 rounded-lg bg-[#0E0E0E] mt-4"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!order || Object.keys(order).length === 0) {
        return (
            <div className="min-h-screen bg-[#080708] text-white flex items-center justify-center">
                <p className="text-xl text-gray-400">Order not found.</p>
            </div>
        );
    }

    const shippingAddress = order.shippingAddress || {};
    const orderItems = order.items || [];

    const orderStatusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    return (
        <div className="min-h-screen bg-[#080708] text-white py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-cyan-400 hover:text-cyan-300 mb-6 text-lg transition-colors"
                >
                    <ChevronLeftIcon className="h-6 w-6 mr-2" /> Back to Orders
                </button>

                <h1 className="text-5xl md:text-6xl font-gothic-1 text-cyan-400 mb-4">Order Details</h1>
                <p className="text-md md:text-lg mb-8 text-gray-400 max-w-2xl font-poppins">
                    Detailed view of order <span className="font-semibold text-white">#{order._id.substring(0, 10)}...</span>
                </p>

                <div className="bg-[#0E0E0E] rounded-2xl shadow-lg border-[.1px] border-transparent hover:border-[#383838] transition-all duration-300 p-6 sm:p-8 space-y-8">

                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-700">
                        <div>
                            <p className="text-2xl font-bold text-white mb-1">Order ID: <span className="text-cyan-400">{order._id}</span></p>
                            <p className="text-gray-400 text-lg">Placed At: {new Date(order.placedAt).toLocaleString()}</p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <span className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClasses(order.orderStatus)}`}>
                                Status: {order.orderStatus}
                            </span>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="border border-gray-800 rounded-lg p-4 bg-[#151515] hover:border-[#383838] transition-colors duration-200">
                        <h3 className="text-xl font-bold text-cyan-400 mb-3 border-b border-gray-700 pb-2">Customer Information</h3>
                        <p className="text-gray-300 text-lg">Name: <span className="text-white">{order.user?.name || 'N/A'}</span></p>
                        <p className="text-gray-300 text-lg">Email: <span className="text-white">{order.user?.email || 'N/A'}</span></p>
                        <p className="text-gray-300 text-lg">Phone: <span className="text-white">{shippingAddress.phoneNumber || 'N/A'}</span></p>
                    </div>

                    {/* Shipping Address */}
                    <div className="border border-gray-800 rounded-lg p-4 bg-[#151515] hover:border-[#383838] transition-colors duration-200">
                        <h3 className="text-xl font-bold text-cyan-400 mb-3 border-b border-gray-700 pb-2">Shipping Address</h3>
                        <p className="text-gray-300 text-lg">{shippingAddress.fullName}</p>
                        <p className="text-gray-300 text-lg">{shippingAddress.address}</p>
                        <p className="text-gray-300 text-lg">{shippingAddress.city}, {shippingAddress.postalCode}</p>
                        <p className="text-gray-300 text-lg">{shippingAddress.country}</p>
                    </div>

                    {/* Order Items */}
                    <div className="border border-gray-800 rounded-lg p-4 bg-[#151515] hover:border-[#383838] transition-colors duration-200">
                        <h3 className="text-xl font-bold text-cyan-400 mb-3 border-b border-gray-700 pb-2">Items</h3>
                        {orderItems.length > 0 ? (
                            <div className="space-y-4">
                                {orderItems.map((item, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center py-2 border-b border-dotted border-gray-700 last:border-b-0">
                                        {item.product?.images && item.product.images.length > 0 && (
                                            <img
                                                src={`http://localhost:3200${item.product.images[0].url || item.product.images[0]}`}
                                                alt={item.product.title}
                                                className="w-20 h-20 object-cover object-center mr-0 sm:mr-4 mb-2 sm:mb-0 rounded-md border border-gray-700 flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-grow">
                                            <p className="text-gray-200 font-semibold text-lg">{item.product ? item.product.title : 'Product not found'}</p>
                                            <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                                            <p className="text-gray-400 text-sm">Color: {item.color || 'N/A'}, Size: {item.size || 'N/A'}</p>
                                        </div>
                                        <span className="text-white font-bold text-lg mt-2 sm:mt-0">Rs.{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-lg">No items found for this order.</p>
                        )}
                    </div>

                    {/* Order Summary & Totals */}
                    <div className="border border-gray-800 rounded-lg p-4 bg-[#151515] hover:border-[#383838] transition-colors duration-200">
                        <h3 className="text-xl font-bold text-cyan-400 mb-3 border-b border-gray-700 pb-2">Financial Summary</h3>
                        <div className="space-y-2">
                            <p className="flex justify-between text-lg text-gray-300">Subtotal: <span className="font-bold text-white">Rs.{order.subtotal.toLocaleString()}</span></p>
                            <p className="flex justify-between text-lg text-gray-300">Delivery Charge: <span className="font-bold text-white">Rs.{order.deliveryCharge.toLocaleString()}</span></p>
                            {order.isGiftWrapped && (
                                <p className="flex justify-between text-lg text-gray-300">Gift Wrap Charge: <span className="font-bold text-white">Rs.{order.giftWrapCharge.toLocaleString()}</span></p>
                            )}
                            <p className="flex justify-between text-2xl font-bold text-cyan-400 pt-3 border-t border-gray-700 mt-4">Total Amount: <span>Rs.{order.totalAmount.toLocaleString()}</span></p>
                            <p className="flex justify-between text-lg text-gray-300">Payment Method: <span className="font-semibold text-white">{order.paymentMethod}</span></p>
                        </div>

                        {order.isGiftWrapped && order.giftWrapCaption && (
                            <div className="bg-cyan-900/30 border-l-4 border-cyan-500 text-cyan-100 p-4 rounded-md italic text-sm mt-4">
                                <p className="font-semibold mb-1">Gift Message:</p>
                                <p>"{order.giftWrapCaption}"</p>
                            </div>
                        )}
                    </div>

                    {/* Status Update Section */}
                    <div className="border border-gray-800 rounded-lg p-4 bg-[#151515] hover:border-[#383838] transition-colors duration-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <label htmlFor="orderStatus" className="text-lg font-semibold text-gray-300 whitespace-nowrap">Update Status:</label>
                        <select
                            id="orderStatus"
                            value={selectedStatusOption}
                            onChange={(e) => setSelectedStatusOption(e.target.value)}
                            className="flex-grow w-full sm:w-auto bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 text-lg focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
                            disabled={updateLoading}
                        >
                            {orderStatusOptions.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleUpdateClick}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out text-lg flex-shrink-0"
                            disabled={updateLoading || selectedStatusOption === order.orderStatus}
                        >
                            {updateLoading ? 'Updating...' : 'Save Status'}
                        </button>
                    </div>

                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleUpdateConfirm}
                title={modalTitle}
                message={modalMessage}
                confirmText="Confirm Update"
                confirmButtonClass="bg-blue-600 hover:bg-blue-700"
                isLoading={updateLoading}
            />
        </div>
    );
};

export default AdminOrderDetail;