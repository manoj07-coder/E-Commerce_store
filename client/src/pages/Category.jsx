import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import ProductCard from "../features/products/ProductCard.jsx";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/category").then((res) => setCategories(res.data.data || []));
  }, []);

  const handleSelect = async (cat) => {
    setSelected(cat);
    const res = await api.get("/products", { params: { category: cat._id } });
    setProducts(res.data.data.items || []);
  };

  console.log(products);

  return (
    <div>
      {/* sidebar */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-3">Categories</h2>
        <ul className="space-y-2 ">
          {categories.map((cat) => (
            <li key={cat._id}>
              <button
                onClick={() => handleSelect(cat)}
                className={`text-left w-full ${
                  selected?._id === cat._id ? "font-bold text-accent" : ""
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* products list */}
      <div className="md:col-span-3">
        {selected ? (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {selected.name} Products
            </h2>
            {products.length === 0 ? (
              <div>No products in this category</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div>Select a category to view products</div>
        )}
      </div>
    </div>
  );
};

export default Category;
