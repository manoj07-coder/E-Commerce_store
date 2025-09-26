import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { HiShoppingCart } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice.js";

const Header = () => {
  const cartItems = useSelector((store) => store.cart.items) || [];

  const auth = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  const totalQty =
    (cartItems && cartItems.reduce((s, i) => s + (i.qty || 0), 0)) || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  return (
    <header className="bg-gradient-to-r from-yellow-400 to-black text-white shadow-md">
      <div className="container mx-auto px-4  py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/assets/ByteCart.png"
            alt="ByteCart"
            className="h-10 w-auto object-contain"
          />
          <span className="font-extrabold text-lg hidden sm:inline">
            ByteCart
          </span>
        </Link>
        <div className="flex-1 flex items-center justify-center gap-6">
          <nav className="hidden md:flex items-center gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-yellow-200 transition ${
                  isActive ? "font-bold underline" : ""
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="category"
              className={({ isActive }) =>
                `hover:text-yellow-200 transition ${
                  isActive ? "font-bold underline" : ""
                }`
              }
            >
              Categories
            </NavLink>
            {auth.user?.role === "seller" && (
              <NavLink
                to="/seller"
                className={({ isActive }) =>
                  `hover:text-yellow-200 transition ${
                    isActive ? "font-bold underline" : ""
                  }`
                }
              >
                Dashboard
              </NavLink>
            )}
            {auth.user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `hover:text-yellow-200 transition ${
                    isActive ? "font-bold underline" : ""
                  }`
                }
              >
                Dashboard
              </NavLink>
            )}

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `hover:text-yellow-200 transition ${
                  isActive ? "font-bold underline" : ""
                }`
              }
            >
              My orders
            </NavLink>
          </nav>
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex items-center bg-white rounded-full overflow-hidden w-64"
          >
            <input
              type="text"
              value={search}
              placeholder="Search products..."
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-1 text-black w-full outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-500 px-4 py-1 text-black font-semibold hover:bg-yellow-600 transition"
            >
              Go
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative inline-flex items-center gap-2">
            <HiShoppingCart className="text-2xl" />
            {totalQty > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white  text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalQty}
              </span>
            )}
          </Link>
          {auth.accessToken ? (
            <div className="flex items-center gap-2">
              <div className="text-sm">Welcome</div>
              <button
                onClick={() => dispatch(logout())}
                className="text-sm text-red-300 hover:text-red-500 transition"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="text-sm hover:text-yellow-200">
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-yellow-500 px-3 py-1 rounded-full text-black hover:bg-yellow-600 transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
