import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getallproducts } from '../Redux/features/product'; // Assuming you have an action to fetch products
import {
  CubeIcon,        // For products
  ShoppingCartIcon, // For orders
  BanknotesIcon,    // For sales
  ClockIcon,        // For recent activity
  PlusCircleIcon,   // Quick link to Add Product
  EyeIcon           // Quick link to Manage Products
} from '@heroicons/react/24/outline';
import { Link } from 'react-router';

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products); // Assuming your products are here
  const orders = useSelector((state) => state.order.orders); // Assuming your products are here
  // console.log(orders)

  // Placeholder for real data that would come from your backend
  const [summaryData, setSummaryData] = useState({
    totalProducts: 0,
    totalOrders: orders.length, // Example static data
    totalSales: 850000 // Example static data
  });

  // Fetch products on component mount
  useEffect(() => {
    dispatch(getallproducts());
  }, [dispatch]);

  // Update total products when products data loads
  useEffect(() => {
    if (products && Array.isArray(products)) {
      setSummaryData(prev => ({
        ...prev,
        totalProducts: products.length
      }));
    }
  }, [products]);

  // For demonstration, let's pick some recent products or mock recent orders
  const recentActivity = products && Array.isArray(products)
    ? products.slice(0, 5).map(p => ({
      type: 'Product Uploaded',
      name: p.title,
      date: new Date(p.createdAt).toLocaleDateString(), // Assuming createdAt field
      link: `/Dashboard/product-detail/${p._id}` // Link to the product's public page
    }))
    : [
      // Fallback for no products
      { type: 'Order Placed', name: 'Order #SAIR2023-001', date: 'Jul 14, 2025', link: '/admin/orders' },
      { type: 'Product Uploaded', name: 'Vintage Chrono', date: 'Jul 13, 2025', link: '/admin/manage-products' },
    ];


  const statCardClass = "bg-[#0E0E0E] p-6 rounded-2xl flex flex-col justify-center items-start border border-transparent hover:border-[#383838] transition-all duration-300 group shadow-md  hover:bg-[#191919] transition-all duration-300 ease-in-out border border-transparent hover:border-[#383838] group ";
  const statValueClass = "text-5xl font-gothic-1 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300";
  const statLabelClass = "text-lg text-gray-400 font-poppins mt-2";
  const iconClass = "h-10 w-10 text-gray-300 mb-4 group-hover:text-cyan-400 transition-colors duration-300";

  return (
    <div className="min-h-max bg-[#080708] text-white md:py-5 md:px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-gothic-1 mb-4  ">Dashboard Overview</h1>
        <p className="text-md mb-10 text-gray-400 max-w-2xl font-poppins">
          A concise summary of Saair's current operational status.
        </p>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Total Products Card */}
          <div className={statCardClass}>
            <CubeIcon className={iconClass} />
            <div className={statValueClass}>{summaryData.totalProducts}</div>
            <div className={statLabelClass}>Total Products</div>
          </div>

          {/* Total Orders Card */}
          <div className={statCardClass}>
            <ShoppingCartIcon className={iconClass} />
            <div className={statValueClass}>{summaryData.totalOrders}</div>
            <div className={statLabelClass}>Total Orders</div>
          </div>

          {/* Total Sales Card */}
          <div className={statCardClass}>
            <BanknotesIcon className={iconClass} />
            <div className={statValueClass}>Rs. {summaryData.totalSales.toLocaleString()}</div>
            <div className={statLabelClass}>Total Sales</div>
          </div>
        </div>

        {/* Recent Activity & Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-[#0E0E0E] p-6 rounded-2xl border border-transparent shadow-md">
            <h2 className="text-3xl font-gothic-1 mb-6 text-cyan-400">Recent Activity</h2>
            {recentActivity.length > 0 ? (
              <ul className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <ClockIcon className="h-5 w-5 mr-3 text-gray-500" />
                    <span className="font-semibold mr-2">{activity.type}:</span>
                    <Link to={activity.link} className="hover:underline text-white font-poppins text-sm flex-grow">
                      {activity.name}
                    </Link>
                    <span className="text-gray-500 text-xs font-poppins">{activity.date}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 font-poppins">No recent activity to display.</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-[#0E0E0E] p-6 rounded-2xl border border-transparent shadow-md">
            <h2 className="text-3xl font-gothic-1 mb-6 text-cyan-400">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/Dashboard/upload-product"
                className="flex items-center bg-[#141414] hover:bg-[#191919] p-4 rounded-lg
                           transition-colors duration-200 border border-transparent hover:border-cyan-700"
              >
                <PlusCircleIcon className="h-6 w-6 text-cyan-400 mr-4" />
                <span className="text-lg font-poppins text-white">Add New Product</span>
              </Link>
              <Link
                to="/Dashboard/manage-products"
                className="flex items-center bg-[#141414] hover:bg-[#191919] p-4 rounded-lg
                           transition-colors duration-200 border border-transparent hover:border-cyan-700"
              >
                <EyeIcon className="h-6 w-6 text-cyan-400 mr-4" />
                <span className="text-lg font-poppins text-white">Manage All Products</span>
              </Link>
              {/* Add more quick links as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;