import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="py-16">
        <Loader />
      </div>
    );

  if (!order) return <div className="p-4">No order found</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded p-6">
      <h1 className="text-2xl font-bold mb-4">Order #{order._id}</h1>
      <div className="mb-4">
        <div>
          <span className="font-semibold">Status: </span>
          <span className="capitalize">{order.status}</span>
        </div>
        <div>
          <span className="font-semibold">Placed on: </span>
          {new Date(order.createdAt).toLocaleString()}
        </div>
        <div>
          <span className="font-semibold">Total: </span>₹{order.total}
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-2">Items</h2>
      <ul className="space-y-2">
        {order.items.map((item, idx) => (
          <li key={idx} className="flex justify-between  border-b  pb-2">
            <div>
              {item.qty} × {item.product?.name || "Product"}
              <div className="text-sm text-gray-500">Price: ₹{item.price}</div>
            </div>
            <div className="font-semibold">₹{item.qty * item.price}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetailPage;
