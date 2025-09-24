import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProducts } from "../features/products/myProductSlice.js";

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((store) => store.myProduct);

  useEffect(() => {
    dispatch(fetchMyProducts());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My products</h1>

      {/* form */}
      <form></form>

      {/* list items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            className="border rounded p-3 flex items-center justify-between"
            key={item._id}
          >
            <div>
              <div className="font-semibold ">{item.name}</div>
              <div className="text-sm text-gray-500">{item.price}</div>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-500">Edit</button>
              <button className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;
