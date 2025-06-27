import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapboxMap.css";

const INITIAL_CENTER = [73.18431705853321, 22.28310051174754]; // Start Point
const INITIAL_ZOOM = 13;
const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_API || "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

const FIXED_WAYPOINTS = [
  [73.18972402003459, 22.296157910242005],
  [73.17327747810634, 22.282763254858214],
  [73.18237942545036, 22.28267356454345],
  [73.18357374385924, 22.28964144025678],
  [73.17817160144324, 22.284772377051816],
  [73.18431705853321, 22.28310051174754],
];

function MapboxMap() {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [steps, setSteps] = useState([]);
  const [duration, setDuration] = useState(0);
  const directionMarkerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });

    mapRef.current = map;

    map.on("load", async () => {
      const allCoords = [INITIAL_CENTER, ...FIXED_WAYPOINTS];

      const directionEl = document.createElement("div");
      directionEl.className = "direction-marker";

      const directionMarker = new mapboxgl.Marker({
        element: directionEl,
        rotationAlignment: "map",
      })
        .setLngLat(INITIAL_CENTER)
        .addTo(map);
      directionMarkerRef.current = directionMarker;

      FIXED_WAYPOINTS.forEach((coord) => {
        if (coord[0] !== INITIAL_CENTER[0] || coord[1] !== INITIAL_CENTER[1]) {
          new mapboxgl.Marker({ color: "red" }).setLngLat(coord).addTo(map);
        }
      });

      // For demo purposes, we'll create a simple route without the matrix API
      // In production, you would implement the TSP algorithm with your backend
      const orderedCoords = allCoords;
      const routeStr = orderedCoords.map((c) => c.join(",")).join(";");

      try {
        const directionsRes = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${routeStr}?geometries=geojson&steps=true&access_token=${ACCESS_TOKEN}`
        );
        const directionsData = await directionsRes.json();

        if (directionsData.routes && directionsData.routes[0]) {
          const routeGeoJSON = {
            type: "Feature",
            properties: {},
            geometry: directionsData.routes[0].geometry,
          };

          map.addSource("route", {
            type: "geojson",
            data: routeGeoJSON,
          });

          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#3887be",
              "line-width": 5,
              "line-opacity": 0.75,
            },
          });

          // Set trip steps and duration
          setSteps(
            directionsData.routes[0].legs.flatMap((leg) =>
              leg.steps.map((s) => s.maneuver.instruction)
            )
          );
          setDuration(directionsData.routes[0].duration);
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    });

    return () => map.remove();
  }, []);

  return (
    <div className="mapbox-container">
      <div id="map-container" ref={mapContainerRef} />
      <div id="instructions">
        <p id="prompt">🗺️ Route from Start → Waypoints (optimized order)</p>
        {steps.length > 0 && (
          <>
            <p>
              <strong>Trip duration: {Math.floor(duration / 60)} min 🚗</strong>
            </p>
            <ol>
              {steps.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}

export default MapboxMap;