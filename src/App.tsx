import React, { useState, useEffect, Suspense } from "react";
import { UserRole, StadiumVenue } from "./types";
import { Header } from "./components/Header";
import { AIGeneratorModal } from "./components/AIGeneratorModal";
import { FloatingAiAssistant } from "./components/ui/glowing-ai-chat-assistant";
import { MouseGlow } from "./components/ui/MouseGlow";
import { Component as SpotlightCursor } from "./components/ui/spotlight-cursor";
import { Trophy, Loader2 } from "lucide-react";

// Lazy-loaded components for optimal bundle splitting
const FanConcierge = React.lazy(() => import("./components/FanConcierge").then(m => ({ default: m.FanConcierge })));
const OpsDashboard = React.lazy(() => import("./components/OpsDashboard").then(m => ({ default: m.OpsDashboard })));
const VolunteerAssistant = React.lazy(() => import("./components/VolunteerAssistant").then(m => ({ default: m.VolunteerAssistant })));
const CrowdDensityMap = React.lazy(() => import("./components/CrowdDensityMap").then(m => ({ default: m.CrowdDensityMap })));
const SustainabilityTracker = React.lazy(() => import("./components/SustainabilityTracker").then(m => ({ default: m.SustainabilityTracker })));
const VipSuitePass = React.lazy(() => import("./components/VipSuitePass").then(m => ({ default: m.VipSuitePass })));
const EmergencyBroadcast = React.lazy(() => import("./components/EmergencyBroadcast").then(m => ({ default: m.EmergencyBroadcast })));
const TournamentBracket = React.lazy(() => import("./components/TournamentBracket").then(m => ({ default: m.TournamentBracket })));
const LiveWeatherWidget = React.lazy(() => import("./components/LiveWeatherWidget").then(m => ({ default: m.LiveWeatherWidget })));
const GlobalFanChat = React.lazy(() => import("./components/GlobalFanChat").then(m => ({ default: m.GlobalFanChat })));

function SkeletonLoader() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6 animate-pulse" role="status" aria-label="Loading section content">
      <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>("fan");
  const [venues, setVenues] = useState<Record<string, StadiumVenue> | null>(null);
  const [selectedVenueId, setSelectedVenueId] = useState<string>("metlife");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVenues = async () => {
    try {
      const res = await fetch("/api/stadiums");
      const data = await res.json();
      setVenues(data);
    } catch (err) {
      console.error("Failed to load venues:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentRole]);

  if (isLoading || !venues) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" role="status" aria-label="Initializing platform">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          <p className="text-sm font-medium text-slate-600">Loading StadiumOps FIFA World Cup 2026...</p>
        </div>
      </div>
    );
  }

  const currentVenue = venues[selectedVenueId] || venues.metlife;

  return (
    <div className="min-h-screen font-sans antialiased selection:bg-rose-100 selection:text-rose-900 pb-12 bg-slate-50/70 text-slate-800">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        setRole={setCurrentRole}
        venues={venues}
        selectedVenueId={selectedVenueId}
        setSelectedVenueId={setSelectedVenueId}
        onOpenImageModal={() => setIsImageModalOpen(true)}
        onRefreshData={fetchVenues}
      />

      {/* Main Content Area based on User Role */}
      <main className="mt-4" id="main-content">
        <Suspense fallback={<SkeletonLoader />}>
          {currentRole === "fan" && <FanConcierge venue={currentVenue} />}
          {currentRole === "organizer" && <OpsDashboard venue={currentVenue} />}
          {currentRole === "volunteer" && <VolunteerAssistant venue={currentVenue} />}
          {currentRole === "crowd-map" && <CrowdDensityMap venue={currentVenue} />}
          {currentRole === "sustainability" && <SustainabilityTracker venue={currentVenue} />}
          {currentRole === "vip" && <VipSuitePass venue={currentVenue} />}
          {currentRole === "emergency" && <EmergencyBroadcast venue={currentVenue} />}
          {currentRole === "bracket" && <TournamentBracket venue={currentVenue} />}
          {currentRole === "weather" && <LiveWeatherWidget venue={currentVenue} />}
          {currentRole === "support" && <GlobalFanChat venue={currentVenue} />}
        </Suspense>
      </main>

      {/* AI Image Generator Modal */}
      <AIGeneratorModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} />

      {/* Floating 3D AI Assistant */}
      <FloatingAiAssistant currentRole={currentRole} venueId={selectedVenueId} />

      {/* Mouse Glowing Light Spotlight */}
      <MouseGlow />
      <SpotlightCursor config={{ 
        radius: 75, 
        brightness: 0.22, 
        color: ['#fb7185', '#fda4af'] 
      }} />
    </div>
  );
}
