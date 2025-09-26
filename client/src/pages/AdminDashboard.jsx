import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import api from "../api/axios.js";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState(null);
  const [popular, setPopular] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, popularRes] = await Promise.all([
          api.get("/admin/sales"),
          api.get("/admin/popular"),
        ]);
        setSales(salesRes.data.data);
        setPopular(popularRes.data.data);
      } catch (error) {
        console.error("Admin dashboard error", error);
        setError("Failed to load dashboard. Please log in again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <div className="text-3xl font-bold">{sales?.orders || 0}</div>
        </div>
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold">Revenue</h2>
          <div className="text-3xl font-bold">{sales?.totalRevenue || 0}</div>
        </div>
      </div>

      {/* popular Products */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Top products</h2>
        {popular.length === 0 ? (
          <div>No data available</div>
        ) : (
          <ul className="divide-y">
            {popular.map((item, idx) => (
              <li key={idx} className="flex justify-between py-2">
                <div>
                  {idx + 1}. {item.product.name}
                </div>
                <div className="text-sm text-gray-500">
                  Sold: {item.sold} × {item.product.price}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
