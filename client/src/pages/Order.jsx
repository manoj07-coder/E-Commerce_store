import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

const Order = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders").then((res) => setOrders(res.data.data || []));
  }, []);

  console.log(orders);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <div>No Orders yet</div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded shadow p-4 border">
              <div className="flex justify-between">
                <div className="font-semibold">Order #{order._id}</div>
                <div className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-2">
                Status:{" "}
                <span className="font-medium capitalize">{order.status}</span>
              </div>
              <div className="mt-2">
                {order.items.map((i, idx) => (
                  <div key={idx} className="text-sm">
                    {i.qty} × {i.product?.name || "Product"} - ₹
                    {i.price * i.qty}
                  </div>
                ))}
              </div>
              <div className="mt-2 font-bold">Total: ₹{order.total}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
