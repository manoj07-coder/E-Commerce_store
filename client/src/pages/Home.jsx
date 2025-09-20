import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import ProductCard from "../features/products/ProductCard";

const Home = () => {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.items);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 12 }));
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Featured products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
