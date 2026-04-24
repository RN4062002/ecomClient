import React, { useState, useEffect } from 'react';

const CategoryForm = ({ category, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    categoryName: '',
    isActive: true
  });

  useEffect(() => {
    if (category) {
      setFormData({
        categoryId: category.categoryId,
        categoryName: category.categoryName || '',
        isActive: category.isActive !== false
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">{category ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryName">
                Category Name
              </label>
              <input
                required
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2 h-4 w-4"
              />
              <label className="text-gray-700 text-sm font-bold" htmlFor="isActive">
                Is Active
              </label>
            </div>
            <div className="flex items-center justify-between mt-6">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
