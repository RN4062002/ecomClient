import React, { useState, useEffect } from 'react'
import { StarIcon, CheckIcon, ShieldCheckIcon, TruckIcon, ArrowPathIcon } from '@heroicons/react/20/solid'
import { useCart } from '../../contexts/cartContext'
import { useLocation, useNavigate } from 'react-router-dom'
import Breadcrumbs from '../Items/Breadcrumbs';
import { getCategoriesApi } from '../../api/categoryApi';

const IMAGE_BASE_URL = "https://localhost:7059/";

const defaultProduct = {
  sizes: [
    { name: 'XXS', inStock: false },
    { name: 'XS', inStock: true },
    { name: 'S', inStock: true },
    { name: 'M', inStock: true },
    { name: 'L', inStock: true },
    { name: 'XL', inStock: true },
  ],
  highlights: [
    'Premium quality materials',
    'Ethically sourced and produced',
    'Reinforced stitching for durability',
    'Machine washable'
  ],
}

const reviews = { average: 4.5, totalCount: 1248 }

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function ProductOverView() {
  const { addToCart } = useCart();
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;
  
  const [categoryName, setCategoryName] = useState("Category");
  const images = product?.imageUrls?.map(url => `${IMAGE_BASE_URL}${url}`) || ["https://via.placeholder.com/600"];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchCatName = async () => {
      debugger
        if (product?.categoryId) {
            try {
                const cats = await getCategoriesApi();
                const found = cats.find(c => c.categoryId === product.categoryId);
                if (found) setCategoryName(found.categoryName);
            } catch (err) {
                console.error(err);
            }
        }
    }
    fetchCatName();
  }, [product]);

  if (!product) {
      return <div className="text-center py-20 text-gray-500">Product not found.</div>;
  }

  const handleAddToCart = () => {
    debugger
    setIsAdding(true);
    addToCart({
      id: product.productId,
      name: product.name,
      price: product.price,
      image: images[0],
      quantity: 1,
    });
    
    // Reset animation state after 1 second
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleBuyNow = () => {
    debugger
    handleAddToCart();
    navigate("/Checkout");
  };

  const breadcrumbPages = [
    { name: 'Products', href: '/ProductList', current: false },
    { 
        name: categoryName, 
        href: '/ProductList', 
        state: { categoryId: product.categoryId, categoryName: categoryName },
        current: false 
    },
    { name: product.name, href: '#', current: true },
  ];
  
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <Breadcrumbs pages={breadcrumbPages} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10">
          
          {/* 1. Left Column: Image Gallery */}
          <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={classNames(
                    "flex-shrink-0 size-16 md:size-20 rounded-md border-2 overflow-hidden transition-all",
                    selectedImage === img ? "border-indigo-600 ring-2 ring-indigo-100" : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <img src={img} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 aspect-square rounded-xl bg-gray-50 overflow-hidden border border-gray-100">
              <img
                src={selectedImage}
                alt={product.name}
                className="size-full object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* 2. Middle Column: Product Info */}
          <div className="lg:col-span-4 border-b lg:border-b-0 pb-8 lg:pb-0">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={classNames(
                      reviews.average > rating ? 'text-yellow-400' : 'text-gray-200',
                      'size-5 shrink-0'
                    )}
                  />
                ))}
              </div>
              <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                {reviews.totalCount} ratings
              </a>
            </div>

            <div className="space-y-6">
              <div className="border-t border-b border-gray-100 py-4">
                <p className="text-3xl font-light text-gray-900">${product.price}</p>
                <p className="text-sm text-green-600 font-medium mt-1">Inclusive of all taxes</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Description</h3>
                <p className="mt-3 text-base text-gray-600 leading-relaxed">
                  {product.description || "No description available for this item."}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Highlights</h3>
                <ul className="mt-4 space-y-2">
                  {(product.highlights || defaultProduct.highlights).map((highlight) => (
                    <li key={highlight} className="flex items-start text-sm text-gray-600">
                      <CheckIcon className="size-5 text-green-500 mr-2 shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Right Column: Buy Box */}
          <div className="lg:col-span-3">
            <div className="border border-gray-200 rounded-xl p-6 sticky top-8 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 mb-4">${product.price}</div>
              
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <div className={classNames(
                    "size-2 rounded-full mr-2",
                    product.stockQuantity > 0 ? "bg-green-500" : "bg-red-500"
                  )} />
                  <span className={product.stockQuantity > 0 ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                    {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : "Out of Stock"}
                  </span>
                </div>
                {product.stockQuantity > 0 &&(
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={classNames(
                      "w-full font-medium py-3 rounded-lg transition-all duration-300 shadow-sm disabled:cursor-not-allowed",
                      isAdding 
                        ? "bg-green-600 text-white animate-cart-pop scale-95" 
                        : "bg-indigo-700 hover:bg-indigo-500 text-white"
                    )}
                  >
                    {isAdding ? (
                      <span className="flex items-center justify-center">
                        <CheckIcon className="size-5 mr-2" />
                        Added to Bag
                      </span>
                    ) : "Add to Bag"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-black hover:bg-black-600 text-white font-medium py-3 rounded-lg transition-colors shadow-sm disabled:bg-gray-200"
                  >
                    Buy Now
                  </button>
                </div>
                 )}

                <div className="pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <TruckIcon className="size-4 mr-2" />
                    <span>Fast Delivery available</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <ShieldCheckIcon className="size-4 mr-2" />
                    <span>Secure transaction</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <ArrowPathIcon className="size-4 mr-2" />
                    <span>7-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
export default ProductOverView;
