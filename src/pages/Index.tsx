
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navigation, User, BarChart3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            DeliveryFlow
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Advanced last-mile delivery management with AI-powered routing and real-time tracking
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Navigation className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Delivery Agent</CardTitle>
              <CardDescription>
                Optimized routes, GPS tracking, and AI assistant for seamless deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/agent')} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Delivery
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Customer Portal</CardTitle>
              <CardDescription>
                Track your delivery in real-time with live updates and support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/customer')} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Track Delivery
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Central Dashboard</CardTitle>
              <CardDescription>
                Monitor all deliveries, agents, and analytics from one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                View Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">AI-Powered</div>
              <p className="text-slate-600">Smart routing and real-time assistance</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">Real-Time</div>
              <p className="text-slate-600">Live tracking and instant updates</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">Comprehensive</div>
              <p className="text-slate-600">Complete delivery management solution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
