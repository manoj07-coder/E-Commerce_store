import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiShoppingCart, HiSearch, HiUser } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice.js";

const Header = () => {
  const cartItems = useSelector((store) => store.cart.items) || [];

  const auth = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);

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
    <header className="bg-gradient-to-r from-yellow-300 to-yellow-600 text-black fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="container mx-auto px-4  py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/assets/ByteCart.png"
            alt="ByteCart"
            className="h-10 w-auto object-contain"
          />
          <span className="font-extrabold text-lg hidden sm:inline text-white">
            ByteCart
          </span>
        </Link>

        {/* search */}
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex items-center bg-white rounded-full overflow-hidden w-72 border transition focus-within:ring-2 focus-within:ring-yellow-400"
        >
          <HiSearch className="ml-3 text-gray-500" />
          <input
            type="text"
            value={search}
            placeholder="Search products..."
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 text-black w-full outline-none"
          />
          <button
            type="submit"
            className="bg-yellow-500 px-4 py-2 text-black font-semibold hover:bg-yellow-600 transition"
          >
            Search
          </button>
        </form>

        {/* right section */}
        <div className="flex items-center gap-6 relative">
          {auth.accessToken ? (
            <div
              className="flex item-center gap-1 cursor-pointer relative"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              <HiUser className="text-2xl text-white" />
              <span className="hidden sm:inline text-white font-medium">
                {auth.user?.name || "User"}
              </span>
              {showMenu && (
                <div className="absolute  top-full mt-1 bg-white text-black rounded-md shadow-lg w-48 p-2">
                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-gray-100 rounded"
                  >
                    My Orders
                  </Link>
                  {(auth.user?.role === "seller" ||
                    auth.user?.role === "admin") && (
                    <Link
                      to={auth.user?.role === "admin" ? "/admin" : "/seller"}
                      className="block px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                    onClick={() => navigate("/become-seller")}
                  >
                    Become a Seller
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 rounded"
                    onClick={() => dispatch(logout())}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              className="flex items-center gap-1 cursor-pointer relative"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              <HiUser className="text-2xl text-black" />
              <Link
                to="/login"
                className="hidden sm:inline text-white font-medium"
              >
                Login
              </Link>
              {showMenu && (
                <div className="absolute  top-full mt-1 bg-white text-black rounded-md shadow-lg w-48 p-2">
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    New user?
                  </div>
                  <Link
                    to="/register"
                    className="block px-4 py-2 hover:bg-gray-100 rounded"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* cart */}
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-1 text-white font-medium"
          >
            <HiShoppingCart className="text-2xl" />
            <span className="hidden sm:inline">Cart</span>
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalQty}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
