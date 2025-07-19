// src/admin/Orders/AdminOrderDetails.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router';
import { getSingleOrder, updateOrderStatus } from '../Redux/features/order&sales';
import toast from 'react-hot-toast';
import {
    ArrowLeftIcon,
    CurrencyDollarIcon,
    CalendarDaysIcon,
    UserCircleIcon,
    HomeIcon,
    PhoneIcon,
    EnvelopeIcon,
    ShoppingCartIcon,
    ClockIcon,
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import ConfirmationModal from './components/ConfirmationModal';

const AdminOrderDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedOrder, loading, error, updateLoading } = useSelector((state) => state.order);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        if (id) {
            dispatch(getSingleOrder(id));
        }
    }, [dispatch, id]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Pending': return 'text-yellow-500 bg-yellow-900/20';
            case 'Processing': return 'text-blue-500 bg-blue-900/20';
            case 'Shipped': return 'text-purple-500 bg-purple-900/20';
            case 'Delivered': return 'text-green-500 bg-green-900/20';
            case 'Cancelled': return 'text-red-500 bg-red-900/20';
            default: return 'text-gray-400 bg-gray-700/20';
        }
    };

    const handleStatusChangeClick = (currentStatus) => {
        const statusOptions = {
            'Pending': ['Processing', 'Cancelled'],
            'Processing': ['Shipped', 'Cancelled'],
            'Shipped': ['Delivered', 'Cancelled'],
            'Delivered': [],
            'Cancelled': [],
        };
        const nextStatuses = statusOptions[currentStatus] || [];

        if (nextStatuses.length > 0) {
            // For details page, let's offer a select dropdown in the modal
            // For simplicity here, we'll just pick the first non-cancel option for the example
            // In a real scenario, you'd want a dropdown in the modal
            setNewStatus(nextStatuses[0]); // Defaulting to first option
            setModalTitle(`Update Order #${id?.substring(0, 8)} Status`);
            setModalMessage(`Select new status for order #${id?.substring(0, 8)}:`);
            setIsModalOpen(true);
        } else {
            toast.info(`Order #${id?.substring(0, 8)} is already "${currentStatus}". No further status changes allowed.`);
        }
    };

    const handleUpdateConfirm = async () => {
        if (!id || !newStatus) return;

        setIsModalOpen(false);
        try {
            const resultAction = await dispatch(updateOrderStatus({ orderId: id, status: newStatus }));
            if (updateOrderStatus.fulfilled.match(resultAction)) {
                toast.success(`Order #${id?.substring(0, 8)} status updated to "${newStatus}" successfully!`);
            } else {
                toast.error(resultAction.payload || "Failed to update order status.");
            }
        } catch (err) {
            toast.error(err.message || "An error occurred during update.");
        }
    };


    const detailItemClass = "flex items-center text-gray-300 font-poppins text-md py-1";
    const detailIconClass = "h-5 w-5 text-cyan-400 mr-3 flex-shrink-0";
    const labelClass = "font-bold min-w-[120px] text-cyan-400 font-saira flex-shrink-0";
    const valueClass = "text-gray-300 flex-grow text-right font-poppins";
    const sectionHeadingClass = "text-3xl font-gothic-1 mb-6 text-cyan-400";
    const cardClass = "p-6 bg-[#0E0E0E] rounded-2xl shadow-lg border border-[#191919] hover:bg-[#191919] transition-all duration-300 ease-in-out hover:border-[#383838]";


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
                <p className="text-xl text-red-500 mb-4">Error: {error || "Failed to load order details."}</p>
                <Link to="/admin/orders" className="text-cyan-400 hover:underline">
                    Go back to Orders
                </Link>
            </div>
        );
    }

    if (!selectedOrder) {
        return (
            <div className="min-h-screen bg-[#080708] text-white flex flex-col items-center justify-center p-4">
                <p className="text-xl text-gray-400 mb-4">Order not found.</p>
                <Link to="/admin/orders" className="text-cyan-400 hover:underline">
                    Go back to Orders
                </Link>
            </div>
        );
    }

    const orderDate = new Date(selectedOrder.createdAt).toLocaleString();

    return (
        <div className="min-h-screen bg-[#080708] text-white px-4 md:px-10 py-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-5xl font-gothic-1 text-cyan-400 mb-4">Order #{selectedOrder._id?.substring(0, 8)}...</h1>
                <p className="text-md mb-8 text-gray-400 font-poppins">
                    Detailed view of order placed by {selectedOrder.user?.name || 'N/A'}.
                </p>

                <Link
                    to="/admin/orders"
                    className="inline-flex items-center text-cyan-400 hover:underline mb-8 font-poppins text-lg"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to All Orders
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Order Summary */}
                    <div className={cardClass}>
                        <h2 className={sectionHeadingClass}>Order Summary</h2>
                        <div className="space-y-3">
                            <div className={detailItemClass}>
                                <CurrencyDollarIcon className={detailIconClass} />
                                <span className={labelClass}>Total Amount:</span>
                                <span className={valueClass}>Rs. {selectedOrder.totalAmount?.toLocaleString()}</span>
                            </div>
                            <div className={detailItemClass}>
                                <CalendarDaysIcon className={detailIconClass} />
                                <span className={labelClass}>Order Date:</span>
                                <span className={valueClass}>{orderDate}</span>
                            </div>
                            <div className={detailItemClass}>
                                <ClockIcon className={detailIconClass} />
                                <span className={labelClass}>Status:</span>
                                <span className={`${valueClass} flex justify-end`}>
                                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClasses(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </span>
                            </div>
                            <div className={detailItemClass}>
                                <UserCircleIcon className={detailIconClass} />
                                <span className={labelClass}>Payment Method:</span>
                                <span className={valueClass}>{selectedOrder.paymentMethod || 'N/A'}</span>
                            </div>
                            <div className={detailItemClass}>
                                <CheckCircleIcon className={detailIconClass} />
                                <span className={labelClass}>Payment Status:</span>
                                <span className={valueClass}>{selectedOrder.isPaid ? 'Paid' : 'Pending'}</span>
                            </div>
                             <div className="pt-4 flex justify-end">
                                {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                                    <button
                                        onClick={() => handleStatusChangeClick(selectedOrder.status)}
                                        className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-md hover:bg-blue-700 transition-transform transform hover:scale-[102%]"
                                        disabled={updateLoading}
                                    >
                                        <TruckIcon className="h-5 w-5 mr-2" />
                                        Update Status
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customer & Shipping Details */}
                    <div className={cardClass}>
                        <h2 className={sectionHeadingClass}>Customer & Shipping</h2>
                        <div className="space-y-3">
                            <div className={detailItemClass}>
                                <UserCircleIcon className={detailIconClass} />
                                <span className={labelClass}>Customer Name:</span>
                                <span className={valueClass}>{selectedOrder.user?.name || 'N/A'}</span>
                            </div>
                            <div className={detailItemClass}>
                                <EnvelopeIcon className={detailIconClass} />
                                <span className={labelClass}>Customer Email:</span>
                                <span className={valueClass}>{selectedOrder.user?.email || 'N/A'}</span>
                            </div>
                            <div className={detailItemClass}>
                                <PhoneIcon className={detailIconClass} />
                                <span className={labelClass}>Contact No:</span>
                                <span className={valueClass}>{selectedOrder.shippingInfo?.phoneNo || 'N/A'}</span>
                            </div>
                            <div className={detailItemClass}>
                                <HomeIcon className={detailIconClass} />
                                <span className={labelClass}>Shipping Address:</span>
                                <span className={valueClass}>
                                    {selectedOrder.shippingInfo ?
                                        `${selectedOrder.shippingInfo.address}, ${selectedOrder.shippingInfo.city}, ${selectedOrder.shippingInfo.country}, ${selectedOrder.shippingInfo.postalCode}`
                                        : 'N/A'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ordered Items */}
                <div className={`${cardClass} mb-10`}>
                    <h2 className={sectionHeadingClass}>Ordered Items</h2>
                    {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                        <div className="space-y-4">
                            {selectedOrder.orderItems.map((item, index) => (
                                <div key={index} className="flex items-center bg-[#151515] p-4 rounded-lg shadow-inner">
                                    <img
                                        src={`http://localhost:3200${item.image}`} // Assuming image path
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-md mr-4"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                                        <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="text-lg font-bold text-cyan-400">Rs. {item.price?.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">No items in this order.</p>
                    )}
                </div>
            </div>

            {/* Confirmation Modal for status update */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleUpdateConfirm}
                title={modalTitle}
                message={modalMessage}
                confirmText="Update Status"
                confirmButtonClass="bg-blue-600 hover:bg-blue-700"
                isLoading={updateLoading}
            />
        </div>
    );
};

export default AdminOrderDetails;