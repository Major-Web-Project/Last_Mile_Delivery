import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MapboxMap from "@/components/MapboxMap";
import { useToast } from "@/hooks/use-toast";
import useOrderStore from "@/store/addressStore";

const AgentView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [idx, setIdx] = useState(0);
  const { orders, getOrders, addOrderCallback, removeOrderCallback } =
    useOrderStore();

  // Refresh orders only when component mounts
  useEffect(() => {
    getOrders();
  }, [getOrders]);

  // Set up callback to refresh orders when new addresses are added
  useEffect(() => {
    const refreshOrders = () => {
      console.log("New address added, refreshing orders...");
      getOrders();
    };

    // Register callback
    addOrderCallback(refreshOrders);

    // Cleanup callback on unmount
    return () => {
      removeOrderCallback(refreshOrders);
    };
  }, [addOrderCallback, removeOrderCallback, getOrders]);

  const clusters = [
    [
      [73.21668395742037, 22.25700591168219],
      [73.22562220838351, 22.248142453217334],
      [73.20194447796348, 22.260439181776405],
      [73.19869806249785, 22.26167630895328],
      [73.21405559048209, 22.258611479463713],
      [73.18431705853321, 22.28310051174754],
    ],
    [
      [73.18376626452225, 22.315395087947294],
      [73.18315378149572, 22.31530867600918],
      [73.18559924281323, 22.31754583779496],
      [73.17524797923102, 22.315922406937243],
      [73.18431705853321, 22.28310051174754],
    ],
  ];

  const incIdx = () => {
    console.log("Inc Clicked");
    setIdx((prevIdx) => (prevIdx + 1) % clusters.length);
  };

  const decIdx = () => {
    console.log("dec Clicked");
    setIdx((prevIdx) => (prevIdx - 1 + clusters.length) % clusters.length);
  };

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

  const handleDeliveryComplete = () => {
    toast({
      title: "Delivery Completed!",
      description: "Package delivered successfully to John Smith",
    });
    setCurrentDelivery({ ...currentDelivery, status: "completed" });
  };

  const handleReportIssue = () => {
    toast({
      title: "Issue Reported",
      description: "Your report has been sent to dispatch",
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="min-h-screen bg-yellow-100/50 backdrop-blur-sm text-foreground">
        {/* Header */}
        <div className=" border-b border-border shadow-sm ">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => navigate("/")}>
                  ← Home
                </Button>
                <h1 className="text-2xl font-bold">Agent Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Active Route
                </Badge>
                <div className="text-sm text-black">Agent: Alex Rodriguez</div>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 ">
          <div className="grid lg:grid-cols-5 gap-3">
            {/* Current Delivery */}
            <div className="lg:col-span-1">
              <Card className="mb-3 border border-border bg-white/50 text-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    Current Delivery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="font-semibold">
                        {currentDelivery.customer}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {currentDelivery.address}
                      </div>
                      <div className="text-sm text-muted-foreground">
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
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        ETA: {currentDelivery.eta}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {currentDelivery.status !== "completed" ? (
                        <>
                          <Button
                            onClick={handleDeliveryComplete}
                            className="w-full bg-green-500 hover:bg-green-800"
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
                        <div className="text-center py-4 text-green-500 font-semibold">
                          ✓ Delivery Completed
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Delivery Queue */}
              <Card className="border border-border text-foreground bg-white/50">
                <CardHeader>
                  <CardTitle>Upcoming Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deliveryQueue.map((delivery) => (
                      <div
                        key={delivery.id}
                        className="border border-border rounded-lg p-3 bg-background"
                      >
                        <div className="font-medium">{delivery.customer}</div>
                        <div className="text-sm text-muted-foreground">
                          {delivery.address}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          ETA: {delivery.eta}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Live Map */}
            <div className="lg:col-span-4 ">
              <Card className="h-[600px] border border-border bg-white/50 text-foreground">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Cluster {idx + 1} Route</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log("Manual refresh triggered");
                          getOrders();
                        }}
                      >
                        Refresh Map
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          decIdx();
                        }}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          incIdx();
                        }}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 h-[540px]">
                  <MapboxMap
                    key={`${idx}-${orders.length}`}
                    clusters={clusters}
                    idx={idx}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentView;
