import React, { useState } from "react";
import { X, Package, MapPin, Phone, User, CreditCard } from "lucide-react";
import {
  useCreateOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
} from "@/features/api/orderApi";

const BuyNowModal = ({ isOpen, onClose, crop }) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [createOrder] = useCreateOrderMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyRazorpayPaymentMutation();

  if (!isOpen || !crop) return null;

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(value, crop.available));
    setQuantity(newQuantity);
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
      console.log("Sending order payload:", {
        cropId: crop._id,
        quantity,
        address,
        phoneNumber,
      });

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
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Complete Your Order</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Summary */}
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex gap-4">
              <img
                src={crop.imageUrl}
                alt={crop.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-bold">{crop.name}</h4>
                <p className="text-sm">Available: {crop.available}kg</p>
                <p className="text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {crop.location}
                </p>
                <p className="text-sm flex items-center gap-1">
                  <User className="w-4 h-4" /> Seller: {crop.reportedBy?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="font-semibold">Quantity (kg)</label>
            <input
              type="number"
              min={1}
              max={crop.available}
              value={quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className="w-full mt-2 p-2 border rounded"
            />
          </div>

          {/* Address */}
          <div>
            <label className="font-semibold">Delivery Address *</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="font-semibold">Phone Number *</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
            />
          </div>

          {/* Payment */}
          <div className="flex items-center gap-2 font-semibold">
            <CreditCard className="w-5 h-5" />
            Online Payment (Razorpay)
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 py-3 rounded font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmOrder}
              className="flex-1 bg-green-600 text-white py-3 rounded font-bold"
            >
              Confirm & Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowModal;
