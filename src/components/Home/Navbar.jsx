import React, { Fragment, useState, useEffect } from 'react'
import Cart from '../products/Cart.jsx'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext';
import { useCart } from '../../contexts/cartContext';
import { getCategoriesApi } from '../../api/categoryApi';

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { cartItems = [] } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategoriesApi();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to load navbar categories", error);
      }
    };
    fetchCats();
  }, []);

  function logoutfn(e) {
    e.preventDefault();
    const response = logout();
    if (response) {
      alert("Logout successfully..");
      navigate("/Login");
    }
  }

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      navigate("/ProductList", { state: { search: searchTerm } });
    }
  };

  // Debounced search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // If searchTerm is cleared, send empty search to show all products
      navigate("/ProductList", { state: { search: searchTerm.trim() } });
    }, 700);
    

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleBlur = () => {
    // Optionally clear or handle blur here if needed 
    // The user specifically mentioned "if he click outside search box seach don't"
    // So we ensure the blur doesn't trigger a search (the timeout handle above handles the auto-search)
  };

  return (
    <div className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop transition className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0" />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel transition className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full">
            <div className="flex px-4 pt-5 pb-2">
              <button type="button" onClick={() => setOpen(false)} className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400">
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {categories.map((category) => (
                <div key={category.categoryId} className="flow-root">
                  <Link 
                    to="/ProductList" 
                    state={{ categoryId: category.categoryId }} 
                    className="-m-2 block p-2 font-medium text-gray-900 hover:text-indigo-600"
                    onClick={() => setOpen(false)}
                  >
                    {category.categoryName}
                  </Link>
                </div>
              ))}
              <div className="flow-root">
                <Link to="/ProductList" className="-m-2 block p-2 font-medium text-gray-900" onClick={() => setOpen(false)}>All Products</Link>
              </div>
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {!user ? (
                <>
                  <div className="flow-root">
                    <Link to="/Login" className="-m-2 block p-2 font-medium text-gray-900" onClick={() => setOpen(false)}>Sign in</Link>
                  </div>
                  <div className="flow-root">
                    <Link to="/Register" className="-m-2 block p-2 font-medium text-gray-900" onClick={() => setOpen(false)}>Create account</Link>
                  </div>
                </>
              ) : (
                <div className="flow-root">
                  <button onClick={logoutfn} className="-m-2 block p-2 font-medium text-red-600">Logout</button>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-white border-b border-gray-100">
        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <button type="button" onClick={() => setOpen(true)} className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden">
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to="/" className="flex items-center">
                  <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="" className="h-8 w-auto" />
                  <span className="ml-2 text-xl font-bold tracking-tight text-gray-900">E-Shop</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <PopoverGroup className="hidden lg:ml-10 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8 items-center">
                  <Link to="/ProductList" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                    All Products
                  </Link>
                  
                  {/* Quick Categories */}
                  {categories.slice(0, 4).map((category) => (
                    <Link 
                      key={category.categoryId} 
                      to="/ProductList" 
                      state={{ categoryId: category.categoryId, categoryName: category.categoryName }}
                      className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      {category.categoryName}
                    </Link>
                  ))}

                  {/* Admin Dropdown */}
                  {user && user.UserType === 'Admin' && (
                    <Popover className="relative flex h-full items-center">
                      <PopoverButton className="group flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 outline-none">
                        Admin
                        <ChevronDownIcon className="ml-1 size-4 text-gray-400 group-hover:text-indigo-500" />
                      </PopoverButton>
                      <PopoverPanel transition className="absolute top-full left-0 z-20 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out">
                        <Link to="/Admin/ProductList" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Products</Link>
                        <Link to="/Admin/Categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Categories</Link>
                      </PopoverPanel>
                    </Popover>
                  )}
                </div>
              </PopoverGroup>
            </div>

            <div className="flex items-center space-x-6">
              {/* Search */}
              <div className="flex lg:ml-6">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="block w-full rounded-full border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all w-32 focus:w-64"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                </form>
              </div>

              {/* Cart */}
              <div className="flow-root lg:ml-6">
                <div className="group -m-2 flex items-center p-2 cursor-pointer">
                  <Cart />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-indigo-600">
                    {totalItems}
                  </span>
                </div>
              </div>

              {/* Auth Links */}
              <div className="hidden lg:flex lg:items-center lg:space-x-4">
                {!user ? (
                  <>
                    <Link to="/Login" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Sign in</Link>
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                    <Link to="/Register" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Create account</Link>
                  </>
                ) : (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500 ">Hi, {user.UserName} </span>
                    <button 
                      onClick={logoutfn} 
                      className="text-sm font-medium text-gray-700 hover:text-indigo-600" 
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
