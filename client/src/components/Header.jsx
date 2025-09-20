import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import { HiShoppingCart } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice.js";

const Header = () => {
  const totalQty = 4;

  const auth = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4  py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-accent font-semibold" : " "
            }
          >
            Home
          </NavLink>
          <NavLink
            to="category"
            className={({ isActive }) =>
              isActive ? "text-accent font-semibold" : " "
            }
          >
            Categories
          </NavLink>
          <NavLink
            to="/seller"
            className={({ isActive }) =>
              isActive ? "text-accent font-semibold" : " "
            }
          >
            Sell
          </NavLink>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative inline-flex items-center gap-2">
            <HiShoppingCart className="text-2xl" />
            {totalQty > 0 && (
              <span className="absolute -top-1 -right-2 bg-accent text-white  text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalQty}
              </span>
            )}
          </Link>
          {auth.accessToken ? (
            <div className="flex items-center gap-2">
              <div className="text-sm">Welcome</div>
              <button
                onClick={() => dispatch(logout())}
                className="text-sm text-red-500"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="text-sm">
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-primary"
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
