import React from "react";
import { motion } from "framer-motion";

const AnimatedButton = ({ children, onClick, className = "" }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className={`px-4 py-2 rounded-lg bg-primary text-white font-medium shadow-md ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
