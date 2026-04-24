import React, { useEffect, useState } from 'react';
import CategoryForm from './CategoryForm';
import { getCategoriesApi, addCategoryApi, updateCategoryApi, deleteCategoryApi } from '../../api/categoryApi';
import Loader from '../Items/Loader';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategoriesApi();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategoryApi(categoryId);
        setCategories(categories.filter((c) => c.categoryId !== categoryId));
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("Failed to delete category");
      }
    }
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      if (selectedCategory) {
        await updateCategoryApi(selectedCategory.categoryId, categoryData);
      } else {
        await addCategoryApi(categoryData);
      }
      setIsFormOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("Failed to save category");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Manage Categories</h2>
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Category Name</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.categoryId} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{category.categoryName}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded text-xs ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.categoryId)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isFormOpen && (
          <CategoryForm
            category={selectedCategory}
            onSave={handleSaveCategory}
            onCancel={() => setIsFormOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Categories;
