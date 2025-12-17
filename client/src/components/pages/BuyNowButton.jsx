import {
  useCreateOrderMutation,
  useCreateRazorpayOrderMutation,
} from "@/redux/orderApi";

const BuyNowButton = ({ cropId, quantity, disabled = false }) => {
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [createRazorpayOrder, { isLoading: isCreatingRazorpay }] =
    useCreateRazorpayOrderMutation();

  const handleBuyNow = async () => {
    try {
      // 1️⃣ Create DB Order
      const orderRes = await createOrder({
        cropId,
        quantity,
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
        handler: function (response) {
          console.log("Payment success:", response);
          // STEP 5 → verification (next)
        },
        theme: { color: "#22c55e" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Buy Now error:", error);
      alert(error?.data?.message || "Payment initialization failed");
    }
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={disabled || isCreatingOrder || isCreatingRazorpay}
      className="px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600
        hover:from-green-700 hover:to-emerald-700
        disabled:opacity-60 disabled:cursor-not-allowed
        text-white rounded-lg font-bold text-base
        transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
    >
      Buy Now
    </button>
  );
};

export default BuyNowButton;
