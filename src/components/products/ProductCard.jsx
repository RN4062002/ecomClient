import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';

const IMAGE_BASE_URL = "https://localhost:7059/";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    debugger
    navigate("/ProductOverView", { state: { product } });
  };
  
  const imageUrl = product.imageUrls && product.imageUrls.length > 0 
    ? `${IMAGE_BASE_URL}${product.imageUrls[0]}` 
    : "https://via.placeholder.com/500";

  // Simulated rating data
  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 2000) + 50;

  return (
    <div 
      onClick={handleViewProduct}
      className="group bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="aspect-square w-full bg-gray-50 overflow-hidden p-4">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" 
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600">
          {product.name}
        </h3>
        
        {/* Ratings */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <StarIcon
                key={i}
                className={`size-4 shrink-0 ${rating > i ? 'text-yellow-400' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <span className="ml-1 text-xs text-indigo-600 font-medium">{reviewCount}</span>
        </div>

        {/* Price */}
        <div className="mt-auto">
        <div className="flex items-baseline">
          <span className="text-xs font-medium self-start mt-1 mr-0.5">$</span>
          <span className="text-xl font-bold text-gray-900">{Math.floor(product.price)}</span>
          <span className="text-xs font-medium self-start mt-1">{(product.price % 1).toFixed(2).substring(1)}</span>
        </div>
        </div>
        <button
           className="mt-4 w-full bg-white-400 hover:bg-indigo text-gray-900 hover:text-indigo-600 text-xs font-bold py-2 rounded-full transition-colors duration-300 shadow-sm border border-indigo-600"
          onClick={(e) => {
            e.stopPropagation();
            // Handle add to cart or navigate
            handleViewProduct();
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
