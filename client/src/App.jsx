import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Register from "./pages/Register";

const App = () => {
  return (
    <div>
      <Header />
      <main>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
