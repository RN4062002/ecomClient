import React, { useState } from 'react';
import { useCart } from '../../contexts/cartContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../Items/Loader';
import { CheckIcon, CreditCardIcon, MapPinIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const steps = [
  { id: 1, name: 'Shipping', icon: MapPinIcon },
  { id: 2, name: 'Payment', icon: CreditCardIcon },
  { id: 3, name: 'Review', icon: ShoppingBagIcon },
];

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    zipCode: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  
  // Payment Form State
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });

  // const subtotal = cartItems.reduce((acc, item) => {
  //   const price = parseFloat(item.price.replace('$', ''));
  //   return acc + (isNaN(price) ? 0 : price) * item.quantity;
  // }, 0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleNextStep = () => setCurrentStep(prev => prev + 1);
  const handlePrevStep = () => setCurrentStep(prev => prev - 1);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      // 1. Create Order
      const orderRes = await axiosInstance.post("Order");
      const order = orderRes.data;

      // 2. Process Payment with Mock Gateway Logic
      // If payment method is Credit/Debit, send card details
      const paymentRequest = {
        orderId: order.orderId,
        amount: total, // Use calculated total
        paymentMethod: paymentMethod,
        cardNumber: cardDetails.number || "0000000000000", // Default mock
        expiryDate: cardDetails.expiry || "12/25",
        cvv: cardDetails.cvc || "123"
      };

      await axiosInstance.post("Payment", paymentRequest);

      // 3. Clear Cart (local state)
      clearCart();

      // 4. Navigate to Success
      navigate("/OrderSuccess", { 
        state: { 
          orderId: order.orderId, 
          total: total.toFixed(2) 
        } 
      });

    } catch (error) {
      console.error("Checkout failed:", error);
      const msg = error.response?.data || "Failed to complete checkout. Please try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (cartItems.length === 0 && currentStep === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingBagIcon className="h-20 w-20 text-gray-200" />
        <h2 className="mt-4 text-xl font-medium text-gray-900">Your cart is empty</h2>
        <button onClick={() => navigate("/ProductList")} className="mt-6 text-indigo-600 font-semibold">
          Go shopping &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Bar */}
        <nav aria-label="Progress" className="mb-12">
          <ol role="list" className="flex items-center justify-center space-x-8 sm:space-x-20">
            {steps.map((step) => (
              <li key={step.name} className="relative">
                <div className="flex flex-col items-center group">
                  <span className={`flex size-10 items-center justify-center rounded-full border-2 transition-colors ${
                    currentStep >= step.id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.id ? <CheckIcon className="size-6" /> : <step.icon className="size-6" />}
                  </span>
                  <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                    currentStep >= step.id ? 'text-indigo-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
          
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={address.fullName}
                        onChange={(e) => setAddress({...address, fullName: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input 
                        type="text" 
                        value={address.street}
                        onChange={(e) => setAddress({...address, street: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="123 Main St"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input 
                        type="text" 
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                      <input 
                        type="text" 
                        value={address.zipCode}
                        onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
                  <div className="space-y-4">
                    {['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                      <label key={method} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === method ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input 
                          type="radio" 
                          name="payment" 
                          className="size-5 text-indigo-600" 
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                        />
                        <span className="ml-4 font-semibold text-gray-900">{method}</span>
                      </label>
                    ))}

                    {/* Credit Card Form */}
                    {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
                      <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Card Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Card Number</label>
                            <input 
                              type="text" 
                              placeholder="0000 0000 0000 0000"
                              value={cardDetails.number}
                              onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Expiry Date</label>
                            <input 
                              type="text" 
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">CVC</label>
                            <input 
                              type="text" 
                              placeholder="123"
                              value={cardDetails.cvc}
                              onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Order</h2>
                  <div className="space-y-6">
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Shipping To</p>
                        <p className="font-medium">{address.fullName}</p>
                        <p className="text-sm text-gray-600">{address.street}, {address.city}</p>
                      </div>
                      <button onClick={() => setCurrentStep(1)} className="text-sm text-indigo-600 font-bold hover:underline">Change</button>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Payment Method</p>
                        <p className="font-medium">{paymentMethod}</p>
                      </div>
                      <button onClick={() => setCurrentStep(2)} className="text-sm text-indigo-600 font-bold hover:underline">Change</button>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {cartItems.map((item) => (
                        <div key={item.id} className="py-4 flex items-center">
                          <img src={item.image} alt="" className="size-16 object-cover rounded-lg border" />
                          <div className="ml-4 flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-gray-900">{item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="p-8 bg-gray-50 border-t border-gray-200 flex justify-between">
                {currentStep > 1 ? (
                  <button onClick={handlePrevStep} className="px-8 py-3 font-bold text-gray-600 hover:text-gray-900 transition-colors">
                    Back
                  </button>
                ) : <div />}
                
                {currentStep < 3 ? (
                  <button 
                    onClick={handleNextStep} 
                    disabled={currentStep === 1 && (!address.fullName || !address.street)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    Continue
                  </button>
                ) : (
                  <button 
                    onClick={handlePlaceOrder}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-3 rounded-xl transition-all shadow-md"
                  >
                    Place Order
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax (18%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between text-xl font-extrabold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-xs text-indigo-700 font-medium">
                  {subtotal > 500 ? "🎉 You've unlocked FREE Shipping!" : `Add $${(500 - subtotal).toFixed(2)} more for FREE shipping.`}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
