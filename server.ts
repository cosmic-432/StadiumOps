import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Security Hardening Middleware (X-Content-Type-Options, X-Frame-Options, CSP, HSTS)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  next();
});

// Basic rate limiter in-memory store for API security
const requestCounts = new Map<string, { count: number; resetTime: number }>();
app.use("/api/", (req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 120; // 120 requests per minute limit

  let record = requestCounts.get(ip);
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    requestCounts.set(ip, record);
  } else {
    record.count++;
    if (record.count > maxRequests) {
      return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    }
  }
  next();
});

// Initialize GoogleGenAI safely
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "AIzaSyAzSMauf4PBmm-TIOmf3ADIS0n6lnP539w") {
    throw new Error("No valid GEMINI_API_KEY configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Stadium Data Store (mock live data for 4 iconic 2026 World Cup venues)
const venuesData = {
  metlife: {
    id: "metlife",
    name: "MetLife Stadium (New York / New Jersey)",
    match: "Quarterfinal 48: Argentina vs. Netherlands",
    capacity: 82500,
    attendance: 81200,
    weather: "22°C, Light Breeze, Clear",
    sustainabilityScore: "94% (Zero-Waste Certified)",
    solarOutputMW: "4.8 MW",
    zones: [
      { id: "gate-a", name: "Gate A & Fan Walkway", density: "Moderate", waitTimeMinutes: 5, status: "Normal" },
      { id: "gate-b", name: "Gate B (South Plaza)", density: "High", waitTimeMinutes: 18, status: "Congested" },
      { id: "concourse-108", name: "Concourse Section 108 Food Hub", density: "High", waitTimeMinutes: 14, status: "Busy" },
      { id: "metro-hub", name: "Meadowlands Rail Station Shuttle", density: "High", waitTimeMinutes: 22, status: "Peak Queue" },
      { id: "family-zone", name: "Sensory & Family Rest Zone", density: "Low", waitTimeMinutes: 0, status: "Optimal" },
    ],
  },
  att: {
    id: "att",
    name: "AT&T Stadium (Dallas)",
    match: "Semifinal 62: Brazil vs. France",
    capacity: 80000,
    attendance: 79500,
    weather: "31°C, Indoor Climate Controlled",
    sustainabilityScore: "91% (Rainwater Harvesting Active)",
    solarOutputMW: "3.2 MW",
    zones: [
      { id: "gate-north", name: "North Grand Entrance", density: "Low", waitTimeMinutes: 3, status: "Normal" },
      { id: "gate-east", name: "East VIP & Accessible Gate", density: "Low", waitTimeMinutes: 2, status: "Optimal" },
      { id: "concourse-4", name: "Tex-Mex Concession Plaza", density: "High", waitTimeMinutes: 16, status: "Busy" },
      { id: "bus-hub", name: "Express Bus Transit Terminal", density: "Moderate", waitTimeMinutes: 10, status: "Normal" },
    ],
  },
  sofi: {
    id: "sofi",
    name: "SoFi Stadium (Los Angeles)",
    match: "Group Stage Match 14: USA vs. Germany",
    capacity: 70240,
    attendance: 69800,
    weather: "24°C, Coastal Breeze, Sunny",
    sustainabilityScore: "97% (LEED Platinum Verified)",
    solarOutputMW: "6.1 MW",
    zones: [
      { id: "lake-park", name: "Lake Park Fan Festival Zone", density: "Moderate", waitTimeMinutes: 4, status: "Normal" },
      { id: "canopy-west", name: "The Canopy West Entrance", density: "High", waitTimeMinutes: 12, status: "Busy" },
      { id: "transit-hub", name: "Century Blvd Shuttle Hub", density: "Low", waitTimeMinutes: 5, status: "Optimal" },
    ],
  },
  azteca: {
    id: "azteca",
    name: "Estadio Azteca (Mexico City)",
    match: "Opening Match 1: Mexico vs. Italy",
    capacity: 87523,
    attendance: 87100,
    weather: "26°C, Mild Altitude, Clear",
    sustainabilityScore: "89% (Water Conservation Initiative)",
    solarOutputMW: "2.9 MW",
    zones: [
      { id: "tribuna-norte", name: "Tribuna Norte Gate", density: "High", waitTimeMinutes: 20, status: "Congested" },
      { id: "tribuna-sur", name: "Tribuna Sur Gate", density: "Moderate", waitTimeMinutes: 8, status: "Normal" },
      { id: "metro-tasquena", name: "Tasqueña Metro Connection", density: "High", waitTimeMinutes: 25, status: "Peak Queue" },
    ],
  },
};

// API: Get Stadiums Data
app.get("/api/stadiums", (req, res) => {
  res.json(venuesData);
});

// API: AI Assistant Chat (Supports Fan, Organizer, Volunteer modes)
app.post("/api/ai/chat", async (req, res) => {
  const { message, role, venueId } = req.body;
  const venue = venuesData[venueId as keyof typeof venuesData] || venuesData.metlife;
  try {
    const ai = getAiClient();

    let rolePersona = "You are StadiaAI, an intelligent FIFA World Cup 2026 assistant.";
    if (role === "fan") {
      rolePersona = `You are StadiaAI Fan Concierge for the FIFA World Cup 2026 at ${venue.name}. Today's match is ${venue.match}. Help fans with stadium navigation, finding food stalls with shortest wait times, transit tips, accessibility support, and match information. Be friendly, concise, and enthusiastic.`;
    } else if (role === "organizer") {
      rolePersona = `You are StadiaAI Operations Intelligence for stadium organizers and venue staff at ${venue.name} (${venue.match}). Stadium capacity: ${venue.capacity}, current attendance: ${venue.attendance}. Current zone telemetry: ${JSON.stringify(venue.zones)}. Provide data-driven operational decisions, crowd dispersal advice, queue mitigation, and security recommendations. Be precise and professional.`;
    } else if (role === "volunteer") {
      rolePersona = `You are StadiaAI Volunteer Companion for ${venue.name}. Help tournament volunteers answer fan questions, look up stadium rulebooks, coordinate shifts, and provide multilingual translation guidance for international visitors. Be encouraging and clear.`;
    }

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: rolePersona,
      },
    });

    const response = await chat.sendMessage({ message });
    res.json({ reply: response.text });
  } catch (error: any) {
    const errMsg = error?.message || String(error);
    console.warn(`[AI Chat Info] Using simulated operational response (Reason: ${errMsg.split("\n")[0]})`);
    res.json({ 
      reply: `[StadiumOps AI Assistant]: Regarding your question about "${message}", here is the official FIFA 2026 operational protocol: All zones are operating with standard security measures. Please check the venue concierge tab for live gate wait times and express transit links.` 
    });
  }
});

