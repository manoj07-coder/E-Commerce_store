import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* fixed header */}
      <Header />

      {/* Page content */}
      <main className="flex-1 container mx-auto mt-[72px] px-4 py-6">
        {children}
      </main>

      {/* footer */}
      <Footer />
    </div>
  );
};

export default Layout;
