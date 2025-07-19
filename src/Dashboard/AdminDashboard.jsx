import React, { useEffect } from 'react';
import {
    PlusCircleIcon, // Used for 'Add New Product'
    EyeIcon,         // Used for 'View Products'
    ShoppingCartIcon, // Better for 'Orders'
    CurrencyDollarIcon, // Better for 'Sales'
    DocumentTextIcon, // Better for 'Contact Forms'
    ChartBarIcon,    // Used for 'Dashboard Overview'
    ClockIcon // For Recent Activity
} from '@heroicons/react/24/outline'; // Using outline icons for a clean look
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux'; // To potentially display dynamic data
import { getAllOrders } from '../Redux/features/order&sales';
import { getAllContactForms } from '../Redux/features/contactSlice';

// Placeholder for a Recent Activity component
const RecentActivity = () => {
  const dispatch=useDispatch();
    // In a real application, you'd fetch recent orders, new contact forms, etc.
    // For now, this is just a static example.
    const { orders } = useSelector(state => state.order); // Get orders from Redux
    const  forms  = useSelector(state => state.contact.contactForms); // Get forms from Redux (if implemented)
// console.log( forms)
// console.log(orders )
    const recentOrders = orders ? orders.slice(0, 3) : []; // Show last 3 orders
    const recentForms = forms ? forms.slice(0, 3) : []; // Show last 3 forms
// console.log(recentForms)
// console.log(recentOrders)
 useEffect(() => {
        // Fetch all orders on component mount.
        // If an update/delete happens, Redux state should update,
        // and the client-side filtering useEffect will react.
        dispatch(getAllOrders());
        dispatch(getAllContactForms());
    }, [dispatch]);
    return (
        <div className="bg-[#0E0E0E] rounded-2xl shadow-lg border border-[#191919] p-6">
            <div className="flex items-center mb-4">
                <ClockIcon className="h-8 w-8 text-indigo-400 mr-3" />
                <h2 className="text-2xl font-saira text-white">Recent Activity</h2>
            </div>
            <p className="text-gray-400 font-poppins text-sm mb-4">
                Latest updates across your store.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div>
                    <h3 className="text-xl font-saira text-white mb-3 border-b border-gray-700 pb-2">Recent Orders</h3>
                    {recentOrders.length > 0 ? (
                        <ul className="space-y-3">
                            {recentOrders.map((order) => (
                                <li key={order._id} className="flex items-center text-gray-300 text-sm">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                                    <span className="truncate">Order <Link to={`/Dashboard/order-details/${order._id}`} className="text-cyan-400 hover:underline">#{order._id?.substring(0, 8)}</Link> from <strong>{order.user?.name || 'N/A'}</strong> (Rs. {order.totalAmount?.toLocaleString()}) - {order.orderStatus}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No recent orders.</p>
                    )}
                </div>

                {/* Recent Contact Forms */}
                <div>
                    <h3 className="text-xl font-saira text-white mb-3 border-b border-gray-700 pb-2">New Contact Forms</h3>
                    {recentForms.length > 0 ? (
                        <ul className="space-y-3">
                            {recentForms.map(form => (
                                <li key={form._id} className="flex items-center text-gray-300 text-sm">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 flex-shrink-0"></span>
                                    <span className="truncate">Form from <strong>{form.name}</strong> - "{form.about?.substring(0, 30)}{form.about?.length > 30 ? '...' : ''}"</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No new contact forms.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


const AdminDashboard = () => {
    // Using an array for the dashboard cards, making them extensible
    const adminCards = [
        {
            title: 'Dashboard Overview',
            description: 'Get a quick glance at key metrics and recent activity.',
            icon: ChartBarIcon,
            link: '/Dashboard/overview'
        },
        {
            title: 'Add New Product',
            description: 'Upload new watches to your Saair collection.',
            icon: PlusCircleIcon,
            link: '/Dashboard/upload-product'
        },
        {
            title: 'Manage Products',
            description: 'View, edit, or remove existing timepieces.',
            icon: EyeIcon,
            link: '/Dashboard/manage-products'
        },
        {
            title: 'Manage Orders', // Updated title
            description: 'Oversee customer orders, update statuses, and fulfill shipments.',
            icon: ShoppingCartIcon, // Updated icon
            link: '/Dashboard/orders'
        },
        {
            title: 'Sales Performance', // New card
            description: 'Analyze sales trends, revenue, and order statistics.',
            icon: CurrencyDollarIcon, // New icon
            link: '/Dashboard/sales'
        },
        {
            title: 'Contact Forms', // New card
            description: 'Review customer inquiries and feedback.',
            icon: DocumentTextIcon, // New icon
            link: '/Dashboard/contact-forms'
        },
    ];

    return (
        <div className="min-h-content bg-[#080708] text-white md:py-5 md:px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-6xl font-gothic-1 mb-4">Admin Dashboard</h1>
                <p className="text-md mb-10 text-gray-400 max-w-2xl font-poppins">
                    Welcome back! This is your central hub for managing Saair's operations. Quickly access product uploads, inventory, and sales insights.
                </p>

                {/* Dashboard Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {adminCards.map((card, index) => (
                        <Link
                            key={index} // Using index as key here is generally fine if the cards array is static
                            to={card.link}
                            className="bg-[#0E0E0E] min-h-[200px] h-full rounded-2xl flex flex-col justify-between items-start p-6
                                      hover:bg-[#191919] transition-all duration-300 ease-in-out border border-transparent
                                      hover:border-[#383838] group hover:shadow-lg hover:shadow-black "
                        >
                            <div className="flex items-center mb-4">
                                <card.icon className="h-10 w-10 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                                <h2 className="text-2xl font-semibold font-saira ml-4 text-white group-hover:text-white/90">{card.title}</h2>
                            </div>
                            <p className="text-gray-400 font-poppins text-sm mb-4 flex-grow">{card.description}</p>
                            <span className="text-cyan-400 font-poppins font-semibold group-hover:underline">
                                Go to {card.title} &rarr;
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Recent Activity Section */}
                <RecentActivity />

            </div>
        </div>
    );
};

export default AdminDashboard;