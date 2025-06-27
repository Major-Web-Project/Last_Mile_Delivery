
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, MapPin, User, Clock, Navigation, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeliveryMap from "@/components/DeliveryMap";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [stats] = useState({
    totalDeliveries: 142,
    completedToday: 89,
    activeAgents: 12,
    averageDeliveryTime: "23 mins",
    onTimeRate: "94.2%"
  });

  const [activeDeliveries] = useState([
    { id: "DEL-001", agent: "Alex Rodriguez", customer: "John Smith", address: "123 Main St", status: "in_transit", eta: "15 mins" },
    { id: "DEL-002", agent: "Maria Garcia", customer: "Sarah Johnson", address: "456 Oak Ave", status: "out_for_delivery", eta: "8 mins" },
    { id: "DEL-003", agent: "David Kim", customer: "Mike Davis", address: "789 Pine Blvd", status: "picked_up", eta: "25 mins" },
    { id: "DEL-004", agent: "Lisa Chen", customer: "Emma Wilson", address: "321 Elm St", status: "in_transit", eta: "18 mins" },
  ]);

  const [agents] = useState([
    { id: "AG-001", name: "Alex Rodriguez", status: "active", deliveries: 8, location: "Downtown" },
    { id: "AG-002", name: "Maria Garcia", status: "active", deliveries: 6, location: "Midtown" },
    { id: "AG-003", name: "David Kim", status: "active", deliveries: 7, location: "Uptown" },
    { id: "AG-004", name: "Lisa Chen", status: "break", deliveries: 5, location: "Downtown" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'break': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
              <h1 className="text-2xl font-bold text-slate-800">Central Dashboard</h1>
            </div>
            <div className="text-sm text-slate-600">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalDeliveries}</div>
                  <div className="text-xs text-slate-600">Total Deliveries</div>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
                  <div className="text-xs text-slate-600">Completed Today</div>
                </div>
                <div className="flex items-center">
                  <ArrowUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.activeAgents}</div>
                  <div className="text-xs text-slate-600">Active Agents</div>
                </div>
                <User className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{stats.averageDeliveryTime}</div>
                  <div className="text-xs text-slate-600">Avg Delivery Time</div>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.onTimeRate}</div>
                  <div className="text-xs text-slate-600">On-Time Rate</div>
                </div>
                <Navigation className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side - Tables */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="deliveries" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deliveries">Active Deliveries</TabsTrigger>
                <TabsTrigger value="agents">Agents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="deliveries">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Deliveries ({activeDeliveries.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                      {activeDeliveries.map((delivery) => (
                        <div key={delivery.id} className="border rounded-lg p-3 bg-white">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-sm font-medium">{delivery.id}</div>
                            <Badge className={`${getStatusColor(delivery.status)} text-xs`}>
                              {delivery.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-600">
                            <div>Agent: {delivery.agent}</div>
                            <div>To: {delivery.customer}</div>
                            <div>{delivery.address}</div>
                            <div className="flex items-center mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              ETA: {delivery.eta}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="agents">
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Agents ({agents.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                      {agents.map((agent) => (
                        <div key={agent.id} className="border rounded-lg p-3 bg-white">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-sm font-medium">{agent.name}</div>
                            <Badge className={`${getAgentStatusColor(agent.status)} text-xs`}>
                              {agent.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-600">
                            <div>Deliveries: {agent.deliveries}</div>
                            <div>Location: {agent.location}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side - Map */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Live Delivery Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <DeliveryMap 
                  deliveries={activeDeliveries}
                  agents={agents}
                  dashboardView={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
