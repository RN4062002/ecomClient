import React, { useEffect, useState, Fragment } from 'react';
import ProductCard from './ProductCard';
import { getAllProductsApi } from '../../api/productApi';
import { getCategoriesApi } from '../../api/categoryApi';
import Loader from '../Items/Loader';
import Breadcrumbs from '../Items/Breadcrumbs';
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid'
import { Listbox, Transition } from '@headlessui/react'
import { useLocation } from 'react-router-dom';

export default function ProductList() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Pagination state
  const initialCategory = location.state?.categoryId 
    ? { categoryId: location.state.categoryId, categoryName: location.state.categoryName || 'Category' }
    : { categoryId: null, categoryName: 'All Products' };

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(location.state?.search || "");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(12); 
  const [totalCount, setTotalCount] = useState(0);

  // Update selected category or search if navigation state changes (from Navbar)
  useEffect(() => {
    if (location.state?.categoryId !== undefined) {
        setSelectedCategory({ 
            categoryId: location.state.categoryId, 
            categoryName: location.state.categoryName || 'Filtered Category' 
        });
        setSearchQuery(""); // Clear search if category selected
        setPageNumber(1);
    } else if (location.state?.search !== undefined) {
        setSearchQuery(location.state.search);
        setSelectedCategory({ categoryId: null, categoryName: 'All Products' }); // Clear category if searching
        setPageNumber(1);
    } else {
        // Handle "All Products" click (no state)
        setSelectedCategory({ categoryId: null, categoryName: 'All Products' });
        setSearchQuery("");
        setPageNumber(1);
    }
  }, [location.key]); // Use location.key to detect any navigation event

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesApi();
        const allCats = [{ categoryId: null, categoryName: 'All Products' }, ...(data || [])];
        setCategories(allCats);
        
        // If we have a categoryId but no name (e.g. from mobile menu link), find the name
        if (selectedCategory.categoryId && selectedCategory.categoryName === 'Filtered Category') {
            const found = allCats.find(c => c.categoryId === selectedCategory.categoryId);
            if (found) setSelectedCategory(found);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    debugger
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProductsApi(selectedCategory.categoryId, pageNumber, pageSize, searchQuery);
        setProducts(data?.products || []);
        setTotalCount(data?.totalCount || 0);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory.categoryId, pageNumber, pageSize, searchQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPageNumber(1); 
  };

  const breadcrumbPages = [
    { name: 'Products', href: '/ProductList', current: !selectedCategory.categoryId },
  ];
  if (selectedCategory.categoryId) {
    breadcrumbPages.push({ name: selectedCategory.categoryName, href: '#', current: true });
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  if (loading && products.length === 0) return <Loader />;
  if (error) return <div className="text-center py-10 text-red-500 font-medium">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <Breadcrumbs pages={breadcrumbPages} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : (selectedCategory.categoryId ? selectedCategory.categoryName : 'All Items')}
                <span className="ml-2 text-sm font-normal text-gray-500">1-{products.length} of {totalCount} results</span>
            </h2>

            <div className="w-full max-w-xs">
                <Listbox value={selectedCategory} onChange={handleCategoryChange}>
                <div className="relative">
                    <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all hover:bg-gray-50">
                    <span className="block truncate font-medium text-gray-700">Sort by: {selectedCategory.categoryName}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    </span>
                    </Listbox.Button>
                    <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    >
                    <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {categories.map((cat, idx) => (
                        <Listbox.Option
                            key={idx}
                            className={({ active }) =>
                            `relative cursor-default select-none py-2.5 pl-10 pr-4 ${
                                active ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'
                            }`
                            }
                            value={cat}
                        >
                            {({ selected }) => (
                            <>
                                <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                {cat.categoryName}
                                </span>
                                {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                </span>
                                ) : null}
                            </>
                            )}
                        </Listbox.Option>
                        ))}
                    </Listbox.Options>
                    </Transition>
                </div>
                </Listbox>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
          {products.length === 0 && !loading && (
            <div className="col-span-full text-center py-20 bg-white rounded-lg border border-dashed border-gray-300 shadow-sm">
                <p className="text-gray-400 text-lg">No results found.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalCount > pageSize && (
          <div className="flex items-center justify-center pt-8 border-t border-gray-200">
            <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm bg-white">
                <button
                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                disabled={pageNumber === 1}
                className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                <ChevronLeftIcon aria-hidden="true" className="size-5" />
                <span className="ml-1 text-sm font-medium">Previous</span>
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i + 1}
                    onClick={() => setPageNumber(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all ${
                    pageNumber === i + 1
                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 shadow-sm'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                >
                    {i + 1}
                </button>
                ))}

                <button
                onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
                disabled={pageNumber === totalPages}
                className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                <span className="mr-1 text-sm font-medium">Next</span>
                <ChevronRightIcon aria-hidden="true" className="size-5" />
                </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
