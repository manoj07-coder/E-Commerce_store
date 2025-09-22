import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../features/products/productSlice.js";
import Loader from "../components/Loader";
import AnimatedButton from "../components/AnimatedButton";
import { addToCart } from "../features/cart/cartSlice.js";
import {
  addReview,
  deleteReview,
  fetchReviews,
  updateReview,
} from "../features/reviews/reviewSlice.js";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((store) => store.product.current);
  const status = useSelector((store) => store.product.status);
  const reviews = useSelector((store) => store.review.items);
  const auth = useSelector((store) => store.auth);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingRating, setEditingRating] = useState(5);
  const [editingComment, setEditingComment] = useState("");

  const userReview = reviews.find(
    (review) => review.user?._id === auth.user?.id
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchReviews(id));
    }
  }, [dispatch, id]);
  const handleAdd = async () => {
    await dispatch(addToCart({ productId: id, qty }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addReview({ product: id, rating, comment }));
    setComment("");
  };

  const startEditing = (review) => {
    setEditingId(review._id);
    setEditingRating(review.rating);
    setEditingComment(review.comment);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await dispatch(
      updateReview({
        id: editingId,
        rating: editingRating,
        comment: editingComment,
        product: id,
      })
    );
    setEditingId(null);
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
        {/* reviews */}
        <div className="mt-10">
          <h3 className="font-semibold mb-2">Reviews</h3>
          {reviews.length === 0 && <div>No reviews Yet</div>}
        </div>
        <ul className="space-y-2">
          {reviews.map((review) => (
            <li className="border p-2 rounded">
              {editingId === review._id ? (
                <form onSubmit={handleUpdate}>
                  <label className="block">
                    Rating{" "}
                    <select
                      value={editingRating}
                      onChange={(e) => setEditingRating(Number(e.target.value))}
                      className="border ml-2"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                  <textarea
                    value={editingComment}
                    onChange={(e) => setEditingComment(e.target.value)}
                    placeholder="Write your review..."
                    className="w-full border rounded px-2 py-1"
                  />
                  <div className="flex gap-2">
                    <AnimatedButton type="submit">Save</AnimatedButton>
                    <button
                      type="button"
                      className="text-sm text-gray-500"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="font-medium">
                    {review.user?.name || "User"}
                  </div>
                  <div className="text-yellow-500">⭐ {review.rating}</div>
                  <div className="text-sm text-gray-600">{review.comment}</div>
                  {auth.user?.id === review.user?._id && (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="text-sm text-blue-500"
                        onClick={() => startEditing(review)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-sm text-red-500"
                        onClick={() =>
                          dispatch(
                            deleteReview({ id: review._id, product: id })
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
        {auth.accessToken && !userReview && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-2">
            <label className="block">
              Rating{" "}
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border ml-2"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full border rounded px-2 py-1"
            />
            <AnimatedButton>Submit Review</AnimatedButton>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
