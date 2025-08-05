import React, { useEffect, useState } from 'react';
import { getallproducts, deleteproductbyid } from '../Redux/features/product';
import toast from 'react-hot-toast';
import {
    PencilSquareIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    PlusCircleIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router'; // Use react-router-dom for Link
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationModal from './components/ConfirmationModal'; // Correct path to your modal component

const ManageProducts = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.product?.products);
    const loading = useSelector((state) => state.product.loading);
    const error = useSelector((state) => state.product.error);
    const deleteLoading = useSelector((state) => state.product.deleteLoading); // Get deleteLoading state

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [productIdToDelete, setProductIdToDelete] = useState(null); // State to store ID of product to delete
    const [productTitleToDelete, setProductTitleToDelete] = useState(''); // State to store title for modal message

    // Fetch products on component mount
    useEffect(() => {
        dispatch(getallproducts());
    }, [dispatch]);

    // Update filtered products when products or search term changes
    useEffect(() => {
        if (products && Array.isArray(products)) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const results = products.filter(product =>
                product.title.toLowerCase().includes(lowercasedSearchTerm) ||
                (Array.isArray(product.category) && product.category.some(cat => cat.toLowerCase().includes(lowercasedSearchTerm))) ||
                (product.gender && product.gender.toLowerCase().includes(lowercasedSearchTerm)) ||
                (product.material && product.material.toLowerCase().includes(lowercasedSearchTerm)) ||
                (product.type && product.type.toLowerCase().includes(lowercasedSearchTerm))
            );
            setFilteredProducts(results);
        }
    }, [products, searchTerm]);

    // Function to open the confirmation modal
    const confirmDelete = (productId, productTitle) => {
        setProductIdToDelete(productId);
        setProductTitleToDelete(productTitle);
        setIsModalOpen(true);
    };

    // Function to handle the actual deletion after modal confirmation
    const handleActualDelete = async () => {
        if (!productIdToDelete) return; // Should not happen if called correctly

        try {
            const resultAction = await dispatch(deleteproductbyid(productIdToDelete));

            if (deleteproductbyid.fulfilled.match(resultAction)) {
                toast.success(resultAction.payload?.message || "Product deleted successfully!");
                // The Redux slice already removes the product from the 'products' array
                // No need to refetch here.
            } else {
                // If rejected, the payload contains the error message from rejectWithValue
                toast.error(resultAction.payload || "Failed to delete product.");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred during deletion.");
        } finally {
            // Always close the modal and reset states after the attempt
            setIsModalOpen(false);
            setProductIdToDelete(null);
            setProductTitleToDelete('');
        }
    };

    const inputClass = "w-full bg-[#141414] text-white border hover:border-cyan-600 border-transparent rounded px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-poppins text-sm";
    const tableHeaderClass = "px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider font-poppins";
    const tableCellClass = "px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-poppins";

    return (
        <div className="min-h-max bg-[#080708] text-white md:px-4 md:py-5">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-6xl font-gothic-1 mb-4 ">Manage Products</h1>
                <p className="text-md mb-8 text-gray-400 max-w-2xl font-poppins">
                    View, edit, and delete timepieces from your Saair collection. Maintain accurate inventory and product details.
                </p>

                {/* Search and Add Product */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="relative w-full md:w-1/2">
                        <input
                            type="text"
                            placeholder="Search products by title, category, gender..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`${inputClass} pl-10`}
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    <Link
                        to="/Dashboard/upload-product"
                        className="flex items-center bg-cyan-400 text-black px-5 py-2 rounded-lg font-bold text-md hover:bg-cyan-300 transition-transform transform hover:scale-[102%]"
                    >
                        <PlusCircleIcon className="h-5 w-5 mr-2" />
                        Add New Product
                    </Link>
                </div>

                {/* Product Table */}
                <div className="bg-[#0E0E0E] rounded-2xl overflow-hidden shadow-md border border-[#191919]">
                    {loading && (
                        <div className="p-8 text-center text-gray-400">Loading products...</div>
                    )}
                    {!loading && error && (
                        <div className="p-8 text-center text-red-500">Error: {error || "Failed to load products."}</div>
                    )}
                    {!loading && !error && filteredProducts.length === 0 && (
                        <div className="p-8 text-center text-gray-400">
                            {searchTerm ? `No products found for "${searchTerm}".` : "No products available. Start by adding one!"}
                        </div>
                    )}

                    {!loading && !error && filteredProducts.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-[#1F2937]">
                                <thead className="bg-[#141414]">
                                    <tr>
                                        <th className={tableHeaderClass}>Thumbnail</th>
                                        <th className={tableHeaderClass}>Title</th>
                                        <th className={tableHeaderClass}>Category</th>
                                        <th className={tableHeaderClass}>Price</th>
                                        <th className={tableHeaderClass}>Stock</th>
                                        <th className={tableHeaderClass}>Featured</th>
                                        <th className={tableHeaderClass}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1F2937]">
                                    {filteredProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-[#191919] transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center w-16 h-16 rounded-md overflow-hidden bg-gray-700">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img
                                                            src={`https://saair-backend-production.up.railway.app${product.images[0]}`}
                                                            alt={product.title}
                                                            className="w-full h-full object-cover object-center block"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">No Image</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={tableCellClass}>
                                                <Link to={`/Dashboard/product-detail/${product._id}`} className="text-white hover:underline line-clamp-2">
                                                    {product.title}
                                                </Link>
                                            </td>
                                            <td className={tableCellClass}>
                                                {Array.isArray(product.category) ? product.category.join(', ') : product.category}
                                            </td>
                                            <td className={tableCellClass}>Rs. {product.totalprice?.toLocaleString()}</td>
                                            <td className={tableCellClass}>{product.available}</td>
                                            <td className={tableCellClass}>
                                                {product.featured ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Yes</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">No</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    to={`/Dashboard/product-edit/${product._id}`}
                                                    className="text-cyan-400 hover:text-cyan-300 mr-4"
                                                    title="Edit Product"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5 inline-block" />
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(product._id, product.title)} // Call confirmDelete
                                                    className="text-red-400 hover:text-red-300"
                                                    title="Delete Product"
                                                >
                                                    <TrashIcon className="h-5 w-5 inline-block" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleActualDelete}
                title="Confirm Deletion"
                message={`Are you absolutely sure you want to delete "${productTitleToDelete}"? This action cannot be undone.`}
                confirmText="Delete Product"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                isLoading={deleteLoading} // Pass deleteLoading state
            />
        </div>
    );
};

export default ManageProducts;
