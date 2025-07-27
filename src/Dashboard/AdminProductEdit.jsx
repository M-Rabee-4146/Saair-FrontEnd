// src/admin/AdminEditProduct.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router'; // Use react-router-dom
import { getsingleproduct, updateproductbyid } from '../Redux/features/product'; // Assuming updateproductbyid is defined in productSlice
import toast from 'react-hot-toast';
import {
    ArrowLeftIcon,
    TagIcon,
    CurrencyDollarIcon,
    ClipboardDocumentListIcon,
    SwatchIcon,
    ClockIcon,
    ShoppingBagIcon,
    CheckBadgeIcon,
    UserGroupIcon,
    CubeTransparentIcon,
    PhotoIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const AdminEditProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { selectedProduct, loading, error } = useSelector((state) => state.product);
    const updateLoading = useSelector((state) => state.product.loading); // Re-using general loading for update, or add updateLoading if needed

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [totalPrice, setTotalPrice] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState('');
    const [category, setCategory] = useState(''); // Comma-separated string
    const [color, setColor] = useState('');
    const [material, setMaterial] = useState('');
    const [size, setSize] = useState('');
    const [gender, setGender] = useState('');
    const [type, setType] = useState('');
    const [available, setAvailable] = useState('');
    const [sold, setSold] = useState('');
    const [featured, setFeatured] = useState(false);
    const [existingImages, setExistingImages] = useState([]); // Array of existing image paths
    const [newImages, setNewImages] = useState([]); // Array of File objects for new uploads
    const [imagePreviews, setImagePreviews] = useState([]); // Array of URLs for new image previews

    // Fetch product data on component mount or ID change
    useEffect(() => {
        if (id) {
            dispatch(getsingleproduct(id));
        }
    }, [dispatch, id]);

    // Populate form fields when selectedProduct data is loaded
    useEffect(() => {
        if (selectedProduct ) { // Assuming selectedProduct object has a 'product' key
            const product = selectedProduct;
            setTitle(product.title || '');
            setDescription(product.description || '');
            setTotalPrice(product.totalprice?.toString() || '');
            setDiscountedPrice(product.discountedPrice?.toString() || '');
            // Convert category array to comma-separated string for input
            setCategory(Array.isArray(product.category) ? product.category.join(', ') : product.category || '');
            setColor(product.color || '');
            setMaterial(product.material || '');
            setSize(product.size || '');
            setGender(product.gender || '');
            setType(product.type || '');
            setAvailable(product.available?.toString() || '');
            setSold(product.sold?.toString() || '');
            setFeatured(product.featured || false);
            setExistingImages(product.images || []);
        }
    }, [selectedProduct]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...files]);

        const filePreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...filePreviews]);
    };

    const removeNewImage = (indexToRemove) => {
        setNewImages(prev => prev.filter((_, index) => index !== indexToRemove));
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const removeExistingImage = (imagePathToRemove) => {
        setExistingImages(prev => prev.filter(path => path !== imagePathToRemove));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('totalprice', totalPrice);
        formData.append('discountedPrice', discountedPrice);
        formData.append('category', category); // Send as comma-separated string, backend will parse
        formData.append('color', color);
        formData.append('material', material);
        formData.append('size', size);
        formData.append('gender', gender);
        formData.append('type', type);
        formData.append('available', available);
        formData.append('sold', sold);
        formData.append('featured', featured);

        // Append existing image paths (so backend knows which to keep if not re-uploading)
        existingImages.forEach(imagePath => {
            formData.append('existingImages', imagePath); // Send as existingImages[]
        });

        // Append new image files
        newImages.forEach(file => {
            formData.append('images', file); // 'images' matches req.files array in backend
        });

        try {
            const resultAction = await dispatch(updateproductbyid({ id, productData: formData }));
            if (updateproductbyid.fulfilled.match(resultAction)) {
                toast.success(resultAction.payload?.message || "Product updated successfully!");
                navigate(`/Dashboard/product-detail/${id}`); // Go back to details page
            } else {
                toast.error(resultAction.payload || "Failed to update product.");
            }
        } catch (err) {
            toast.error(err.message || "An error occurred during update.");
        }
    };

    const inputClass = "w-full bg-[#141414] text-white border hover:border-cyan-600 border-transparent rounded px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-poppins text-sm";
    const labelClass = "block text-gray-300 text-sm font-bold mb-2 font-saira";
    const sectionHeadingClass = "text-4xl font-gothic-1 mb-6 ";
    const cardClass = "p-6 bg-[#0E0E0E] rounded-2xl shadow-lg border border-[#191919]";

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080708] text-white flex items-center justify-center">
                <p className="text-xl text-gray-400">Loading product data for editing...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#080708] text-white flex flex-col items-center justify-center p-4">
                <p className="text-xl text-red-500 mb-4">Error: {error || "Failed to load product for editing."}</p>
                <Link to="/Dashboard/manage-products" className="text-cyan-400 hover:underline">
                    Go back to Manage Products
                </Link>
            </div>
        );
    }

    if (!selectedProduct) {
        return (
            <div className="min-h-screen bg-[#080708] text-white flex flex-col items-center justify-center p-4">
                <p className="text-xl text-gray-400 mb-4">Product not found or not loaded for editing.</p>
                <Link to="/Dashboard/manage-products" className="text-cyan-400 hover:underline">
                    Go back to Manage Products
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-max bg-[#080708] text-white px-4 md:px-4 md:py-5">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-5xl md:text-6xl font-gothic-1 text-white line-clamp-2 max-w-[70%]">
                        Product Edit: {selectedProduct?.title}
                    </h1>
                </div>
                <p className="text-md mb-8 text-gray-400 max-w-2xl font-poppins">
                    Modify the details of this product.
                </p>

                <Link
                    to={`/Dashboard/product-detail/${id}`}
                    className="inline-flex items-center text-cyan-400 hover:underline mb-8 font-poppins text-lg"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Product Details
                </Link>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className={cardClass}>
                        <h2 className={sectionHeadingClass}>Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="title" className={labelClass}>Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={inputClass}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="category" className={labelClass}>Categories (comma-separated)</label>
                                <input
                                    type="text"
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className={inputClass}
                                    placeholder="e.g., Men, Casual, Quartz"
                                />
                            </div>
                            <div>
                                <label htmlFor="totalPrice" className={labelClass}>Original Price (Rs.)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">Rs.</span>
                                    <input
                                        type="number"
                                        id="totalPrice"
                                        value={totalPrice}
                                        onChange={(e) => setTotalPrice(e.target.value)}
                                        className={`${inputClass} pl-10`}
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="discountedPrice" className={labelClass}>Discounted Price (Optional)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">Rs.</span>
                                    <input
                                        type="number"
                                        id="discountedPrice"
                                        value={discountedPrice}
                                        onChange={(e) => setDiscountedPrice(e.target.value)}
                                        className={`${inputClass} pl-10`}
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="description" className={labelClass}>Description</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`${inputClass} h-32 resize-y`}
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Product Attributes */}
                    <div className={cardClass}>
                        <h2 className={sectionHeadingClass}>Attributes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="color" className={labelClass}>Color</label>
                                <input type="text" id="color" value={color} onChange={(e) => setColor(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="material" className={labelClass}>Material</label>
                                <input type="text" id="material" value={material} onChange={(e) => setMaterial(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="size" className={labelClass}>Size</label>
                                <input type="text" id="size" value={size} onChange={(e) => setSize(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="gender" className={labelClass}>Gender</label>
                                <input type="text" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="type" className={labelClass}>Type</label>
                                <input type="text" id="type" value={type} onChange={(e) => setType(e.target.value)} className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* Stock & Status */}
                    <div className={cardClass}>
                        <h2 className={sectionHeadingClass}>Stock & Status</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="available" className={labelClass}>Available Stock</label>
                                <input type="number" id="available" value={available} onChange={(e) => setAvailable(e.target.value)} className={inputClass} min="0" required />
                            </div>
                            <div>
                                <label htmlFor="sold" className={labelClass}>Units Sold</label>
                                <input type="number" id="sold" value={sold} onChange={(e) => setSold(e.target.value)} className={inputClass} min="0" />
                            </div>
                            <div className="md:col-span-2 flex items-center mt-4">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={featured}
                                    onChange={(e) => setFeatured(e.target.checked)}
                                    className="form-checkbox h-5 w-5 text-cyan-400 bg-gray-700 border-gray-600 rounded focus:ring-cyan-400"
                                />
                                <label htmlFor="featured" className="ml-3 text-gray-300 font-poppins text-md">Mark as Featured Product</label>
                            </div>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className={cardClass}>
                        <h2 className={sectionHeadingClass}>Images</h2>
                        <div className="mb-4">
                            <label className={labelClass}>Current Images</label>
                            {existingImages.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {existingImages.map((imagePath, index) => (
                                        <div key={`existing-${index}`} className="relative group w-full aspect-square rounded-md overflow-hidden border border-gray-700">
                                            <img
                                                src={`https://saair-backend-production.up.railway.app${imagePath}`}
                                                alt={`Product existing ${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(imagePath)}
                                                className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove existing image"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No existing images.</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="newImages" className={labelClass}>Upload New Images</label>
                            <input
                                type="file"
                                id="newImages"
                                multiple
                                onChange={handleImageChange}
                                className={`${inputClass} cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-black hover:file:bg-cyan-600`}
                                accept="image/*"
                            />
                            <p className="text-gray-500 text-sm mt-2">Max 5MB per image. PNG, JPG, JPEG, GIF.</p>

                            {imagePreviews.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {imagePreviews.map((previewUrl, index) => (
                                        <div key={`new-${index}`} className="relative group w-full aspect-square rounded-md overflow-hidden border border-gray-700">
                                            <img
                                                src={previewUrl}
                                                alt={`New product preview ${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove new image"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            type="button"
                            onClick={() => navigate(`/Dashboard/product-detail/${id}`)}
                            className="px-6 py-3 rounded-lg font-bold text-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition-transform transform hover:scale-[102%]"
                            disabled={updateLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-6 py-3 rounded-lg font-bold text-md text-black bg-cyan-400 hover:bg-cyan-300 transition-transform transform hover:scale-[102%] ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={updateLoading}
                        >
                            {updateLoading ? (
                                <svg className="animate-spin h-5 w-5 text-black mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminEditProduct;
