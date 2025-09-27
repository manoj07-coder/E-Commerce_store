import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiStar } from "react-icons/hi";
import { FaRupeeSign } from "react-icons/fa";

const ProductCard = ({ product }) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="bg-white rounded-2xl  shadow-md hover:shadow-xl overflow-hidden "
    >
      <Link to={`/products/${product._id}`}>
        {/* image */}
        <div className="h-48  bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="max-h-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
        {/* Info */}
        <div>
          <div className="block font-semibold text-lg text-gray-800 truncate">
            {product.name}
          </div>
          {/* Price */}
          <div className="flex items-center gap-1 mt-2 text-xl font-bold text-gray-900">
            <FaRupeeSign />
            {product.price}
          </div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
            <HiStar className="text-yellow-500" />
            {product.ratingsAverage?.toFixed(1) || "0.0"}
            <span>({product.ratingCount || 0})</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
