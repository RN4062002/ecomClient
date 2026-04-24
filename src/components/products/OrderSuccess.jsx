import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const total = location.state?.total;

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <CheckCircleIcon className="mx-auto h-20 w-20 text-green-500" />
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Order Placed Successfully!</h1>
        <p className="mt-4 text-lg text-gray-600">
          Thank you for your purchase. Your order has been confirmed and is being processed.
        </p>
        
        {orderId && (
          <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-100">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Order Number</span>
              <span className="font-semibold text-gray-900">#{orderId}</span>
            </div>
            {total && (
              <div className="flex justify-between">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-semibold text-gray-900">${total}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 space-y-4">
          <Link
            to={`/Invoice/${orderId}`}
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
          >
            View Invoice
          </Link>
          <Link
            to="/ProductList"
            className="block w-full bg-white hover:bg-gray-50 text-indigo-600 font-semibold py-3 border border-indigo-600 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
