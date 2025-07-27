import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { uploadproduct } from '../Redux/features/product';
import toast from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/solid';

// --- Predefined Options for your Watch Store ---
const watchCategories = ["Luxury", "Sport", "Casual", "Smartwatch", "Formal", "Diving"];
const genderOptions = ["Unisex", "Male", "Female"];
const typeOptions = ["Analog", "Digital", "Hybrid"];

// Common watch colors (only names, no hex needed for form data)
const colorPalette = [
  { name: 'Black', hex: '#000000' }, // Hex codes are kept in this array for reference, but not used in formData.color
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Rose Gold', hex: '#B76E79' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Brown', hex: '#964B00' },
  { name: 'Gunmetal', hex: '#2C3539' }
];

const UploadProduct = () => {
  const dispatch = useDispatch();
  const thumbnailRef = useRef(null);
  const galleryRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    totalprice: '',
    discountedPrice: '',
    thumbnail: null,
    galleryImages: [],
    category: [],
    sold: '',
    available: '',
    color: '', // This will now store only the color name (string)
    size: '',
    gender: 'Unisex',
    material: '',
    type: 'Analog',
    featured: false
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [customColor, setCustomColor] = useState(''); // This state helps manage the text input for color
  const [filteredCategories, setFilteredCategories] = useState(watchCategories);

  // Update filtered categories when `formData.category` changes
  useEffect(() => {
    const newFilteredCategories = watchCategories.filter(
      (cat) => !formData.category.includes(cat)
    );
    setFilteredCategories(newFilteredCategories);
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // --- Image Logic with a separate thumbnail and gallery ---
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, thumbnail: file });
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 4) {
      toast.error('You can only upload a maximum of 4 gallery images.');
      return;
    }

    setFormData({ ...formData, galleryImages: files });
    const previews = files.map((file) => URL.createObjectURL(file));
    setGalleryPreviews(previews);
  };

  // --- Category Logic ---
  const handleAddCategory = (selectedCategory) => {
    if (selectedCategory && !formData.category.includes(selectedCategory)) {
      setFormData((prev) => ({
        ...prev,
        category: [...prev.category, selectedCategory]
      }));
    }
  };

  const removeCategory = (catToRemove) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.filter((c) => c !== catToRemove)
    }));
  };

  // --- Color Logic (Text only - no hex code stored in formData.color) ---
  const handleColorChange = (value) => {
    setFormData({ ...formData, color: value });
    setCustomColor(value); // Update customColor to reflect selected/typed value
  };

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine thumbnail and gallery images into a single array
    const allImages = [];
    if (formData.thumbnail) {
      allImages.push(formData.thumbnail);
    }
    allImages.push(...formData.galleryImages);

    // Check title length
    // const titleWords = formData.title.trim().split(/\s+/);
    // if (titleWords.length > 4) { // Changed condition to 4 words as per placeholder
    //   toast.error("Product title should be 4 words or less for best display.");
    //   return;
    // }

    const finalData = new FormData();

    // Append all form data
    for (const key in formData) {
      if (key === 'thumbnail' || key === 'galleryImages') continue;
      if (key === 'category') {
        formData.category.forEach((cat) => finalData.append('category', cat));
      } else {
        finalData.append(key, formData[key]);
      }
    }

    // Append the combined images
    allImages.forEach((file) => finalData.append('images', file));

    try {
      const response = await dispatch(uploadproduct(finalData));
      if (uploadproduct.fulfilled.match(response)) {
        toast.success(response?.payload?.message || "Product uploaded successfully!");
        // Reset the form after successful upload
        setFormData({
          title: '',
          description: '',
          totalprice: '',
          discountedPrice: '',
          thumbnail: null,
          galleryImages: [],
          category: [],
          sold: '',
          available: '',
          color: '',
          size: '',
          gender: 'Unisex',
          material: '',
          type: 'Analog',
          featured: false
        });
        setThumbnailPreview(null);
        setGalleryPreviews([]);
        setCustomColor(''); // Reset customColor as well
        // Clear file inputs
        if (thumbnailRef.current) thumbnailRef.current.value = "";
        if (galleryRef.current) galleryRef.current.value = "";

      } else {
        toast.error(response?.payload || "An unknown error occurred.");
      }
    } catch (error) {
      toast.error(error.message || "Submission failed.");
    }
  };

  const inputClass = "w-full bg-[#141414] text-white border hover:border-cyan-600 border-transparent rounded px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-poppins text-sm";
  const fileInputClass = `${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100`;

  return (
    <div className="min-h-screen bg-[#080708] text-white md:px-4 md:py-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl mb-4 text-cyn-400 font-gothic-1">Upload New Watch</h1>
        <p className="text-md mb-8 text-gray-400 max-w-lg font-poppins ">
          Utilize this form to seamlessly add new timepieces to Saair's curated collection. Your precision ensures each product upholds our standard of elegance and quality.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="space-y-2">
              <label className="block mb-2 text-sm text-gray-400 font-poppins ">Watch Title</label>

            <input type="text" name="title" placeholder="Enter Title (4 words recommended)" value={formData.title} onChange={handleChange} className={inputClass} required />
            <p className="text-sm text-gray-500 font-poppins  mx-2">Recommended for clean UI display.</p>
          </div>
              <label className="block mb-2 text-sm text-gray-400 font-poppins ">Description</label>

          <textarea name="description" placeholder="Enter The Description..." value={formData.description} onChange={handleChange} className={`${inputClass} min-h-[120px]`} required />

          {/* Pricing */}
              <label className="block mb-2 text-sm text-gray-400 font-poppins ">Price</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <input type="number" name="totalprice" placeholder="Total Price (Rs)" value={formData.totalprice} onChange={handleChange} className={inputClass} required />
            <input type="number" name="discountedPrice" placeholder="Discounted Price (Rs - Optional)" value={formData.discountedPrice} onChange={handleChange} className={inputClass} />
          </div>

          {/* Image Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail */}
            <div>
              <label className="block mb-2 text-sm text-gray-400 font-poppins ">Product Thumbnail (Main Image)</label>
              <input type="file" accept="image/*" onChange={handleThumbnailChange} className={fileInputClass} required ref={thumbnailRef} />
              {thumbnailPreview && (
                <div className="mt-4 p-2 bg-[#141414] rounded-md border border-gray-700">
                  <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-48 object-cover rounded-md" />
                </div>
              )}
            </div>
            {/* Gallery Images */}
            <div>
              <label className="block mb-2 text-sm text-gray-400 font-poppins ">Gallery Images (Max 4)</label>
              <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className={fileInputClass} ref={galleryRef} />
              {galleryPreviews.length > 0 && (
                <div className="flex flex-wrap gap-4 p-4 mt-4 bg-[#141414] rounded-md border border-gray-700">
                  {galleryPreviews.map((src, index) => (
                    <img key={index} src={src} alt={`Gallery Preview ${index}`} className="w-24 h-24 object-cover rounded-md" />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Category Selection */}
          <div>
            <label className="block mb-2 text-sm text-gray-400 font-poppins ">Categories</label>
            <select onChange={(e) => handleAddCategory(e.target.value)} className={inputClass} value="">
              <option value="" disabled>Select a category to add...</option>
              {filteredCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.category.map((cat) => (
                <span key={cat} className="flex items-center px-3 py-1 rounded-full bg-cyan-400 text-black text-sm font-semibold">
                  {cat}
                  <XMarkIcon onClick={() => removeCategory(cat)} className="w-4 h-4 ml-2 cursor-pointer" />
                </span>
              ))}
            </div>
          </div>
          
          {/* Attributes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Gender Selection */}
            <div>
              <label className="block mb-2 text-sm text-gray-400 font-poppins ">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                {genderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            
            {/* Type Selection */}
            <div>
              <label className="block mb-2 text-sm text-gray-400 font-poppins ">Watch Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            
            {/* Material */}
            <div>
              <label className="block mb-2 text-sm text-gray-400 font-poppins ">Case Material</label>
              <input type="text" name="material" placeholder="e.g., Stainless Steel" value={formData.material} onChange={handleChange} className={inputClass} required />
            </div>

            {/* Size */}
            <div>
              <label className="block mb-2 text-sm text-gray-400 font-poppins ">Case Size (mm)</label>
              <input type="text" name="size" placeholder="e.g., 42mm" value={formData.size} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Color Input */}
          <div>
            <label className="block mb-2 text-sm text-gray-400 font-poppins ">Color</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select onChange={(e) => handleColorChange(e.target.value)} className={inputClass} value={formData.color || ""}>
                <option value="" disabled>Select from palette...</option>
                {colorPalette.map(c => <option key={c.name} value={c.name}>{c.name}</option>)} {/* Use c.name for value and display */}
              </select>
              <input type="text" placeholder="...or enter custom color" value={customColor} onChange={(e) => handleColorChange(e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Stock Info */}
              <label className="block mb-2 text-sm text-gray-400 font-poppins ">Quantity</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <input type="number" name="available" placeholder="Available in Stock" value={formData.available} onChange={handleChange} className={inputClass} required />
            <input type="number" name="sold" placeholder="Already Sold (optional)" value={formData.sold} onChange={handleChange} className={inputClass} />
          </div>

          {/* Featured Product Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 border-2 border-gray-400 rounded-sm checked:bg-cyan-400 checked:border-transparent focus:outline-none accent-cyan-400 focus:bg-cyan-400 ml-1"
            />
            <label htmlFor="featured" className="text-md font-normal text-gray-300 cursor-pointer font-poppins ">
              Mark as Featured Product
            </label>
          </div>

          <button type="submit" className="w-full md:w-auto bg-cyan-400 text-black px-7 py-2 rounded-lg font-bold text-md hover:bg-cyan-300 transition-transform transform hover:scale-[102%]">
            Submit Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadProduct;