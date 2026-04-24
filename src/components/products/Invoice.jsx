import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../Items/Loader';
import { PrinterIcon, ArrowDownTrayIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const Invoice = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`Order/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order for invoice", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Loader />;
  if (!order) return <div className="text-center py-20">Order not found.</div>;

  const payment = order.payments?.[0];
  const subtotal = order.orderItems.reduce((acc, item) => acc + (item.priceAtPurchase * item.quantity), 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-gray-100 min-h-screen py-10 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Actions - Hidden on print */}
        <div className="mb-6 flex justify-between items-center print:hidden">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="size-4 mr-1" />
            Back
          </button>
          <div className="flex space-x-3">
            <button 
              onClick={handlePrint}
              className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              <PrinterIcon className="size-4 mr-2" />
              Print Invoice
            </button>
          </div>
        </div>

        {/* Invoice Paper */}
        <div ref={invoiceRef} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 p-8 sm:p-12 print:shadow-none print:border-none print:p-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-10 mb-10">
            <div>
                <div className="flex items-center mb-4">
                    <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="" className="h-10 w-auto mr-3" />
                    <span className="text-2xl font-black tracking-tight text-gray-900">E-SHOP</span>
                </div>
                <p className="text-sm text-gray-500">123 Commerce Way, Tech City</p>
                <p className="text-sm text-gray-500">support@eshop.com | +1 234 567 890</p>
            </div>
            <div className="mt-6 sm:mt-0 text-left sm:text-right">
                <h1 className="text-4xl font-light text-gray-900 uppercase tracking-widest mb-2">Invoice</h1>
                <p className="text-sm font-bold text-gray-900">Order #{order.orderId}</p>
                <p className="text-sm text-gray-500">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                    {payment?.paymentStatus || "Paid"}
                </div>
            </div>
          </div>

          {/* Billing/Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Billed To</h3>
                <p className="font-bold text-gray-900 text-lg">{order.user?.userFirstName} {order.user?.userLastName}</p>
                <p className="text-gray-600">@{order.user?.userName}</p>
                <p className="text-gray-600">{order.user?.userEmail}</p>
            </div>
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Details</h3>
                <p className="text-gray-900 font-medium">Method: {payment?.paymentMode || "Credit Card"}</p>
                <p className="text-sm text-gray-500">Transaction ID: {payment?.transactionId?.substring(0, 18)}...</p>
                <p className="text-sm text-gray-500">Status: {payment?.paymentStatus || "Authorized"}</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full mb-12 text-left">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="py-4 text-xs font-bold text-gray-900 uppercase tracking-widest">Item Description</th>
                <th className="py-4 text-xs font-bold text-gray-900 uppercase tracking-widest text-center">Qty</th>
                <th className="py-4 text-xs font-bold text-gray-900 uppercase tracking-widest text-right">Unit Price</th>
                <th className="py-4 text-xs font-bold text-gray-900 uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.orderItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-6">
                    <p className="font-bold text-gray-900">{item.product.productName}</p>
                    <p className="text-xs text-gray-500">{item.product.productDesc?.substring(0, 60)}...</p>
                  </td>
                  <td className="py-6 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-6 text-right text-gray-600">${item.priceAtPurchase.toFixed(2)}</td>
                  <td className="py-6 text-right font-bold text-gray-900">${(item.priceAtPurchase * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (18%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t-2 border-gray-900 flex justify-between text-xl font-black text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-20 pt-10 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 italic">This is a computer generated invoice and does not require a physical signature.</p>
            <p className="mt-2 text-indigo-600 font-bold">Thank you for choosing E-Shop!</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Invoice;
