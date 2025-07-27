import { ClockIcon, CubeIcon, PaintBrushIcon, UserIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router'; // Keeping react-router as per your request

const Cards = ({ searchTerm, filterCategory, sortFilter, allProducts, loading, error }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [displayedProducts, setDisplayedProducts] = useState([]);

    useEffect(() => {
        if (allProducts && Array.isArray(allProducts)) {
            let tempProducts = [...allProducts];

          // Apply Category, Gender, Color, or Type Filter
            if (filterCategory && filterCategory.toLowerCase() !== 'all') {
                const lowercasedFilterCategory = filterCategory.toLowerCase(); // Lowercase once for efficiency
                tempProducts = tempProducts.filter(product => {
                    // Check if filterCategory matches any of these fields
                    return (
                        (Array.isArray(product.category) &&
                         product.category.some(cat => cat.toLowerCase() === lowercasedFilterCategory)) ||
                        (product.gender && product.gender.toLowerCase() === lowercasedFilterCategory) ||
                        (product.color && product.color.toLowerCase() === lowercasedFilterCategory) ||
                        (product.type && product.type.toLowerCase() === lowercasedFilterCategory)||
                        (product.material && product.material.toLowerCase() === lowercasedFilterCategory)
                    );
                });
            }
            // Apply Search Term Filter
            if (searchTerm) {
                const lowercasedSearchTerm = searchTerm.toLowerCase();
                tempProducts = tempProducts.filter(product =>
                    product.title?.toLowerCase().includes(lowercasedSearchTerm) ||
                    product.description?.toLowerCase().includes(lowercasedSearchTerm) ||
                    product.color?.toLowerCase().includes(lowercasedSearchTerm) ||
                    product.material?.toLowerCase().includes(lowercasedSearchTerm) ||
                    product.gender?.toLowerCase().includes(lowercasedSearchTerm) ||
                    product.type?.toLowerCase().includes(lowercasedSearchTerm) ||
                    (Array.isArray(product.category) && product.category.some(cat => cat.toLowerCase().includes(lowercasedSearchTerm)))
                );
            }

            // Apply Sort Filter
            if (sortFilter) {
                switch (sortFilter) {
                    case 'New to Old':
                        tempProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        break;
                    case 'Old to New':
                        tempProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                        break;
                    case 'Price: High to Low':
                        tempProducts.sort((a, b) => b.totalprice - a.totalprice);
                        break;
                    case 'Price: Low to High':
                        tempProducts.sort((a, b) => a.totalprice - b.totalprice);
                        break;
                    default:
                        break;
                }
            }

            setDisplayedProducts(location.pathname === '/' ? tempProducts.slice(0, 3) : tempProducts);
        } else {
            setDisplayedProducts([]);
        }
    }, [allProducts, searchTerm, filterCategory, sortFilter, location.pathname]);
    // console.log(displayedProducts)
    if (loading) {
        return <div className="text-white text-center py-10">Loading products...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">Error: {error}</div>;
    }

    if (displayedProducts.length === 0) {
        const hasInitialProducts = allProducts && allProducts.length > 0;
        if (hasInitialProducts && (searchTerm || (filterCategory && filterCategory.toLowerCase() !== 'all') || sortFilter)) {
            return <div className="text-white text-center py-10">No products found matching your criteria.</div>;
        }
        return <div className="text-white text-center py-10">No products available.</div>;
    }

    return (
        <div>
            <section className={`bg-[#080708] text-white pb-16 ${location.pathname === '/Shop' ? 'md:px-0 px-0' : 'md:px-10 px-4'} max-w-[1300px] mx-auto`}>
                <div className={`cards ${location.pathname === '/Shop' ?' gap-3 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 md:grid-cols-2 grid':'gap-3 lg:grid-cols-3 grid-cols-1 md:grid-cols-2 grid'}`}>
                    {displayedProducts?.map((item,index) => (
                        <div
                            key={index}
                            onClick={() => navigate(`/Product/${item._id}`)}
                            className={`card min-w-[300px] card bg-[#0E0E0E] ${location.pathname === '/Shop' ? 'min-h-[430px]':'min-h-[450px]'} h-max rounded-2xl flex flex-col justify-start items-center hover:bg-[#191919] transition-all duration-400 ease-in-out border-[.1px] border-transparent hover:border-[#383838] group hover:shadow-2xl shadow overflow-hidden cursor-pointer`}
                        >
                            <div className={`img w-full bg-cover bg-center ${location.pathname === '/Shop' ?'h-[250px]':'h-[320px]'} overflow-hidden`}>
                                <img src={`https://saair-backend-production.up.railway.app${Array.isArray(item?.images) ? item?.images[0] : item?.images}`} className='object-center object-cover w-full h-full' alt={item.title || 'Product image'} />
                            </div>
                            <div className="text px-6 py-2 w-full h-max ">
                                <div className="flex justify-between items-center">
                                    <h1 className='text-2xl font-saira my-1 line-clamp-1'>{item.title}</h1>
                                    <Link to={`/Product/${item._id}`} className='text-white px-6 rounded-xl py-1 border border-[#ffffff25] bg-[#fefefe0c] group-hover:border-gray-600 font-semibold hover:shadow-md transition duration-200 backdrop-filter backdrop-blur-sm shadow-md group-hover:shadow-cyan-400 font-saira' onClick={(e) => e.stopPropagation()}>
                                        View
                                    </Link>
                                </div>
                                <h1 className='text-3xl font-saira font-semibold pb-2 border-b border-b-[#38383050] group-hover:text-cyan-400 transition-all duration-400 ease-in-out'>Rs.{item.totalprice}</h1>
                                <div className="flex justify-start items-center my-3">
                                    <div className="flex flex-col justify-start items-center ">
                                        <h1 className='mt-2 min-w-[120px] flex justify-start items-center text-sm text-gray-300 font-light '><PaintBrushIcon className='size-4 mr-2' />{item.color}</h1>
                                        <h1 className='mt-2 min-w-[120px] flex justify-start items-center text-sm text-gray-300 font-light'><CubeIcon className='size-4 mr-2' />{item.material}</h1>
                                    </div>
                                    <div className="flex flex-col justify-start items-center">
                                        <h1 className='mt-2 min-w-[120px] flex justify-start items-center text-sm text-gray-300 font-light'><UserIcon className='size-4 mx-2' />{item.gender}</h1>
                                        <h1 className='mt-2 min-w-[120px] flex justify-start items-center text-sm text-gray-300 font-light'><ClockIcon className='size-4 mx-2' />{item.type}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Cards;
