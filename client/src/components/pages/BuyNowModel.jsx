import React, { useState } from 'react';
import { X, Package, IndianRupee, MapPin, Phone, User, CreditCard, Truck } from 'lucide-react';
import { useCreateOrderMutation, useCreateRazorpayOrderMutation, useVerifyRazorpayPaymentMutation } from '@/features/api/orderApi';

const BuyNowModal = ({ isOpen, onClose, crop }) => {
  const [quantity, setQuantity] = useState("");
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [createOrder] = useCreateOrderMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyRazorpayPaymentMutation();


  if (!isOpen || !crop) return null;

  const totalPrice = (parseInt(crop.price) * parseInt(quantity)).toFixed(2);
  const deliveryCharge = 50;
  const finalTotal = (parseFloat(totalPrice) + deliveryCharge).toFixed(2);

  const handleQuantityChange = (value) => {
    if(value<0)value=0;
    setQuantity(value);
  };

    const handleConfirmOrder = async () => {
    try {
      if (!address.trim()) {
        alert("Please enter delivery address");
        return;
      }

      if (!phoneNumber.trim()) {
        alert("Please enter phone number");
        return;
      }

      // 1️⃣ Create DB Order
      const orderRes = await createOrder({
        cropId: crop._id,
        quantity,
        address,
        phoneNumber,
      }).unwrap();

      const orderId = orderRes.order._id;

      // 2️⃣ Create Razorpay Order
      const razorRes = await createRazorpayOrder({
        orderId,
      }).unwrap();

      const razorpayOrder = razorRes.razorpayOrder;

      // 3️⃣ Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: "AgroConnect",
        description: "Crop Purchase",

        handler: async function (response) {
          try {
            // 4️⃣ Verify payment on backend
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            alert("Payment successful! Order confirmed 🎉");
            onClose();
          } catch (err) {
            console.error("Verification failed:", err);
            alert("Payment verification failed");
          }
        },

        theme: { color: "#22c55e" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", () => {
        alert("Payment failed. Please try again.");
      });
    } catch (error) {
      console.error("Buy Now error:", error);
      alert(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Complete Your Order</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Order Summary</h3>
            <div className="flex gap-4">
              {crop.imageUrl && (
                <img
                  src={crop.imageUrl}
                  alt={crop.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1">{crop.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <Package className="w-4 h-4" />
                  <span>Available: {crop.available}kg</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>{crop.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4" />
                  <span>Seller: {crop.reportedBy?.name || crop.farmer?.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="bg-white dark:bg-gray-700/50 rounded-xl p-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Quantity (kg)
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="w-10 h-10 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg font-bold text-lg transition-colors"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange((e.target.value) || "")}
                className="w-20 h-10 text-center bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="1"
                max={crop.available}
              />
              <button
                onClick={() => handleQuantityChange(parseInt(quantity) + 1)}
                className="w-10 h-10 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg font-bold text-lg transition-colors"
              >
                +
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                Max: {crop.available}kg
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white dark:bg-gray-700/50 rounded-xl p-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Delivery Address *
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your complete delivery address..."
              rows="3"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Phone Number */}
          <div className="bg-white dark:bg-gray-700/50 rounded-xl p-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Phone Number *
            </label>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-700/50 rounded-xl p-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Payment Method
            </label>
            <div className="space-y-2">
              {/* <label className="flex items-center gap-3 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-green-600"
                />
                <Truck className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-800 dark:text-gray-100 font-medium">Cash on Delivery</span>
              </label> */}
              <label className="flex items-center gap-3 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-green-600"
                />
                <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-800 dark:text-gray-100 font-medium">Online Payment</span>
              </label>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Price Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Price ({quantity}kg × ₹{crop.price.toFixed(2)})</span>
                <span className="font-semibold">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery Charges</span>
                <span className="font-semibold">₹{deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-2 mt-2">
                <div className="flex justify-between text-gray-800 dark:text-gray-100 text-xl font-bold">
                  <span>Total Amount</span>
                  <span className="text-green-600 dark:text-green-400">₹{finalTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmOrder}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold transition-all duration-200 shadow-lg"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowModal;