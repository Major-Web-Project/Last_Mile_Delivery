
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Delivery {
  id: string;
  customer: string;
  address: string;
  status: string;
  eta: string;
}

interface Agent {
  id: string;
  name: string;
  status: string;
  deliveries: number;
  location: string;
}

interface DeliveryMapProps {
  deliveries: Delivery[];
  agents?: Agent[];
  currentLocation?: { lat: number; lng: number };
  showRoute?: boolean;
  customerView?: boolean;
  dashboardView?: boolean;
}

const DeliveryMap = ({ 
  deliveries, 
  agents, 
  currentLocation,
  showRoute = false,
  customerView = false,
  dashboardView = false
}: DeliveryMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [needsApiKey, setNeedsApiKey] = useState(true);

  // Mock locations for demonstration
  const mockLocations = [
    { lat: 40.7128, lng: -74.0060, label: "Delivery 1" },
    { lat: 40.7589, lng: -73.9851, label: "Delivery 2" },
    { lat: 40.7282, lng: -73.7949, label: "Delivery 3" },
    { lat: 40.6782, lng: -73.9442, label: "Current Location" },
  ];

  const initializeMap = () => {
    if (!apiKey || !mapRef.current) return;

    // This would initialize Google Maps
    // For now, we'll show a placeholder with mock data
    setMapLoaded(true);
    setNeedsApiKey(false);
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      initializeMap();
    }
  };

  if (needsApiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Google Maps Integration</h3>
          <p className="text-sm text-slate-600">
            Enter your Google Maps API key to enable live mapping features
          </p>
        </div>
        <div className="flex space-x-2 w-full max-w-md">
          <Input
            type="password"
            placeholder="Google Maps API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button onClick={handleApiKeySubmit}>
            Load Map
          </Button>
        </div>
        <div className="text-xs text-slate-500 text-center">
          Get your API key from the Google Cloud Console
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center">
        {/* Mock Map Interface */}
        <div className="w-full h-full relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden">
          {/* Mock map pins */}
          <div className="absolute inset-0">
            {mockLocations.map((location, index) => (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${20 + (index * 20)}%`,
                  top: `${30 + (index * 15)}%`
                }}
              >
                <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white ${
                  index === mockLocations.length - 1 ? 'bg-blue-600' : 'bg-red-500'
                }`}>
                  {index === mockLocations.length - 1 ? '📍' : '🚚'}
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                  {location.label}
                </div>
              </div>
            ))}
          </div>

          {/* Mock route line */}
          {showRoute && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M 20% 30% Q 40% 20% 40% 45% T 60% 60% T 80% 75%"
                stroke="#3B82F6"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          )}

          {/* Map controls */}
          <div className="absolute bottom-4 right-4 space-y-2">
            <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
              +
            </Button>
            <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
              -
            </Button>
          </div>

          {/* Legend */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-sm p-3 space-y-2">
            <div className="text-sm font-semibold">Legend</div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Delivery Points</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Current Location</span>
            </div>
            {showRoute && (
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-6 h-0.5 bg-blue-600" style={{ borderTop: '2px dashed #3B82F6' }}></div>
                <span>Route</span>
              </div>
            )}
          </div>

          {/* Status overlay for different views */}
          {customerView && (
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-sm p-3">
              <div className="text-sm font-semibold text-green-600">Your delivery is on the way!</div>
              <div className="text-xs text-slate-600">Driver is 0.8 miles away</div>
            </div>
          )}

          {dashboardView && (
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm p-3">
              <div className="text-sm font-semibold">Live Updates</div>
              <div className="text-xs text-slate-600">{deliveries.length} active deliveries</div>
              <div className="text-xs text-slate-600">{agents?.length || 0} agents online</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
