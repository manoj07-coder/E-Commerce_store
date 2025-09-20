import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../features/products/productSlice.js";
import Loader from "../components/Loader";
import AnimatedButton from "../components/AnimatedButton";
import { addToCart } from "../features/cart/cartSlice.js";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((store) => store.product.current);
  const status = useSelector((store) => store.product.status);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);
  const handleAdd = async () => {
    await dispatch(addToCart({ productId: id, qty }));
  };

  if (status === "loading" || !product)
    return (
      <div className="py-16">
        <Loader />
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded shadow p-4 flex items-center justify-center">
        <img
          src={product.images[0]}
          alt={product.name}
          className="max-h-96 object-contain"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="text-3xl font-extrabold mt-4">₹ {product.price}</div>
        <div className="mt-4 text-gray-600">{product.description}</div>
        <div className="mt-4 flex items-center gap-4">
          <label className="text-sm">Qty</label>
          <select
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {Array.from(
              { length: Math.min(10, product.stock || 5) },
              (_, i) => i + 1
            ).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <AnimatedButton onClick={handleAdd}>Add to cart</AnimatedButton>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold">Product details</h3>
          <ul className="list-disc ml-5 mt-2 text-gray-700">
            <li>Category: {product.category?.name || "-"}</li>
            <li>Brand: {product.brand || "-"}</li>
            <li>In stock: {product.stock ?? "-"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