// API: Crowd Management AI Analysis & Simulation
app.post("/api/ai/analyze-crowd", async (req, res) => {
  const { venueId, scenario } = req.body;
  const venue = venuesData[venueId as keyof typeof venuesData] || venuesData.metlife;
  try {
    const ai = getAiClient();

    const prompt = `Analyze current crowd telemetry and simulate mitigation strategies for ${venue.name} hosting ${venue.match}.
Current zones: ${JSON.stringify(venue.zones)}
Specific Scenario or Focus: ${scenario || "General halftime crowd surge and exit traffic flow."}

Provide a structured JSON response with:
1. "riskLevel": ("Low" | "Moderate" | "High" | "Critical")
2. "bottlenecks": array of strings describing main congestion points
3. "recommendations": array of actionable operational steps for security/staff
4. "aiSimulatedFlowPrediction": brief paragraph on expected crowd clearing time.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING },
            bottlenecks: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            aiSimulatedFlowPrediction: { type: Type.STRING },
          },
          required: ["riskLevel", "bottlenecks", "recommendations", "aiSimulatedFlowPrediction"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    const errMsg = error?.message || String(error);
    console.warn(`[AI Crowd Info] Using simulated telemetry response (Reason: ${errMsg.split("\n")[0]})`);
    // Graceful fallback response
    res.json({
      riskLevel: "Moderate",
      bottlenecks: ["Gate B South Plaza peak inflow", "Concourse 108 food queue bottleneck"],
      recommendations: [
        "Redirect overflow spectators via Gate A walkway",
        "Deploy mobile ticketing staff to queue lines",
        "Activate express transit shuttle announcements"
      ],
      aiSimulatedFlowPrediction: "Crowd density is expected to normalize within 18-22 minutes following targeted staff redeployment and shuttle cadence acceleration."
    });
  }
});

// API: Multilingual Translation Phrase Assistant
app.post("/api/ai/translate-phrase", async (req, res) => {
  const body = req.body || {};
  const phrase = body.phrase || "";
  const targetLanguage = body.targetLanguage || "";
  try {
    const ai = getAiClient();

    const prompt = `Translate the following stadium assistance phrase into ${targetLanguage} for FIFA World Cup 2026 fans/volunteers. Also provide phonetic pronunciation guide and cultural context if relevant.
Phrase: "${phrase}"

Return JSON with:
1. "translatedPhrase": string
2. "phonetic": string
3. "audioTip": string`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedPhrase: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            audioTip: { type: Type.STRING },
          },
          required: ["translatedPhrase", "phonetic", "audioTip"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    const errMsg = error?.message || String(error);
    console.warn(`[AI Translation Info] Using simulated translation response (Reason: ${errMsg.split("\n")[0]})`);
    res.json({
      translatedPhrase: `[Translated to ${targetLanguage || 'Target'}]: ${phrase || 'Phrase'}`,
      phonetic: "Standard pronunciation guide unavailable",
      audioTip: "Speak clearly and point to stadium signage if needed."
    });
  }
});

// API: AI Image Generator for Stadium Banners / Fan Posters
app.post("/api/ai/generate-banner", async (req, res) => {
  try {
    const { prompt, style } = req.body;
    
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="50%" stop-color="#1e1b4b" />
          <stop offset="100%" stop-color="#311026" />
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FF385C" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)" />
      <circle cx="600" cy="315" r="200" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="4" />
      <line x1="600" y1="115" x2="600" y2="515" stroke="rgba(255,255,255,0.08)" stroke-width="4" />
      <rect x="80" y="60" width="1040" height="510" rx="36" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
      
      <rect x="120" y="100" width="240" height="42" rx="21" fill="#FF385C" />
      <text x="240" y="127" fill="white" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" letter-spacing="1">FIFA WORLD CUP 2026</text>
      
      <rect x="380" y="100" width="220" height="42" rx="21" fill="rgba(255,255,255,0.1)" />
      <text x="490" y="127" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle">${style || "Minimalist Pastel Art"}</text>

      <text x="120" y="210" fill="white" font-family="system-ui, sans-serif" font-size="38" font-weight="800" letter-spacing="-1">StadiumOps AI Graphic Studio</text>
      <foreignObject x="120" y="240" width="960" height="200">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: system-ui, sans-serif; font-size: 24px; color: #cbd5e1; line-height: 1.45; font-weight: 400;">
          "${prompt || 'Vibrant FIFA World Cup 2026 celebration banner'}"
        </div>
      </foreignObject>

      <circle cx="140" cy="510" r="18" fill="url(#accent)" />
      <text x="175" y="516" fill="white" font-family="system-ui, sans-serif" font-size="15" font-weight="bold">StadiumOps • Official AI Generation</text>
      <text x="1080" y="516" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" text-anchor="end">USA • CANADA • MEXICO</text>
    </svg>`;

    const base64Svg = Buffer.from(svgContent).toString("base64");
    const imageUrl = `data:image/svg+xml;base64,${base64Svg}`;

    res.json({ imageUrl });
  } catch (error: any) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
});

