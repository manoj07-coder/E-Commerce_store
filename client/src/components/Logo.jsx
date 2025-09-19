import React from "react";
import { motion } from "framer-motion";

const Logo = ({ className = "h-8 w-auto" }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, rotate: -6 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`flex items-center gap-2 ${className}`}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        stroke="#06b6d4" // primary color
        className="w-8 h-8"
        animate={{ x: [0, 10, 0] }} // moves left → right → reset
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Cart body */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 2.25h1.5l1.5 9h13.5l2-7H6"
        />
        {/* Wheels */}
        <circle cx="9" cy="20" r="1.5" fill="#111827" />
        <circle cx="17" cy="20" r="1.5" fill="#111827" />
        {/* Handle with accent color */}
        <path
          d="M19 5 L21 2"
          stroke="#7c3aed"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </motion.svg>
      <div className="text-lg font-semibold leading-none select-none font-bungee">
        <div className="text-slate-800 ">
          Byte<span className="text-accent">Cart</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Logo;
