import React from "react";
import { CheckCircle, Cpu, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "../components/ui/Footer";
import Navbar from "../components/ui/Navbar";

const About = () => {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <Navbar />

      <div className=" text-black bg-pink-50/50 backdrop-blur-sm min-h-screen py-16 px-4 md:px-8">
        <Button variant="ghost" onClick={() => navigate("/")}>
          ← Home
        </Button>
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 mb-4">
            About LastMileDelivery
          </h1>
          <p className="text-lg text-black  max-w-2xl mx-auto leading-relaxed">
            <b>LastMileDelivery</b> is a cutting-edge platform using AI, live
            location tracking, and advanced route optimization to modernize how
            last-mile delivery is done.
          </p>
        </section>
        {/* Feature Highlights */}
        <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-20 px-2">
          {[
            {
              title: "LMD-Powered Routing",
              icon: <Cpu className="w-8 h-8 text-indigo-600" />,
              desc: "Uses TSP algorithm and real-time traffic to optimize delivery paths dynamically.",
              color: "from-indigo-100 to-white",
            },
            {
              title: "Live Tracking",
              icon: <MapPin className="w-8 h-8 text-pink-600" />,
              desc: "Tracks agents and packages in real time using GPS and Mapbox integration.",
              color: "from-pink-100 to-white",
            },
            {
              title: "Seamless Workflow",
              icon: <RefreshCw className="w-8 h-8 text-green-600" />,
              desc: "Agent and driver dashboards for simplified communication and delivery lifecycle.",
              color: "from-green-100 to-white",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 bg-gradient-to-br ${item.color} shadow-md hover:shadow-xl transition-shadow backdrop-blur-md border border-gray-200`}
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </section>
        {/* Features & Tech Stack */}
        <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
              ✨ Key Features
            </h2>
            <ul className="space-y-3">
              {[
                "Smart and dynamic route planning",
                "Live agent tracking on map",
                "Agent and driver-specific dashboards",
                "Voice-guided navigation (coming soon)",
                "Performance metrics and ETA",
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle className="text-green-600 mt-1 w-5 h-5" />{" "}
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold text-pink-700 mb-4">
              🧠 Tech Stack
            </h2>
            <ul className="space-y-3 text-slate-700">
              <li>
                <b>Frontend:</b> React.js, Tailwind CSS, Framer Motion
              </li>
              <li>
                <b>Backend:</b> Node.js, Express.js
              </li>
              <li>
                <b>Database:</b> MongoDB
              </li>
              <li>
                <b>Maps:</b> Mapbox GL JS
              </li>
              <li>
                <b>State Management:</b> Zustand
              </li>
            </ul>
          </div>
        </section>
        {/* Mission Section */}
        <section className="mt-20 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            🚀 Our Mission
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            We're on a mission to simplify last-mile delivery by merging AI,
            smart logistics, and beautiful UX. Whether you're managing 10
            packages or 1,000 — LastMileDelivery adapts to your needs and
            optimizes your operation for success.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;
