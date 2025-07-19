// src/admin/Sales/AdminSales.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSalesOverview } from '../Redux/features/order&sales'; // Sales thunk is in orderSlice for now
import { CurrencyDollarIcon, ShoppingBagIcon, SparklesIcon, CalendarDaysIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const AdminSales = () => {
    const dispatch = useDispatch();
    const { salesOverview, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(getSalesOverview());
    }, [dispatch]);

    const statsCardClass = "bg-[#0E0E0E] rounded-2xl shadow-lg border border-[#191919] p-6 flex flex-col items-center justify-center text-center hover:bg-[#191919] transition-colors duration-300";
    const statsIconClass = "h-12 w-12 text-cyan-400 mb-4";
    const statsValueClass = "text-5xl  font-gothic-1 text-white mb-2";
    const statsLabelClass = "text-xl font-poppins text-gray-400";

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080708] text-white flex items-center justify-center">
                <p className="text-xl text-gray-400">Loading sales data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#080708] text-white flex flex-col items-center justify-center p-4">
                <p className="text-xl text-red-500 mb-4">Error: {error || "Failed to load sales data."}</p>
                <button
                    onClick={() => dispatch(getSalesOverview())}
                    className="text-cyan-400 hover:underline px-4 py-2 rounded-lg bg-[#0E0E0E] mt-4"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Default values if salesOverview is null or incomplete
    const totalSales = salesOverview?.totalSales?.toLocaleString() || '0';
    const totalOrders = salesOverview?.totalOrders?.toLocaleString() || '0';
    const averageOrderValue = salesOverview?.averageOrderValue?.toLocaleString() || '0';
    const currentMonthSales = salesOverview?.currentMonthSales?.toLocaleString() || '0';

    return (
        <div className="min-h-max bg-[#080708] text-white md:px-4 md:py-5">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-6xl font-gothic-1 mb-4 ">Sales Overview</h1>
                <p className="text-md mb-8 text-gray-400 max-w-2xl font-poppins">
                    A summary of your store's sales performance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className={statsCardClass}>
                        <CurrencyDollarIcon className={statsIconClass} />
                        <p className={statsValueClass}>Rs. {totalSales}</p>
                        <p className={statsLabelClass}>Total Revenue</p>
                    </div>
                    <div className={statsCardClass}>
                        <ShoppingCartIcon className={statsIconClass} />
                        <p className={statsValueClass}>{totalOrders}</p>
                        <p className={statsLabelClass}>Total Orders</p>
                    </div>
                    <div className={statsCardClass}>
                        <SparklesIcon className={statsIconClass} />
                        <p className={statsValueClass}>Rs. {averageOrderValue}</p>
                        <p className={statsLabelClass}>Average Order Value</p>
                    </div>
                    <div className={statsCardClass}>
                        <CalendarDaysIcon className={statsIconClass} />
                        <p className={statsValueClass}>Rs. {currentMonthSales}</p>
                        <p className={statsLabelClass}>Current Month Sales</p>
                    </div>
                </div>

                {/* You can add more complex charts or detailed sales breakdowns here */}
                <div className="bg-[#0E0E0E] rounded-2xl shadow-lg border border-[#191919] p-6 text-gray-300 font-poppins">
                    <h2 className="text-3xl font-gothic-1 text-cyan-400 mb-4">More Sales Data (Future Charts)</h2>
                    <h1>This section can be expanded to include:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Sales by Month/Year (e.g., using a bar chart)</li>
                            <li>Top Selling Products</li>
                            <li>Sales by Category</li>
                            <li>Customer Demographics (if applicable)</li>
                        </ul>
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default AdminSales;