import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createMyProduct,
  deleteMyProduct,
  fetchMyProducts,
  updateMyProduct,
} from "../features/products/myProductSlice.js";
import AnimatedButton from "../components/AnimatedButton.jsx";

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((store) => store.myProduct);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    images: [""],
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchMyProducts());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateMyProduct({ id: editingId, data: form }));
      setEditingId(null);
      setForm({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        images: [""],
      });
    } else {
      dispatch(createMyProduct(form));
      setForm({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        images: [""],
      });
    }
  };

  const start = (item) => {
    setForm({ ...item, category: item.category._id });
    setEditingId(item._id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My products</h1>

      {/* form */}
      <form onSubmit={handleSubmit} className="space-y-2 mb-6 max-w-2xl p-4">
        <input
          value={form.name}
          placeholder="Name"
          className="border w-full px-2 py-1"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          value={form.price}
          placeholder="Price"
          className="border w-full px-2 py-1"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          value={form.stock}
          placeholder="Stock"
          className="border w-full px-2 py-1"
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <input
          value={form.category}
          placeholder="Category"
          className="border w-full px-2 py-1"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          value={form.images[0]}
          placeholder="Image Url"
          className="w-full border px-2 py-1 "
          onChange={(e) => setForm({ ...form, images: [e.target.value] })}
        />
        <AnimatedButton type="submit">
          {editingId ? "Update Product" : "Create Product"}
        </AnimatedButton>
      </form>

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
              <button className="text-blue-500" onClick={() => start(item)}>
                Edit
              </button>
              <button
                className="text-red-500"
                onClick={() => dispatch(deleteMyProduct(item._id))}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;
