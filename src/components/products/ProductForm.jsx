import React, { useState, useEffect } from 'react';
import { getCategoriesApi } from '../../api/categoryApi';
import { XMarkIcon } from '@heroicons/react/24/outline';

const IMAGE_BASE_URL = "https://localhost:7059/";

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stockQuantity: '',
    isActive: true
  });
  
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imageUrlsToDelete, setImageUrlsToDelete] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesApi();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();

    if (product) {
      setFormData({
        productId: product.productId,
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        categoryId: product.categoryId || '',
        stockQuantity: product.stockQuantity || '',
        isActive: product.isActive !== false
      });
      setExistingImages(product.imageUrls || []);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url) => {
    setExistingImages(prev => prev.filter(item => item !== url));
    setImageUrlsToDelete(prev => [...prev, url]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('ProductId', formData.productId || 0);
    data.append('Name', formData.name);
    data.append('Description', formData.description || '');
    data.append('Price', formData.price);
    data.append('CategoryId', parseInt(formData.categoryId) || 0);
    data.append('StockQuantity', parseInt(formData.stockQuantity) || 0);
    data.append('IsActive', formData.isActive);
    
    // Add new images
    selectedFiles.forEach((file) => {
      data.append('Images', file);
    });

    // Add list of images to delete
    imageUrlsToDelete.forEach((url) => {
        data.append('ImageUrlsToDelete', url);
    });

    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl my-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{product ? 'Edit Product' : 'Add Product'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded-md py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                        <select
                            required
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="w-full border rounded-md py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Price ($)</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full border rounded-md py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
                            <input
                                required
                                type="number"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleChange}
                                className="w-full border rounded-md py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border rounded-md py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                </div>
            </div>

            {/* Image Preview Section */}
            {(existingImages.length > 0 || previews.length > 0) && (
                <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Image Previews</label>
                    <div className="flex flex-wrap gap-4 border p-4 rounded-md bg-gray-50 max-h-48 overflow-y-auto">
                        {/* Existing Images */}
                        {existingImages.map((url, idx) => (
                            <div key={`exist-${idx}`} className="relative group size-20">
                                <img 
                                    src={`${IMAGE_BASE_URL}${url}`} 
                                    className="size-full object-cover rounded-md border"
                                    alt="Existing"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(url)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <XMarkIcon className="size-4" />
                                </button>
                            </div>
                        ))}
                        {/* New File Previews */}
                        {previews.map((blobUrl, idx) => (
                            <div key={`new-${idx}`} className="relative group size-20">
                                <img 
                                    src={blobUrl} 
                                    className="size-full object-cover rounded-md border border-blue-400"
                                    alt="New Preview"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeNewImage(idx)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                                >
                                    <XMarkIcon className="size-4" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-[8px] text-white text-center rounded-b-md">New</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-end space-x-4 mt-8 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border rounded-md text-gray-600 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm"
              >
                {product ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
