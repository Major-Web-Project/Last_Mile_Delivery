
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, User, MessageCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeliveryMap from "@/components/DeliveryMap";
import AIAssistant from "@/components/AIAssistant";
import { LocationService } from "@/services/LocationService";

const CustomerView = () => {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState("DEL-001");
  const [showAssistant, setShowAssistant] = useState(false);
  const [sosAlerts, setSosAlerts] = useState([]);
  
  const [deliveryInfo] = useState({
    id: "DEL-001",
    status: "in_transit",
    customerName: "John Smith",
    address: "123 Main St, Downtown",
    agentName: "Alex Rodriguez",
    agentPhone: "+1 555-0456",
    estimatedTime: "12-15 mins",
    orderItems: [
      "Premium Coffee Beans (2 lbs)",
      "Organic Honey (16 oz)",
      "Artisan Bread"
    ],
    currentLocation: { lat: 40.7589, lng: -73.9851 }
  });

  // Subscribe to SOS alerts
  useEffect(() => {
    const unsubscribe = LocationService.subscribe((event) => {
      if (event.type === 'SOS_ALERT') {
        setSosAlerts(prev => [...prev, event.data]);
      } else if (event.type === 'SOS_DEACTIVATED') {
        setSosAlerts(prev => prev.filter(alert => alert.id !== event.data.id));
      }
    });

    return unsubscribe;
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'in_transit': return 'In Transit';
      case 'out_for_delivery': return 'Out for Delivery';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                ← Home
              </Button>
              <h1 className="text-2xl font-bold text-slate-800">Track Your Delivery</h1>
            </div>
            {sosAlerts.length > 0 && (
              <div className="flex items-center space-x-2 bg-red-100 px-3 py-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-semibold">Emergency Alert Active</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* SOS Alert Banner */}
        {sosAlerts.length > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <div className="font-semibold text-red-800">Emergency Alert</div>
                  <div className="text-sm text-red-700">
                    Your delivery agent has activated emergency mode. We're monitoring the situation.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tracking Input */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <Input
                placeholder="Enter tracking ID (e.g., DEL-001)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="flex-1"
              />
              <Button className="bg-green-600 hover:bg-green-700">
                Track Package
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Delivery Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  Delivery Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <Badge className={`${getStatusColor(deliveryInfo.status)} px-3 py-1 text-sm`}>
                      {getStatusText(deliveryInfo.status)}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Delivery Address</div>
                    <div className="font-medium">{deliveryInfo.address}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-1 text-blue-600" />
                      <span>ETA: {deliveryInfo.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Your Delivery Agent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium">{deliveryInfo.agentName}</div>
                    <div className="text-sm text-slate-600">{deliveryInfo.agentPhone}</div>
                    {sosAlerts.length > 0 && (
                      <div className="text-sm text-red-600 font-medium">
                        🚨 Emergency mode active
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAssistant(true)}
                    className="w-full"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {deliveryInfo.orderItems.map((item, index) => (
                    <div key={index} className="text-sm border-b pb-2 last:border-b-0">
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Live Tracking</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <DeliveryMap 
                  deliveries={[{
                    id: deliveryInfo.id,
                    customer: deliveryInfo.customerName,
                    address: deliveryInfo.address,
                    status: deliveryInfo.status,
                    eta: deliveryInfo.estimatedTime
                  }]}
                  currentLocation={deliveryInfo.currentLocation}
                  customerView={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      {showAssistant && (
        <AIAssistant 
          onClose={() => setShowAssistant(false)}
          context="customer"
        />
      )}
    </div>
  );
};

export default CustomerView;
