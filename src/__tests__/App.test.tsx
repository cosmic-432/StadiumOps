/// <reference types="vitest/globals" />
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';

const mockVenues = {
  metlife: {
    id: 'metlife',
    name: 'MetLife Stadium',
    match: 'Quarterfinal 48',
    capacity: 82500,
    attendance: 81200,
    weather: '22°C',
    sustainabilityScore: '94%',
    solarOutputMW: '4.8 MW',
    zones: []
  }
};

const mockWeather = {
  temp: '22°C',
  condition: 'Partly Cloudy',
  humidity: '58%',
  wind: '12 km/h NW',
  uvIndex: '6 (Moderate)',
  radarStatus: 'All Clear',
  hourlyForecast: [{ time: '12:00 PM', temp: '21°C', icon: 'sun' }]
};

beforeEach(() => {
  global.fetch = vi.fn().mockImplementation((url) => {
    if (url.includes('/api/stadiums')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockVenues),
      });
    }
    if (url.includes('/api/weather/')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockWeather),
      });
    }
    if (url.includes('/api/support/ticket')) {
      return Promise.resolve({
        json: () => Promise.resolve({ reply: 'Mock support reply from venue ops.' }),
      });
    }
    return Promise.resolve({
      json: () => Promise.resolve({}),
    });
  });
});

describe('StadiumOps Application Tests', () => {
  test('renders header and application title', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('StadiumOps')).toBeInTheDocument();
    });
  });

  test('switches roles and views correctly', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('StadiumOps')).toBeInTheDocument();
    });

    const weatherBtn = screen.getByText('Weather');
    fireEvent.click(weatherBtn);

    await waitFor(() => {
      expect(screen.getByText(/Weather Operations/i)).toBeInTheDocument();
    });
  });

  test('accessibility checks - main interactive elements', async () => {
    const { container } = render(<App />);
    await waitFor(() => {
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
