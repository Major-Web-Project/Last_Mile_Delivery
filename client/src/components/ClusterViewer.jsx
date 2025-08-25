import React, { useState } from "react";

const clusters = [
  {
    id: 1,
    name: "Cluster 1",
    addresses: [
      "12 MG Road, Bengaluru, KA",
      "88 Whitefield, Bengaluru, KA",
      "56 Koramangala, Bengaluru, KA",
      "200 Indiranagar, Bengaluru, KA",
      "12 MG Road, Bengaluru, KA",
      "88 Whitefield, Bengaluru, KA",
      "56 Koramangala, Bengaluru, KA",
      "200 Indiranagar, Bengaluru, KA",
      "12 MG Road, Bengaluru, KA",
      "88 Whitefield, Bengaluru, KA",
      "56 Koramangala, Bengaluru, KA",
      "200 Indiranagar, Bengaluru, KA",
    ],
  },
  {
    id: 2,
    name: "Cluster 2",
    addresses: [
      "123 Main Street, New York, NY",
      "45 Park Avenue, New York, NY",
      "78 Broadway, New York, NY",
      "222 Wall Street, New York, NY",
      "15 Hudson Yards, New York, NY",
    ],
  },
  {
    id: 3,
    name: "Cluster 3",
    addresses: [
      "10 Marine Drive, Mumbai, MH",
      "250 Bandra West, Mumbai, MH",
      "400 Andheri East, Mumbai, MH",
    ],
  },
];

const ClusterViewer = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const handlePrevious = () => {
    if (currentIdx > 0) setCurrentIdx((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIdx < clusters.length - 1) setCurrentIdx((prev) => prev + 1);
  };

  const currentCluster = clusters[currentIdx];

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Prev/Next */}
      <div className="bg-black rounded-lg shadow-md h-12 flex items-center justify-between px-4 text-white font-semibold">
        {/* Show Prev only if not first cluster */}
        {currentIdx > 0 ? (
          <button onClick={handlePrevious}>Previous</button>
        ) : (
          <div /> // empty div keeps spacing
        )}

        <div>{currentCluster.name}</div>

        {/* Show Next only if not last cluster */}
        {currentIdx < clusters.length - 1 ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <div /> // empty div keeps spacing
        )}
      </div>

      {/* Cluster Addresses */}
      <ul className="space-y-2">
        {currentCluster.addresses.map((address, idx) => (
          <li
            key={idx}
            className="bg-gray-100 p-3 rounded-md shadow-sm hover:bg-gray-200"
          >
            {address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClusterViewer;