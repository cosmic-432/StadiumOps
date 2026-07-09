export type UserRole = "fan" | "organizer" | "volunteer" | "crowd-map" | "sustainability" | "vip" | "emergency" | "bracket" | "support" | "weather";

export interface ZoneTelemetry {
  id: string;
  name: string;
  density: string;
  waitTimeMinutes: number;
  status: string;
}

export interface StadiumVenue {
  id: string;
  name: string;
  match: string;
  capacity: number;
  attendance: number;
  weather: string;
  sustainabilityScore: string;
  solarOutputMW: string;
  zones: ZoneTelemetry[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: "Ticketing" | "Seating" | "Accessibility" | "Lost & Found" | "Emergency" | "General";
  status: "Open" | "In Progress" | "Resolved";
  priority: "High" | "Medium" | "Low";
  lastMessage: string;
  updatedAt: string;
}

export interface WeatherData {
  temp: string;
  condition: string;
  humidity: string;
  wind: string;
  uvIndex: string;
  radarStatus: string;
  hourlyForecast: { time: string; temp: string; icon: string }[];
}

export interface CrowdAnalysisResult {
  riskLevel: string;
  bottlenecks: string[];
  recommendations: string[];
  aiSimulatedFlowPrediction: string;
}