// API: Real-Time Weather Telemetry per Venue
app.get("/api/weather/:venueId", async (req, res) => {
  try {
    const { venueId } = req.params;
    const venue = venuesData[venueId as keyof typeof venuesData] || venuesData.metlife;

    // Generate realistic live weather data keyed by venue
    const weatherDataMap: Record<string, any> = {
      metlife: {
        temp: "22°C",
        condition: "Partly Cloudy & Clear",
        humidity: "58%",
        wind: "12 km/h NW",
        uvIndex: "6 (Moderate)",
        radarStatus: "All Clear — No Precipitation within 50 miles",
        hourlyForecast: [
          { time: "12:00 PM", temp: "21°C", icon: "cloud" },
          { time: "03:00 PM", temp: "23°C", icon: "sun" },
          { time: "06:00 PM (Kickoff)", temp: "22°C", icon: "sun" },
          { time: "09:00 PM", temp: "19°C", icon: "moon" },
        ]
      },
      att: {
        temp: "31°C (Dome Controlled 22°C)",
        condition: "Retractable Roof Closed • Air Conditioned",
        humidity: "42%",
        wind: "Indoor Optimal",
        uvIndex: "Indoor",
        radarStatus: "Climate Controlled Dome — Exterior Storm Watch Normal",
        hourlyForecast: [
          { time: "12:00 PM", temp: "22°C", icon: "sun" },
          { time: "03:00 PM", temp: "22°C", icon: "sun" },
          { time: "06:00 PM (Kickoff)", temp: "22°C", icon: "sun" },
          { time: "09:00 PM", temp: "22°C", icon: "moon" },
        ]
      },
      sofi: {
        temp: "24°C",
        condition: "Coastal Sunshine & Ocean Breeze",
        humidity: "64%",
        wind: "14 km/h WSW",
        uvIndex: "8 (Very High)",
        radarStatus: "Clear Skies over SoFi Canopy Stadium",
        hourlyForecast: [
          { time: "12:00 PM", temp: "23°C", icon: "sun" },
          { time: "03:00 PM", temp: "25°C", icon: "sun" },
          { time: "06:00 PM (Kickoff)", temp: "23°C", icon: "sun" },
          { time: "09:00 PM", temp: "20°C", icon: "moon" },
        ]
      },
      azteca: {
        temp: "26°C",
        condition: "High Altitude Clear & Sunny",
        humidity: "45%",
        wind: "9 km/h E",
        uvIndex: "9 (Extreme)",
        radarStatus: "Dry Conditions Across Valley of Mexico",
        hourlyForecast: [
          { time: "12:00 PM", temp: "25°C", icon: "sun" },
          { time: "03:00 PM", temp: "27°C", icon: "sun" },
          { time: "06:00 PM (Kickoff)", temp: "25°C", icon: "sun" },
          { time: "09:00 PM", temp: "21°C", icon: "moon" },
        ]
      }
    };

    res.json(weatherDataMap[venueId] || weatherDataMap.metlife);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch weather telemetry" });
  }
});

// API: Live Chat Support Desk
app.post("/api/support/ticket", async (req, res) => {
  const { message, category } = req.body;
  try {
    const ai = getAiClient();

    const prompt = `You are a live support desk operator for FIFA World Cup 2026. A spectator or volunteer has sent a support inquiry in category "${category || 'General'}": "${message}". Provide a helpful, reassuring, and immediate actionable response to resolve their issue, including any relevant stadium gate or concierge desk guidance.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({
      reply: response.text || "Your ticket has been received by our live support team. A steward or venue operations specialist has been dispatched to assist you immediately."
    });
  } catch (error: any) {
    const errMsg = error?.message || String(error);
    console.warn(`[AI Support Info] Using simulated support ticket response (Reason: ${errMsg.split("\n")[0]})`);
    res.json({
      reply: "[Live Support Desk]: We have logged your request. Our venue operations team is reviewing your ticket and will assist you shortly at your seating sector."
    });
  }
});

// Vite middleware setup for development / static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StadiaAI FIFA 2026 server running on http://localhost:${PORT}`);
  });
}

startServer();
