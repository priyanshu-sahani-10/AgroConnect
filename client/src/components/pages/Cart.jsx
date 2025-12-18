import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Package, 
  ShoppingBag,
  IndianRupee
} from "lucide-react";
import { useGetCartQuery, useRemoveFromCartMutation } from "@/features/api/cartApi";

const Cart = () => {

  const navigate= useNavigate();

  // cart mutation data is here
  const {data,isError,isLoading}=useGetCartQuery();
  const [removeFromCart]=useRemoveFromCartMutation();
  const cartItems=data?.items || [];
  console.log("data in cart page : ",data);
  

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.available), 0);
  const deliveryCharge = cartItems.length > 0 ? 50 : 0;
  const total = subtotal + deliveryCharge;


  const removeCartItemHandler = async(item)=>{
    try {
      const cropId=item.cropId;
      const res=await removeFromCart({cropId}).unwrap();
      const message=res.message;
      alert(`${message}`);
    } catch (error) {
      console.log("Error in remove item from cart : ",error);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Loading crop details...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Please wait
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Failed to load crop details. Please try again later.
          </p>
          <button
            onClick={() => navigate("/marketplace")}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Looks like you haven't added any crops yet. Start shopping to fill your cart!
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2 mx-auto"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="w-8 h-8 text-green-600 dark:text-green-400" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              Your Cart
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item,index) => (
              <div
                key={item._id}
                onClick={() => navigate(`/marketplace/${item.cropId}`)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1 truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <Package className="w-4 h-4" />
                      <span>{item.available} kg</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <IndianRupee className="w-4 h-4" />
                      <span className="text-xl font-bold">
                        {item.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">per kg</span>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right">
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold text-sm shadow-md">
                        {index + 1}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCartItemHandler(item);
                      }}
                      className="flex items-center gap-1 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Charge</span>
                  <span className="font-semibold">₹{deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-gray-800 dark:text-gray-100 text-xl font-bold">
                    <span>Total</span>
                    <span className="text-green-600 dark:text-green-400">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>


              <button
                onClick={() => navigate('/marketplace')}
                className="w-full mt-3 px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg font-medium transition-colors"
              >
                Continue Shopping
              </button>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Package className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p>Free delivery on orders above ₹500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;