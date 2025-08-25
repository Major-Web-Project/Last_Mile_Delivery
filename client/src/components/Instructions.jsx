import { useState } from "react";

function Instructions({ steps, duration }) {
  const [show, setShow] = useState(true);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setShow(!show)}
        className="absolute top-4 right-4 z-20 bg-black text-white px-4 py-2 rounded shadow-md hover:bg-gray-800 transition"
      >
        {show ? "Hide Instructions" : "Show Instructions"}
      </button>

      {/* Instructions Overlay */}
      {show && (
        <div
          id="instructions"
          className="absolute top-20 left-4 w-80 h-64 overflow-y-auto z-10 backdrop-blur-sm bg-white/80 p-4 rounded shadow-lg"
        >
          <p id="prompt">🗺 Route from Start → Waypoints (fixed order)</p>
          {steps.length > 0 && (
            <>
              <p>
                <strong>Trip Duration: {Math.floor(duration / 60)} min 🚗</strong>
              </p>
              <ol className="list-decimal pl-4">
                {steps.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Instructions;
