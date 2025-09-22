import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkOut, fetchCart, removeCart, updateCart } from "./cartSlice.js";
import AnimatedButton from "../../components/AnimatedButton.jsx";

const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cart.items || []);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const total = cart.reduce((acc, i) => acc + i.product.price * i.qty, 0);

  const handleCheckout = async () => {
    const result = await dispatch(checkOut());
    console.log(result.payload);

    if (result?.payload?.checkoutUrl) {
      window.location.href = result.payload.checkoutUrl;
    }
  };

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
              {/* <img
                src={item.product.images[0] || "/placeholder.png"}
                alt={item.product.name}
                className="w-20 h-20 object-cover"
              /> */}
              <div className="flex-1">
                <div className="font-medium">{item.product.name}</div>
                <div className="text-sm text-gray-500">{item.qty}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 rounded border"
                  onClick={() => {
                    const productId =
                      typeof item.product === "string"
                        ? item.product
                        : item.product._id;
                    dispatch(
                      updateCart({
                        productId,
                        qty: item.qty - 1,
                      })
                    );
                  }}
                >
                  -
                </button>
                <span>{item.qty}</span>
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() =>
                    dispatch(
                      updateCart({
                        productId: item.product._id,
                        qty: item.qty + 1,
                      })
                    )
                  }
                >
                  +
                </button>
              </div>
              <div className="text-lg font-bold">₹ {item.price * item.qty}</div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
            <div className="text-xl  font-bold">Total: {total}</div>
            <div className="flex gap-3">
              <AnimatedButton onClick={() => dispatch(removeCart())}>
                Clear cart
              </AnimatedButton>
              <AnimatedButton onClick={handleCheckout}>
                Proceed to Checkout
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
