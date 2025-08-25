import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapboxMap.css";
import orderStore from "@/store/addressStore";
import Instructions from "./Instructions";

const INITIAL_CENTER = [73.18431705853321, 22.28310051174754]; // Start Point
const INITIAL_ZOOM = 13;
const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_API;

function MapboxMap({ clusters, idx }) {
  const [fixedWaypoints, setFixedWaypoints] = useState([[]]);
  let n = clusters.length;

  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [steps, setSteps] = useState([]);
  const [duration, setDuration] = useState(0);
  const directionMarkerRef = useRef(null);
  const { orders } = orderStore();

  useEffect(() => {
    if (!clusters[idx] || clusters[idx].length === 0) {
      setFixedWaypoints([]);
      return;
    }
    setFixedWaypoints(clusters[idx]);
  }, [clusters, idx]);

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
          const marker = new mapboxgl.Marker({ color: "red" })
            .setLngLat(coord)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<strong>Coordinates:</strong><br/>${coord[1]}, ${coord[0]}`
              )
            )
            .addTo(map);
        }
      });

      const coordStr = allCoords.map((c) => c.join(",")).join(";");
      console.log("Requesting matrix for coordinates:", coordStr);

      const matrixRes = await fetch(
        `http://localhost:5000/api/matrix?coords=${coordStr}`
      );

      const matrixData = await matrixRes.json();
      console.log("Matrix API response:", matrixData);

      if (!matrixData || !matrixData.durations) {
        console.error("Matrix API failed:", matrixData);
        return;
      }

      const dist = matrixData.durations;

      const n = dist.length;
      const VISITED_ALL = (1 << n) - 1;

      const dp = Array.from({ length: 1 << n }, () => Array(n).fill(-1));
      const parent = Array.from({ length: 1 << n }, () => Array(n).fill(-1));

      function tsp(mask, pos) {
        if (mask === VISITED_ALL) return dist[pos][0];

        if (dp[mask][pos] !== -1) return dp[mask][pos];

        let ans = Infinity;

        for (let city = 0; city < n; city++) {
          if ((mask & (1 << city)) === 0) {
            const newCost = dist[pos][city] + tsp(mask | (1 << city), city);
            if (newCost < ans) {
              ans = newCost;
              parent[mask][pos] = city; // track the next city
            }
          }
        }

        dp[mask][pos] = ans;
        return ans;
      }

      function getOptimalPath() {
        const path = [0]; // always start at city 0
        let mask = 1; // city 0 visited
        let pos = 0;

        while (true) {
          const next = parent[mask][pos];
          if (next === -1) break;
          path.push(next);
          mask |= 1 << next;
          pos = next;
        }

        return path;
      }

      tsp(1, 0);
      const order = getOptimalPath();

      const orderedCoords = order.map((index) => allCoords[index]);

      const routeStr = orderedCoords.map((c) => c.join(",")).join(";");
      console.log("Requesting directions for route:", routeStr);

      const directionsRes = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${routeStr}?geometries=geojson&steps=true&access_token=${ACCESS_TOKEN}`
      );
      const directionsData = await directionsRes.json();
      console.log("Directions API response:", directionsData);

      if (!directionsData.routes || directionsData.routes.length === 0) {
        console.error("No routes found in directions data");
        return;
      }

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
  }, [fixedWaypoints, clusters[idx], idx]);

  return (
    <>
      <div
        id="map-container"
        ref={mapContainerRef}
        className="relative h-screen w-full"
      >
        {/* Instructions overlay */}
        <Instructions steps={steps} duration={duration} />
        {/* <div
          id="instructions"
          className="absolute top-4 left-4 max-h-64 overflow-y-auto z-10 backdrop-blur-sm bg-white/80 p-4 rounded shadow-lg w-60"
        >
          <p id="prompt">🗺 Route from Start → Waypoints (fixed order)</p>
          {steps.length > 0 && (
            <>
              <p>
                <strong>Trip Duration: {Math.floor(duration / 60)} min 🚗</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1">
                {steps.map((instruction, index) => ( <li key={index}>{instruction}</li> ))}
              </ol>
            </>
          )}
        </div> */}
      </div>
    </>
  );
}

export default MapboxMap;
