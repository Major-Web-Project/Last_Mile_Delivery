import React, { useState } from "react";

const ClusterViewer = ({ clusters }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!clusters || !clusters.length) {
    return <p className="text-gray-500">No clusters available</p>;
  }

  const handlePrevious = () => {
    if (currentIdx > 0) setCurrentIdx((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIdx < clusters.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
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

        <div>{`Cluster ${currentIdx + 1} / ${clusters.length}`}</div>

        {/* Show Next only if not last cluster */}
        {currentIdx < clusters.length - 1 ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <div /> // empty div keeps spacing
        )}
      </div>

      {/* Cluster Addresses */}
      <ul className="space-y-2">
        {Array.isArray(currentCluster) && currentCluster.length > 0 ? (
          currentCluster.map((address, idx) => (
            <li
              key={idx}
              className="bg-gray-100 p-3 rounded-md shadow-sm hover:bg-gray-200"
            >
              {address}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No addresses in this cluster.</li>
        )}
      </ul>
    </div>
  );
};

export default ClusterViewer;
