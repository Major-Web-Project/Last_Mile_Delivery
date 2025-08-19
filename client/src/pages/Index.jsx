import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navigation, MapPin, Route, Truck, Clock, Shield } from "lucide-react";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import { useEffect, useState } from "react";
import useOrderStore from "../store/addressStore";
import { Typewriter } from "react-simple-typewriter";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [newAddress, setNewAddress] = useState("");
  const { orders, getOrders, addOrders } = useOrderStore();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with address:", newAddress);

    if (!newAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid address",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Calling addOrders...");
      const result = await addOrders(newAddress);
      console.log("addOrders result:", result);

      // The addOrders function now automatically refreshes orders and notifies callbacks
      toast({
        title: "Success!",
        description: `Address added successfully! Geocoded as: ${
          result.geocodedAddress || "Location identified"
        }`,
      });
      console.log("Submitted Address:", newAddress);
      setNewAddress("");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: "Failed to add address. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <Navbar />
      <div className="min-h-screen text-black bg-green-50/50 backdrop-blur-sm ">
        {/* Hero Section */}
        <div>
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-2">
              <div className="flex justify-center">
                <div className="bg-primary p-4 rounded-full">
                  <Truck className="w-12 h-12 text-primary-foreground text-yellow-500" />
                </div>
              </div>
              <h1 className="text-5xl font-bold ">
                <Typewriter
                  words={["LastMileDelivery"]}
                  loop={false}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              </h1>
            </div>
            <h2 className="text-sm font-bold text-black w-fit mx-auto mb-10">
              Advanced last-mile delivery management with AI-powered routing and
              intelligent optimization for seamless logistics operations
            </h2>
            <form
              onSubmit={handleSubmit}
              method="post"
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <input
                onChange={(e) => setNewAddress(e.target.value)}
                value={newAddress}
                type="text"
                name="newAdd"
                id="newAdd"
                placeholder="Enter Full Address (e.g., Parul University, Vadodara, Gujarat, India)"
                className="px-4 py-2 w-full sm:w-[400px] text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                Add New Address
              </button>
            </form>
          </div>
          <div className="max-w-7xl mx-auto px-4">
            {/* Main Feature Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border border-border group bg-blue-50">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                    <Navigation className="w-10 h-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl mb-2">
                    Agent Dashboard
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    AI-powered route planning using the TSP algorithm to
                    minimize delivery time, reduce fuel consumption, and ensure
                    seamless navigation with real-time GPS tracking
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    onClick={() => navigate("/agent")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                  >
                    Launch Agent View
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border border-border group bg-green-50">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                    <MapPin className="w-10 h-10 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl mb-2">
                    Without Optimization
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Static delivery sequence without intelligent ordering, often
                    resulting in longer travel time, unnecessary detours, and
                    inefficient fuel usage
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    onClick={() => navigate("/default")}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                  >
                    View Route Planning
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="grid lg:grid-cols-3 gap-4 mb-10 ">
              {/* Feature Grid */}
              <div className="text-center p-6 bg-purple-50 rounded-lg shadow-sm hover:shadow-lg transition-shadow border border-border">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Route className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">TSP Algorithm</h3>
                <p className="text-muted-foreground">
                  Intelligent route optimization using advanced algorithms to
                  minimize travel time and distance
                </p>
              </div>

              <div className="text-center p-6 bg-orange-50 rounded-lg shadow-sm hover:shadow-lg transition-shadow border border-border">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Real-Time Tracking
                </h3>
                <p className="text-muted-foreground">
                  Live GPS tracking with dynamic route updates and accurate
                  delivery time estimates
                </p>
              </div>

              <div className="text-center p-6 bg-red-50 rounded-lg shadow-sm hover:shadow-lg transition-shadow border border-border">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Delivery Management
                </h3>
                <p className="text-muted-foreground">
                  Complete delivery lifecycle management with status tracking
                  and issue reporting
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="rounded-2xl shadow-lg p-8 border border-border bg-transparent">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    AI-Powered
                  </div>
                  <p className="text-muted-foreground text-lg">
                    Smart routing with machine learning optimization
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    Real-Time
                  </div>
                  <p className="text-muted-foreground text-lg">
                    Live tracking and instant route updates
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    Optimized
                  </div>
                  <p className="text-muted-foreground text-lg">
                    TSP algorithm for maximum efficiency
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Index;
