import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation, User, MapPin, Clock, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeliveryMap from "@/components/DeliveryMap";
import AIAssistant from "@/components/AIAssistant";
import { useToast } from "@/hooks/use-toast";

const AgentView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentDelivery, setCurrentDelivery] = useState({
    id: "DEL-001",
    customer: "John Smith",
    address: "123 Main St, Downtown",
    status: "in_transit",
    eta: "15 mins",
    phone: "+1 555-0123",
  });

  const [deliveryQueue] = useState([
    {
      id: "DEL-002",
      customer: "Sarah Johnson",
      address: "456 Oak Ave",
      status: "pending",
      eta: "35 mins",
    },
    {
      id: "DEL-003",
      customer: "Mike Davis",
      address: "789 Pine Blvd",
      status: "pending",
      eta: "50 mins",
    },
  ]);

  const [showAssistant, setShowAssistant] = useState(false);

  const handleDeliveryComplete = () => {
    toast({
      title: "Delivery Completed!",
      description: "Package delivered successfully to John Smith",
    });
    setCurrentDelivery({
      ...currentDelivery,
      status: "completed",
    });
  };

  const handleReportIssue = () => {
    setShowAssistant(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/")}>
                ← Home
              </Button>
              <h1 className="text-2xl font-bold text-slate-800">
                Agent Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <Navigation className="w-4 h-4 mr-1" />
                Active Route
              </Badge>
              <div className="text-sm text-slate-600">
                Agent: Alex Rodriguez
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Delivery */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Current Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold">
                      {currentDelivery.customer}
                    </div>
                    <div className="text-sm text-slate-600">
                      {currentDelivery.address}
                    </div>
                    <div className="text-sm text-slate-600">
                      {currentDelivery.phone}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        currentDelivery.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        currentDelivery.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }
                    >
                      {currentDelivery.status === "completed"
                        ? "Completed"
                        : "In Transit"}
                    </Badge>
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock className="w-4 h-4 mr-1" />
                      ETA: {currentDelivery.eta}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {currentDelivery.status !== "completed" ? (
                      <>
                        <Button
                          onClick={handleDeliveryComplete}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          Mark as Delivered
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleReportIssue}
                          className="w-full"
                        >
                          Report Issue
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-4 text-green-600 font-semibold">
                        ✓ Delivery Completed
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Queue */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deliveryQueue.map((delivery) => (
                    <div key={delivery.id} className="border rounded-lg p-3">
                      <div className="font-medium">{delivery.customer}</div>
                      <div className="text-sm text-slate-600">
                        {delivery.address}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        ETA: {delivery.eta}
                      </div>
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
                <CardTitle>Live Route Map</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <DeliveryMap
                  deliveries={[currentDelivery, ...deliveryQueue]}
                  currentLocation={{ lat: 40.7128, lng: -74.006 }}
                  showRoute={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      {showAssistant && (
        <AIAssistant onClose={() => setShowAssistant(false)} context="agent" />
      )}
    </div>
  );
};

export default AgentView;
