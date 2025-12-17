import mongoose from "mongoose";

// order.model.js
const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
    pricePerKg: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    // ✅ NEW FIELDS
    deliveryAddress: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    orderStatus: {
      type: String,
      enum: ["CREATED", "CONFIRMED", "SHIPPED", "DELIVERED"],
      default: "CREATED",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;

/*



Logic of RazorPay paayment is here. It explain what will happen when buyer click on Buy now buttom;


🧩 STEP-BY-STEP EXPLANATION (WHAT + WHY)
🟢 STEP 1: Buyer clicks “Buy Now”
What happens?

Buyer wants to purchase specific crop + quantity.

Why we don’t directly pay?

Because:

price can be manipulated on frontend

payment needs a reference

we need an order even if payment fails

So first → create an order

🟢 STEP 2: Create Order in DB (Your createOrder)
What this does

Creates an internal order record:

{
  buyer,
  farmer,
  crop,
  quantity,
  totalAmount,
  paymentStatus: "PENDING",
  orderStatus: "CREATED"
}

Why this is important

DB is your single source of truth

You now have:

who is buying

what is bought

how much to charge

💡 Even Amazon creates order before payment.

🟢 STEP 3: Create Razorpay Order (Payment Intent)
Important concept

Razorpay order ≠ your DB order

Your Order	Razorpay Order
Business logic	Payment intent
Stored in MongoDB	Stored in Razorpay
Controls inventory	Controls payment
Has buyer/farmer	Has amount/currency
What your createRazorpayOrder does

Takes DB order ID

Fetches order from MongoDB

Reads totalAmount

Creates Razorpay order:

amount: totalAmount * 100


Saves razorpayOrderId inside DB order

Why?

So later you can say:

“This payment belongs to THIS order”

🟢 STEP 4: Frontend Opens Razorpay Checkout (You haven’t done yet)

Frontend:

gets Razorpay order ID

opens Razorpay UI

User can:

Pay successfully ✅

Fail ❌

Close popup ❌

⚠️ Backend is still untouched here.

🟢 STEP 5: Payment Happens (Externally)

Razorpay:

processes UPI / Card / NetBanking

returns:

razorpay_payment_id

razorpay_order_id

razorpay_signature

🚨 Frontend CANNOT be trusted
Anyone can fake these values.

So…

🟢 STEP 6: Backend Verifies Payment (MOST IMPORTANT)

Backend:

Receives payment details

Re-creates signature using:

order_id + "|" + payment_id


Compares with Razorpay signature using SECRET KEY

If signature matches:

✅ Payment is real
❌ Else → reject

This is mandatory.

🟢 STEP 7: Confirm Order & Update Inventory

Only AFTER verification:

paymentStatus = PAID

orderStatus = CONFIRMED

crop.available -= quantity

farmer.totalEarning += totalAmount

buyer.totalSpent += totalAmount

buyer.totalOrder += 1

This ensures:

no fake orders

no fake payments

no inventory mismatch

🧠 WHY THIS DESIGN IS IMPORTANT (INTERVIEW GOLD)
❓ Why not direct payment?

Because:

Payment may fail

User may close window

Network issues

Fraud prevention

❓ Why two orders?

Because:

DB order = business logic

Razorpay order = payment intent

❓ Why verify on backend?

Because:

Frontend is untrusted

Anyone can modify JS

🔐 SECURITY GUARANTEES
Problem	Solved by
Fake payment	Signature verification
Double payment	paymentStatus === PAID check
Inventory abuse	Update only after verification
Price manipulation	Amount from DB


 
*/
