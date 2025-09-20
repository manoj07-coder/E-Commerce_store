import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedButton from "../../components/AnimatedButton";

const ProductCard = ({ product }) => {
  return (
    <motion.div>
      <Link to={`/products/${product._id}`}>
        <div className="h-44 bg-gray-100 flex items-center justify-center">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="max-h-full"
          />
        </div>
        <div>
          <div className="block font-semibold truncate">{product.name}</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-lg font-bold">₹ {product.price}</div>
            <AnimatedButton>Add</AnimatedButton>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {product.ratingCount} reviews • {product.ratingsAverage} ⭑
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
