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
import ClusterViewer from "@/components/ClusterViewer";
import axios from "axios";

const Index = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const { orders, getOrders, addOrders } = useOrderStore();
  const { toast } = useToast();
  const [clusters, setClusters] = useState([]);
  const [processedClusters, setProcessedClusters] = useState([]);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/clusters/predict-from-orders"
        ); // adjust BASE_URL if needed
        const data = res.data;
        setClusters(data);
        console.log("Frontend clusters:", data);
      } catch (err) {
        console.error("Failed to fetch clusters", err);
      }
    };

    fetchClusters();
  }, []);

  // Process clusters to replace coordinates with addresses from orders
  useEffect(() => {
    if (!clusters.length || !orders.length) return;

    // Build a map of "lat,lng" → address
    const coordToAddress = {};
    orders.forEach((order) => {
      if (
        order.geometry?.type === "Point" &&
        Array.isArray(order.geometry.coordinates)
      ) {
        const key = order.geometry.coordinates
          .map((c) => Number(c).toFixed(6))
          .join(",");
        coordToAddress[key] = order.address;
      }
    });

    // Replace each coordinate in clusters with matching address
    const newClusters = clusters.map((cluster) =>
      cluster.map((coord) => {
        const key = coord.map((c) => Number(c).toFixed(6)).join(",");
        return coordToAddress[key] || `(${coord.join(", ")})`; // fallback if no match
      })
    );

    setProcessedClusters(newClusters);
  }, [clusters, orders]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !fullName ||
      !phone ||
      !streetNumber ||
      !streetName ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      toast({
        title: "Error",
        description: "Please fill in all address fields",
        variant: "destructive",
      });
      return;
    }
    if (!/^\+?[0-9]{7,15}$/.test(phone)) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    // Construct full address
    const fullAddress =
      `${streetNumber} ${streetName}, ${city}, ${state}, ${postalCode}, ${country}`.trim();
    const newOrder = {
      customer: fullName,
      phone,
      address: fullAddress,
    };

    try {
      console.log("Calling addOrders...");
      const result = await addOrders(newOrder);
      console.log("addOrders result:", result);

      toast({
        title: "Success!",
        description: `Address added successfully! Geocoded as: ${
          result.geocodedAddress || "Location identified"
        }`,
      });

      console.log("Submitted Address:", fullAddress);

      // Reset form fields
      setFullName("");
      setPhone("");
      setStreetNumber("");
      setStreetName("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("");
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
            <h2 className="text-sm font-bold text-black w-fit mx-auto">
              Advanced last-mile delivery management with AI-powered routing and
              intelligent optimization for seamless logistics operations
            </h2>
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
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 mb-10">
              <div className="w-full lg:w-1/2 bg-white/50 p-6 rounded-lg shadow-md ml-8 max-h-[500px] overflow-y-auto mr-8">
                <ClusterViewer clusters={processedClusters} />
              </div>

              <div className="w-full lg:w-1/2">
                <form
                  onSubmit={handleSubmit}
                  method="post"
                  className="flex flex-col gap-4 w-full max-w-md mx-auto max-h-[500px] bg-white/20 shadow-md p-4 sm:p-6 rounded-lg"
                >
                  <h1 className="text-3xl font-bold text-center mb-4">
                    Add Your Address
                  </h1>

                  {/* Name */}
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="px-4 py-2 w-full text-black border rounded-md bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Phone Number */}
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="px-4 py-2 w-full text-black border rounded-md bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Street Number + Street Name */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="streetNumber"
                      id="streetNumber"
                      placeholder="Street No."
                      value={streetNumber}
                      onChange={(e) => setStreetNumber(e.target.value)}
                      className="px-4 py-2 w-1/3 text-black border rounded-md bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="streetName"
                      id="streetName"
                      placeholder="Street Name"
                      value={streetName}
                      onChange={(e) => setStreetName(e.target.value)}
                      className="px-4 py-2 flex-1 text-black border rounded-md bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* City + Pincode */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="px-4 py-2 flex-1 text-black border rounded-md bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      id="postalCode"
                      placeholder="Pincode"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="px-4 py-2 w-1/3 text-black border rounded-md bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* State */}
                  <input
                    type="text"
                    name="state"
                    id="state"
                    placeholder="State / Province"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="px-4 py-2 w-full text-black border rounded-md bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Country */}
                  <input
                    type="text"
                    name="country"
                    id="country"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="px-4 py-2 w-full text-black border rounded-md bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                  >
                    Add New Address
                  </button>
                </form>
              </div>
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
              <div className="grid md:grid-cols-3 gap-8 text-center ">
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
