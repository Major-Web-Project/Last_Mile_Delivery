import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapboxMap.css";

const INITIAL_CENTER = [73.18431705853321, 22.28310051174754]; // Start Point
const INITIAL_ZOOM = 13;
const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_API;

function DefaultView() {
  const [clusters, setClusters] = useState([]);
  const [fixedWaypoints, setFixedWaypoints] = useState([]);
  const [steps, setSteps] = useState([]);
  const [duration, setDuration] = useState(0);
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const directionMarkerRef = useRef(null);

  // Fetch clusters from backend API on mount
  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/clusters/predict-from-orders`
        );
        const data = await res.json();
        setClusters(data);
        if (Array.isArray(data) && data.length > 0) {
          setFixedWaypoints(data[0]);
        } else {
          setFixedWaypoints([]);
        }
      } catch (err) {
        console.error("Failed to fetch clusters", err);
        setFixedWaypoints([]);
      }
    };
    fetchClusters();
  }, []);

  useEffect(() => {
    if (!fixedWaypoints || fixedWaypoints.length === 0) return;

    mapboxgl.accessToken = ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });

    mapRef.current = map;

    map.on("load", async () => {
      const allCoords = [INITIAL_CENTER, ...fixedWaypoints];

      const directionEl = document.createElement("div");
      directionEl.className = "direction-marker";

      const directionMarker = new mapboxgl.Marker({
        element: directionEl,
        rotationAlignment: "map",
      })
        .setLngLat(INITIAL_CENTER)
        .addTo(map);
      directionMarkerRef.current = directionMarker;

      fixedWaypoints.forEach((coord) => {
        if (coord[0] !== INITIAL_CENTER[0] || coord[1] !== INITIAL_CENTER[1]) {
          new mapboxgl.Marker({ color: "red" }).setLngLat(coord).addTo(map);
        }
      });

      const routeStr = allCoords.map((c) => c.join(",")).join(";");

      const directionsRes = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${routeStr}?geometries=geojson&steps=true&access_token=${ACCESS_TOKEN}`
      );
      const directionsData = await directionsRes.json();

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
    });

    return () => map.remove();
  }, [fixedWaypoints]);

  return (
    <div className="relative w-full h-svh">
      <div
        ref={mapContainerRef}
        className="h-full w-full rounded-lg shadow-md border border-slate-200"
      />
      <div className="absolute top-4 left-4 w-[320px] max-h-[100%] overflow-y-auto bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4 text-sm text-slate-800">
        <p className="font-semibold text-base mb-30">
          🗺 Route from Start → Waypoints (fixed order)
        </p>
        {steps.length > 0 && (
          <>
            <p className="mb-2 text-blue-600 font-medium">
              Trip duration: {Math.floor(duration / 60)} min 🚗
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-700">
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

export default DefaultView;
