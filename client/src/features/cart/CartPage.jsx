import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "./cartSlice.js";
import AnimatedButton from "../../components/AnimatedButton.jsx";

const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cart.items || []);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="p-6 text-center">Cart is Empty</div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center gap-4  bg-white p-4 rounded shadow"
            >
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-20 h-20 object-cover"
              />
              <div className="flex-1">
                <div className="font-medium">{item.product.name}</div>
                <div className="text-sm text-gray-500">{item.qty}</div>
              </div>
              <div className="text-lg font-bold">₹ {item.price * item.qty}</div>
            </div>
          ))}
          <div className="text-right">
            <AnimatedButton>Proceed to Checkout</AnimatedButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
