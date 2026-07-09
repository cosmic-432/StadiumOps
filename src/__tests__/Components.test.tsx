/// <reference types="vitest/globals" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { Header } from "../components/Header";
import { AIGeneratorModal } from "../components/AIGeneratorModal";
import { LiveWeatherWidget } from "../components/LiveWeatherWidget";
import { TournamentBracket } from "../components/TournamentBracket";
import { CrowdDensityMap } from "../components/CrowdDensityMap";
import { FloatingAiAssistant } from "../components/ui/glowing-ai-chat-assistant";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { StadiumVenue } from "../types";

// Mock Venues Data
const mockVenue: StadiumVenue = {
  id: "metlife",
  name: "MetLife Stadium",
  match: "Quarterfinal 48",
  capacity: 82500,
  attendance: 81200,
  weather: "22°C",
  sustainabilityScore: "94%",
  solarOutputMW: "4.8 MW",
  zones: [
    { id: "1", name: "North Concourse", density: "Heavy", waitTimeMinutes: 20, status: "Congested" },
    { id: "2", name: "East VIP Gate", density: "Light", waitTimeMinutes: 5, status: "Normal Flow" }
  ]
};

const mockVenuesRecord: Record<string, StadiumVenue> = {
  metlife: mockVenue,
  att: {
    ...mockVenue,
    id: "att",
    name: "AT&T Stadium",
  }
};

describe("Header Component Tests", () => {
  const setRole = vi.fn();
  const setSelectedVenueId = vi.fn();
  const onOpenImageModal = vi.fn();
  const onRefreshData = vi.fn();

  test("renders Header title, labels, and roles", () => {
    render(
      <Header
        currentRole="fan"
        setRole={setRole}
        venues={mockVenuesRecord}
        selectedVenueId="metlife"
        setSelectedVenueId={setSelectedVenueId}
        onOpenImageModal={onOpenImageModal}
        onRefreshData={onRefreshData}
      />
    );

    expect(screen.getByText("StadiumOps")).toBeInTheDocument();
    expect(screen.getByText("Fans")).toBeInTheDocument();
    expect(screen.getByText("Ops")).toBeInTheDocument();
  });

  test("clicking role tab triggers setRole callback", () => {
    render(
      <Header
        currentRole="fan"
        setRole={setRole}
        venues={mockVenuesRecord}
        selectedVenueId="metlife"
        setSelectedVenueId={setSelectedVenueId}
        onOpenImageModal={onOpenImageModal}
        onRefreshData={onRefreshData}
      />
    );

    fireEvent.click(screen.getByText("Ops"));
    expect(setRole).toHaveBeenCalledWith("organizer");
  });

  test("selecting alternative venue triggers callback", () => {
    render(
      <Header
        currentRole="fan"
        setRole={setRole}
        venues={mockVenuesRecord}
        selectedVenueId="metlife"
        setSelectedVenueId={setSelectedVenueId}
        onOpenImageModal={onOpenImageModal}
        onRefreshData={onRefreshData}
      />
    );

    const selector = screen.getByLabelText("Select Stadium Venue");
    fireEvent.change(selector, { target: { value: "att" } });
    expect(setSelectedVenueId).toHaveBeenCalledWith("att");
  });
});

describe("AIGeneratorModal Component Tests", () => {
  test("does not render when isOpen is false", () => {
    const { container } = render(<AIGeneratorModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders prompt input and responds to visual generator click", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ imageUrl: "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=" })
    });

    render(<AIGeneratorModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText("AI Studio Banner & Poster Generator")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /Generate Graphic/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Download Generated Image")).toBeInTheDocument();
    });
  });
});

describe("LiveWeatherWidget Component Tests", () => {
  const mockWeather = {
    temp: "22°C",
    condition: "Partly Cloudy & Clear",
    humidity: "58%",
    wind: "12 km/h NW",
    uvIndex: "6 (Moderate)",
    radarStatus: "All Clear — No Precipitation within 50 miles",
    hourlyForecast: [
      { time: "12:00 PM", temp: "21°C", icon: "cloud" },
      { time: "03:00 PM", temp: "23°C", icon: "sun" },
    ]
  };

  test("loads and renders live weather telemetry", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockWeather)
    });

    render(<LiveWeatherWidget venue={mockVenue} />);

    expect(screen.getByText(/Loading live weather radar/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("22°C")).toBeInTheDocument();
      expect(screen.getByText("Partly Cloudy & Clear")).toBeInTheDocument();
      expect(screen.getByText("58%")).toBeInTheDocument();
    });
  });
});

describe("TournamentBracket Component Tests", () => {
  test("renders matches and allows round-based filtering", () => {
    render(<TournamentBracket venue={mockVenue} />);

    expect(screen.getByText("Match Bracket & Fixtures")).toBeInTheDocument();
    expect(screen.getByText("Brazil vs. France")).toBeInTheDocument();

    const finalBtn = screen.getByRole("button", { name: "Final Match" });
    fireEvent.click(finalBtn);

    expect(screen.getByText("Winner SF1 vs. Winner SF2")).toBeInTheDocument();
  });
});

describe("CrowdDensityMap Component Tests", () => {
  test("renders schematic and allows interactive sector selection", () => {
    render(<CrowdDensityMap venue={mockVenue} />);

    expect(screen.getByText(/Visual Stadium Crowd Map/i)).toBeInTheDocument();

    // Verify first zone details are visible in inspection panel
    const concourses = screen.getAllByText("North Concourse");
    expect(concourses.length).toBeGreaterThan(0);
    expect(screen.getByText("Heavy Density")).toBeInTheDocument();
  });
});

describe("ErrorBoundary Component Tests", () => {
  const ProblematicComponent = () => {
    throw new Error("Catastrophic rendering failure");
  };

  test("intercepts render errors and renders beautiful error screen", () => {
    // Prevent Vitest from logging the expected test error to output
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Catastrophic rendering failure")).toBeInTheDocument();

    consoleError.mockRestore();
  });
});

describe("FloatingAiAssistant Component Tests", () => {
  test("toggles chat window and accepts prompt submissions", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ reply: "Mocked response from StadiaAI" })
    });

    render(<FloatingAiAssistant currentRole="fan" venueId="metlife" />);

    const openBtn = screen.getByRole("button");
    fireEvent.click(openBtn);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Ask as fan about/i)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Ask as fan about/i);
    fireEvent.change(textarea, { target: { value: "Where is gate A?" } });

    const sendBtn = screen.getByRole("button", { name: /Send/i });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText("Mocked response from StadiaAI")).toBeInTheDocument();
    });
  });
});
