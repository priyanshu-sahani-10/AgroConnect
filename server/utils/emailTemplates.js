export const buyerOrderEmail = (order) => `
  <h2>Order Confirmed ✅</h2>
  <p>Your order has been placed successfully.</p>
  <hr />
  <p><b>Crop:</b> ${order.crop.name}</p>
  <p><b>Quantity:</b> ${order.quantity} kg</p>
  <p><b>Total Paid:</b> ₹${order.totalAmount}</p>
  <p><b>Order ID:</b> ${order._id}</p>
`;

export const farmerOrderEmail = (order) => `
  <h2>New Order Received 🌾</h2>
  <p>You have received a new order.</p>
  <hr />
  <p><b>Buyer:</b> ${order.buyer.name}</p>
  <p><b>Crop:</b> ${order.crop.name}</p>
  <p><b>Quantity:</b> ${order.quantity} kg</p>
  <p><b>Total Amount:</b> ₹${order.totalAmount}</p>
`;
