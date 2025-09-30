import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ApiTest() {
  const [bikes, setBikes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/bikes")
      .then((res) => setBikes(res.data))
      .catch((err) => {
        setError("Failed to fetch bikes. Please try again.");
        console.error(err);
      });
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">Bikes from API</h2>
      {error && <div className="bg-red-600 p-2 rounded">{error}</div>}
      <ul className="space-y-2">
        {bikes.map(bike => (
          <li key={bike.id} className="bg-gray-800 p-3 rounded">
            {bike.name} - ₹{bike.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
