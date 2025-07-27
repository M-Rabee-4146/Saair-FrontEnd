import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router'; // Use react-router-dom for Link and useNavigate
import { getsingleproduct, deleteproductbyid } from '../Redux/features/product';
import toast from 'react-hot-toast';
import {
    ArrowLeftIcon,
    PencilSquareIcon,
    TrashIcon,
    TagIcon,
    CurrencyDollarIcon,
    ClipboardDocumentListIcon,
    SwatchIcon,
    ClockIcon,
    ShoppingBagIcon,
    CheckBadgeIcon,
    UserGroupIcon,
    CubeTransparentIcon
} from '@heroicons/react/24/outline';

import ConfirmationModal from './components/ConfirmationModal' // Import the new modal component

const AdminProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectedProduct = useSelector((state) => state.product.selectedProduct);
    const loading = useSelector((state) => state.product.loading);
    const error = useSelector((state) => state.product.error);
    const deleteLoading = useSelector((state) => state.product.deleteLoading); // Assuming you have a loading state for delete

    const [mainImage, setMainImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

    useEffect(() => {
        if (id) {
            dispatch(getsingleproduct(id));
        }
    }, [dispatch, id]);

    // Set the first image as the main image once product data is loaded
    useEffect(() => {
        if (selectedProduct && selectedProduct.images && selectedProduct.images.length > 0) {
            setMainImage(`https://saair-backend-production.up.railway.app${selectedProduct.images[0]}`);
        } else {
            setMainImage(null);
        }
    }, [selectedProduct]);

    const confirmDelete = () => {
        setIsModalOpen(true); // Open the modal
    };

    const handleActualDelete = async () => {
        setIsModalOpen(false); // Close the modal immediately
        try {
            // Note: deleteproductbyid thunk should ideally update deleteLoading state
            const resultAction = await dispatch(deleteproductbyid(id));
            if (deleteproductbyid.fulfilled.match(resultAction)) {
                toast.success(resultAction.payload?.message || "Product deleted successfully!");
                navigate('/admin/manage-products');
            } else {
                toast.error(resultAction.payload || "Failed to delete product.");
            }
        } catch (err) {
            toast.error(err.message || "An error occurred during deletion.");
        }
    };

    const detailCardClass = "p-6 bg-[#0E0E0E] rounded-2xl shadow-lg border border-[#191919] hover:bg-[#191919] transition-all duration-300 ease-in-out hover:border-[#383838]";
    const detailItemClass = "flex items-center text-gray-300 font-poppins text-md py-1";
    const detailIconClass = "h-5 w-5 text-cyan-400 mr-3 flex-shrink-0";
    const labelClass = "font-bold min-w-[120px] text-cyan-400 font-saira flex-shrink-0";
    const valueClass = "text-gray-300 flex-grow text-right font-poppins";
    const sectionHeadingClass = "text-4xl font-gothic-1 mb-6 ";

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080708] text-white flex items-center justify-center">
                <p className="text-xl text-gray-400">Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#080708] text-white flex flex-col items-center justify-center p-4">
                <p className="text-xl text-red-500 mb-4">Error: {error.message || "Failed to load product details."}</p>
                <Link to="/admin/manage-products" className="text-cyan-400 hover:underline">
                    Go back to Manage Products
                </Link>
            </div>
        );
    }

    if (!selectedProduct) {
        return (
            <div className="min-h-screen bg-[#080708] text-white flex flex-col items-center justify-center p-4">
                <p className="text-xl text-gray-400 mb-4">Product not found.</p>
                <Link to="/admin/manage-products" className="text-cyan-400 hover:underline">
                    Go back to Manage Products
                </Link>
            </div>
        );
    }

    const creationDate = selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleString() : 'N/A';
    const updateDate = selectedProduct.updatedAt ? new Date(selectedProduct.updatedAt).toLocaleString() : 'N/A';

    return (
        <div className="min-h-screen bg-[#080708] text-white px-4 md:px-4 py-5">
            <div className="max-w-6xl mx-auto">
                {/* Header and Actions */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-5xl md:text-6xl font-gothic-1 text-white line-clamp-2 max-w-[70%]">
                        {selectedProduct.title}
                    </h1>
                    <div className="flex space-x-4">
                        <Link
                            to={`/Dashboard/product-edit/${selectedProduct._id}`}
                            className="flex items-center bg-cyan-400 text-black px-5 py-2 rounded-lg font-bold text-md hover:bg-cyan-300 transition-transform transform hover:scale-[102%]"
                        >
                            <PencilSquareIcon className="h-5 w-5 mr-2" />
                            Edit
                        </Link>
                        <button
                            onClick={confirmDelete} /* Changed to open modal */
                            className="flex items-center bg-red-600 text-white px-5 py-2 rounded-lg font-bold text-md hover:bg-red-700 transition-transform transform hover:scale-[102%]"
                        >
                            <TrashIcon className="h-5 w-5 mr-2" />
                            Delete
                        </button>
                    </div>
                </div>
                <p className="text-md mb-8 text-gray-400 max-w-2xl font-poppins">
                    Detailed view of **{selectedProduct.title}**.
                </p>

                {/* Back Button */}
                <Link
                    to="/Dashboard/manage-products"
                    className="inline-flex items-center text-cyan-400 hover:underline mb-8 font-poppins text-lg"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Product List
                </Link>

                {/* Main Image Display */}
                {mainImage && (
                    <div className="mb-8 rounded-lg overflow-hidden shadow-lg border border-gray-700 bg-gray-900 aspect-[16/9] flex items-center justify-center">
                        <img
                            src={mainImage}
                            alt={`${selectedProduct.title} - Main View`}
                            className="w-full h-full object-contain"
                        />
                    </div>
                )}

                {/* Product Images Gallery (thumbnails) */}
                {selectedProduct.images && selectedProduct.images.length > 0 && (
                    <div className="mb-10 p-6 bg-[#0E0E0E] rounded-2xl shadow-lg border border-[#191919]">
                        <h2 className={sectionHeadingClass}>Product Gallery</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {selectedProduct.images.map((imgSrc, index) => (
                                <div
                                    key={index}
                                    className={`w-full aspect-square overflow-hidden rounded-lg border-2 ${
                                        mainImage === `https://saair-backend-production.up.railway.app${imgSrc}` ? 'border-cyan-400' : 'border-gray-700 hover:border-gray-500'
                                    } bg-gray-900 cursor-pointer transition-all duration-200 ease-in-out`}
                                    onClick={() => setMainImage(`https://saair-backend-production.up.railway.app${imgSrc}`)}
                                >
                                    <img
                                        src={`https://saair-backend-production.up.railway.app${imgSrc}`}
                                        alt={`${selectedProduct.title} - Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover object-center block"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Product Details & Attributes Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Core Details */}
                    <div className={detailCardClass}>
                        <h2 className={sectionHeadingClass}>Details</h2>
                        <div className="space-y-3">
                            <div className={detailItemClass}>
                                <TagIcon className={detailIconClass} />
                                <span className={labelClass}>Categories:</span>
                                <span className={valueClass}>
                                    {Array.isArray(selectedProduct.category) ? selectedProduct.category.join(', ') : selectedProduct.category || 'N/A'}
                                </span>
                            </div>
                            <div className={detailItemClass}>
                                <CurrencyDollarIcon className={detailIconClass} />
                                <span className={labelClass}>Original Price:</span>
                                <span className={valueClass}>Rs. {selectedProduct.totalprice?.toLocaleString() || '0'}</span>
                            </div>
                            {selectedProduct.discountedPrice && (
                                <div className={detailItemClass}>
                                    <CurrencyDollarIcon className={detailIconClass} />
                                    <span className={labelClass}>Discounted Price:</span>
                                    <span className={valueClass}>Rs. {selectedProduct.discountedPrice?.toLocaleString() || '0'}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Attributes & Stock */}
                    <div className={detailCardClass}>
                        <h2 className={sectionHeadingClass}>Attributes & Stock</h2>
                        <div className="space-y-3">
                            <div className={detailItemClass}>
                                <SwatchIcon className={detailIconClass} />
                                <span className={labelClass}>Color:</span>
                                <span className={valueClass}>{selectedProduct.color || 'N/A'}</span>
                            </div>
                            <div className={detailItemClass}>
                                <CubeTransparentIcon className={detailIconClass} />
                                <span className={labelClass}>Material:</span>
                                <span className={valueClass}>{selectedProduct.material || 'N/A'}</span>
                            </div>
                            <div className={detailItemClass}>
                                <TagIcon className={detailIconClass} />
                                <span className={labelClass}>Size:</span>
                                <span className={valueClass}>{selectedProduct.size || 'N/A'}</span>
                            </div>
                            <div className={detailItemClass}>
                                <UserGroupIcon className={detailIconClass} />
                                <span className={labelClass}>Gender:</span>
                                <span className={valueClass}>{selectedProduct.gender || 'N/A'}</span>
                            </div>
                            <div className={detailItemClass}>
                                <ClockIcon className={detailIconClass} />
                                <span className={labelClass}>Type:</span>
                                <span className={valueClass}>{selectedProduct.type || 'N/A'}</span>
                            </div>
                            <div className={detailItemClass}>
                                <ShoppingBagIcon className={detailIconClass} />
                                <span className={labelClass}>Available Stock:</span>
                                <span className={valueClass}>{selectedProduct.available?.toLocaleString() || '0'}</span>
                            </div>
                            <div className={detailItemClass}>
                                <ShoppingBagIcon className={detailIconClass} />
                                <span className={labelClass}>Units Sold:</span>
                                <span className={valueClass}>{selectedProduct.sold?.toLocaleString() || '0'}</span>
                            </div>
                            <div className={detailItemClass}>
                                <CheckBadgeIcon className={detailIconClass} />
                                <span className={labelClass}>Featured:</span>
                                <span className={valueClass}>{selectedProduct.featured ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Section (separated) */}
                <div className={`${detailCardClass} mb-10`}>
                    <h2 className={sectionHeadingClass}>Description</h2>
                    <p className="text-gray-300 font-poppins text-md leading-relaxed">{selectedProduct.description || 'No description available.'}</p>
                </div>

                {/* Timestamps */}
                <div className={`${detailCardClass} mb-8`}>
                    <h2 className={sectionHeadingClass}>Timestamps</h2>
                    <div className="space-y-3">
                        <div className={detailItemClass}>
                            <ClockIcon className={detailIconClass} />
                            <span className={labelClass}>Created At:</span>
                            <span className={valueClass}>{creationDate}</span>
                        </div>
                        <div className={detailItemClass}>
                            <ClockIcon className={detailIconClass} />
                            <span className={labelClass}>Last Updated:</span>
                            <span className={valueClass}>{updateDate}</span>
                        </div>
                    </div>
                </div>

                {/* Confirmation Modal */}
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleActualDelete}
                    title="Confirm Deletion"
                    message={`Are you absolutely sure you want to delete "${selectedProduct.title}"? This action cannot be undone.`}
                    confirmText="Delete Product"
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                    isLoading={deleteLoading} // Pass delete loading state to the modal
                />
            </div>
        </div>
    );
};

export default AdminProductDetails;
