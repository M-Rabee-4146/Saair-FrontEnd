import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../Redux/features/order&sales';
import toast from 'react-hot-toast';
import { Link } from 'react-router'; // Corrected: Import from 'react-router'
import {
    EyeIcon,
    TruckIcon,
    FunnelIcon, // For filter button
    MagnifyingGlassIcon, // For search input
    TrashIcon // For delete button
} from '@heroicons/react/24/outline';
import ConfirmationModal from './components/ConfirmationModal';

const AdminOrders = () => {
    const dispatch = useDispatch();
    const { loading, error, updateLoading, deleteLoading } = useSelector((state) => state.order);
    const orders = useSelector((state) => state.order.orders); // All orders fetched from backend initially

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('statusUpdate'); // 'statusUpdate' or 'delete'

    // State for Client-Side Filtering and Search
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All'); // Frontend-based filter
    const [filteredAndSearchedOrders, setFilteredAndSearchedOrders] = useState([]); // This will hold the final displayed orders

    const [showFilters, setShowFilters] = useState(false); // To toggle filter section visibility

    // --- EFFECT: Initial Fetch of ALL orders from backend ---
    useEffect(() => {
        // Fetch all orders on component mount.
        // If an update/delete happens, Redux state should update,
        // and the client-side filtering useEffect will react.
        dispatch(getAllOrders());
    }, [dispatch]);

    // --- EFFECT: Client-side filtering and searching ---
    useEffect(() => {
        if (orders && Array.isArray(orders)) {
            let tempOrders = [...orders];

            // 1. Apply Status Filter
            if (filterStatus !== 'All') {
                tempOrders = tempOrders.filter(order =>
                    order.orderStatus.toLowerCase() === filterStatus.toLowerCase()
                );
            }

            // 2. Apply Search Term Filter
            if (searchTerm) {
                const lowercasedSearchTerm = searchTerm.toLowerCase();
                tempOrders = tempOrders.filter(order =>
                    order._id.toLowerCase().includes(lowercasedSearchTerm) ||
                    (order.user?.name && order.user.name.toLowerCase().includes(lowercasedSearchTerm)) ||
                    order.orderStatus.toLowerCase().includes(lowercasedSearchTerm)
                );
            }

            setFilteredAndSearchedOrders(tempOrders);
        }
    }, [orders, searchTerm, filterStatus]); // Re-run when base 'orders', 'searchTerm', or 'filterStatus' changes

    const handleStatusChangeClick = (orderId, currentStatus) => {
        setSelectedOrderId(orderId);
        setModalType('statusUpdate');
        const statusOptions = {
            'Pending': ['Processing'],
            'Processing': ['Shipped'],
            'Shipped': ['Delivered'],
            'Delivered': [],
            'Cancelled': [],
        };
        const nextStatuses = statusOptions[currentStatus] || [];

        if (nextStatuses.length > 0) {
            setNewStatus(nextStatuses[0]);
            setModalTitle(`Update Order #${orderId.substring(0, 8)} Status`);
            setModalMessage(`Are you sure you want to change the status of order #${orderId.substring(0, 8)} from "${currentStatus}" to "${nextStatuses[0]}"?`);
            setIsModalOpen(true);
        } else {
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'}
                    max-w-md w-full bg-yellow-600 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-white">
                                    No further status changes.
                                </p>
                                <p className="mt-1 text-sm text-yellow-100">
                                    Order #{orderId.substring(0, 8)} is already "{currentStatus}".
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-yellow-700">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-yellow-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            ), {
                duration: 4000,
                position: 'top-center'
            });
        }
    };

    const handleDeleteClick = (orderId) => {
        setSelectedOrderId(orderId);
        setModalType('delete');
        setModalTitle(`Delete Order #${orderId.substring(0, 8)}`);
        setModalMessage(`Are you sure you want to delete order #${orderId.substring(0, 8)}? This action cannot be undone.`);
        setIsModalOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedOrderId) return;

        setIsModalOpen(false); // Close modal immediately

        if (modalType === 'statusUpdate') {
            const currentOrderId = selectedOrderId;
            const currentNewStatus = newStatus;
            try {
                const resultAction = await dispatch(updateOrderStatus({ orderId: currentOrderId, status: currentNewStatus }));
                if (updateOrderStatus.fulfilled.match(resultAction)) {
                    toast.success(`Order #${currentOrderId.substring(0, 8)} status updated to "${currentNewStatus}" successfully!`);
                    setSelectedOrderId(null);
                    setNewStatus('');
                    // No explicit re-fetch needed here as Redux state change will trigger useEffect
                } else {
                    const errorMessage = resultAction.payload?.message || resultAction.error?.message || "Failed to update order status.";
                    toast.error(errorMessage);
                }
            } catch (err) {
                toast.error(err.message || "An error occurred during update.");
            }
        } else if (modalType === 'delete') {
            const currentOrderId = selectedOrderId;
            try {
                const resultAction = await dispatch(deleteOrder(currentOrderId));
                if (deleteOrder.fulfilled.match(resultAction)) {
                    toast.success(resultAction.payload.message || `Order #${currentOrderId.substring(0, 8)} deleted successfully!`);
                    setSelectedOrderId(null);
                    // No explicit re-fetch needed here as Redux state change will trigger useEffect
                } else {
                    const errorMessage = resultAction.payload?.message || resultAction.error?.message || "Failed to delete order.";
                    toast.error(errorMessage);
                }
            } catch (err) {
                toast.error(err.message || "An error occurred during deletion.");
            }
        }
    };

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

    // Global loading state for initial fetch
    const isGlobalLoading = loading && orders.length === 0 && !error;

    if (isGlobalLoading) {
        return (
            <div className="min-h-screen bg-[#080708] text-white flex items-center justify-center">
                <p className="text-xl text-gray-400">Loading orders...</p>
            </div>
        );
    }

    if (error && orders.length === 0) {
        return (
            <div className="min-h-screen bg-[#080708] text-white flex flex-col items-center justify-center p-4">
                <p className="text-xl text-red-500 mb-4">Error: {error?.message || error || "Failed to load orders."}</p>
                <button
                    onClick={() => dispatch(getAllOrders())} // Retrigger initial fetch
                    className="text-cyan-400 hover:underline px-4 py-2 rounded-lg bg-[#0E0E0E] mt-4"
                >
                    Retry Loading Orders
                </button>
            </div>
        );
    }

    const orderStatusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    return (
        <div className="min-h-screen bg-[#080708] text-white md:px-4 md:py-5">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-6xl font-gothic-1 mb-4">All Orders</h1>
                <p className="text-md mb-8 text-gray-400 max-w-2xl font-poppins">
                    Manage and view all customer orders.
                </p>

                {/* Search and Filter Section */}
                <div className="bg-[#0E0E0E] rounded-2xl shadow-lg border border-[#191919] p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-1/2">
                            <input
                                type="text"
                                placeholder="Search by Order ID, Customer Name, or Status..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#151515] border border-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>

                        {/* Filter Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <FunnelIcon className="h-5 w-5 mr-2" />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>

                    {/* Filter Options (conditionally rendered) */}
                    {showFilters && (
                        <div className="mt-4 border-t border-gray-700 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Status Filter (frontend-based) */}
                                <div>
                                    <label htmlFor="statusFilter" className="block text-gray-300 text-sm font-bold mb-2">Filter by Status:</label>
                                    <select
                                        id="statusFilter"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-[#151515] border border-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                                    >
                                        {orderStatusOptions.map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-[#0E0E0E] rounded-2xl shadow-lg border border-[#191919] p-6 overflow-x-auto">
                    {!loading && !error && filteredAndSearchedOrders.length === 0 ? (
                        <p className="text-center text-gray-400 text-lg py-10">
                            {searchTerm || filterStatus !== 'All' ? `No orders found matching your criteria.` : `No orders available.`}
                        </p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-[#191919]">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Amount</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order Date</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredAndSearchedOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-[#151515] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                                            {order._id.substring(0, 10)}...
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {order.user?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            Rs. {order.totalAmount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    to={`/Dashboard/order-details/${order._id}`}
                                                    className="text-cyan-400 hover:text-cyan-300"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </Link>
                                                {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                                                    <button
                                                        onClick={() => handleStatusChangeClick(order._id, order.orderStatus)}
                                                        className="text-blue-500 hover:text-blue-400"
                                                        title="Update Status"
                                                        disabled={updateLoading}
                                                    >
                                                        <TruckIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteClick(order._id)}
                                                    className="text-red-500 hover:text-red-400"
                                                    title="Delete Order"
                                                    disabled={deleteLoading}
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {loading && orders.length > 0 && (
                        <div className="text-center py-4 text-gray-400">Refreshing orders...</div>
                    )}
                </div>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmAction}
                title={modalTitle}
                message={modalMessage}
                confirmText={modalType === 'delete' ? 'Confirm Delete' : 'Confirm Update'}
                confirmButtonClass={modalType === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                isLoading={updateLoading || deleteLoading}
            />
        </div>
    );
};

export default AdminOrders;