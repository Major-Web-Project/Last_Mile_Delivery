import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navigation, MapPin, Route, Truck, Clock, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <Truck className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-6">
            DeliveryFlow
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Advanced last-mile delivery management with AI-powered routing, real-time tracking, 
            and intelligent optimization for seamless logistics operations
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => navigate('/agent')} 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              Start Delivery Route
            </Button>
          </div>
        </div>

        {/* Main Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-200 group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <Navigation className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl mb-2">Smart Agent Dashboard</CardTitle>
              <CardDescription className="text-base">
                Optimized routes with TSP algorithm, GPS tracking, and real-time navigation for maximum efficiency
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={() => navigate('/agent')} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
              >
                Launch Agent View
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-green-200 group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <MapPin className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl mb-2">Route Optimization</CardTitle>
              <CardDescription className="text-base">
                Advanced Traveling Salesman Problem solver with Mapbox integration for optimal delivery sequences
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={() => navigate('/agent')} 
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
              >
                View Route Planning
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Route className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">TSP Algorithm</h3>
            <p className="text-slate-600">
              Intelligent route optimization using advanced algorithms to minimize travel time and distance
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
            <p className="text-slate-600">
              Live GPS tracking with dynamic route updates and accurate delivery time estimates
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Delivery Management</h3>
            <p className="text-slate-600">
              Complete delivery lifecycle management with status tracking and issue reporting
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">AI-Powered</div>
              <p className="text-slate-600 text-lg">Smart routing with machine learning optimization</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">Real-Time</div>
              <p className="text-slate-600 text-lg">Live tracking and instant route updates</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">Optimized</div>
              <p className="text-slate-600 text-lg">TSP algorithm for maximum efficiency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;