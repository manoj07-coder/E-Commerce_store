import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./features/cart/CartPage";
import PrivateRoute from "./components/PrivateRoute";
import Category from "./pages/Category";
import Order from "./pages/Order";
import OrderDetailPage from "./pages/OrderDetailPage";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PageWrapper from "./components/PageWrapper";

const App = () => {
  const location = useLocation();
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/register"
            element={
              <PageWrapper>
                <Register />
              </PageWrapper>
            }
          />
          <Route
            path="/login"
            element={
              <PageWrapper>
                <Login />
              </PageWrapper>
            }
          />
          <Route
            path="/"
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            }
          />
          <Route
            path="/products/:id"
            element={
              <PageWrapper>
                <ProductDetail />
              </PageWrapper>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <CartPage />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/category"
            element={
              <PageWrapper>
                <Category />
              </PageWrapper>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <Order />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <OrderDetailPage />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/seller"
            element={
              <PrivateRoute allowedRoles={["seller"]} redirect="/">
                <PageWrapper>
                  <SellerDashboard />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]} redirect="/">
                <PageWrapper>
                  <AdminDashboard />
                </PageWrapper>
              </PrivateRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
};

export default App;
