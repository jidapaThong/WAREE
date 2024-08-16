// To automate testing for the front-end React component, use React Testing Library and Jest.
// npm install --save-dev @testing-library/react @testing-library/jest-dom
// To run the tests 
// npm test

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DataCard from '../components/DataCard'; 

// Mocking fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          cctvID: 1,
          dateTime: '2023-08-14T00:00:00Z',
          waterLevel: 3,
          zone: 0,
        },
        {
          cctvID: 2,
          dateTime: '2023-08-14T00:00:00Z',
          waterLevel: 5,
          zone: 1,
        },
        {
          cctvID: 3,
          dateTime: '2023-08-14T00:00:00Z',
          waterLevel: 7,
          zone: 2,
        },
      ]),
  })
);

describe('DataCard Component', () => {
  const options = [
    { id: 1, text: 'Camera 1' },
    { id: 2, text: 'Camera 2' },
    { id: 3, text: 'Camera 3' },
  ];

  test('renders the correct camera name and status icons based on selectedCamera', async () => {
    render(<DataCard selectedCamera="1" options={options} />);

    // Check if the correct camera name is rendered
    expect(screen.getByText('Camera 1')).toBeInTheDocument();

    // Wait for data to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByAltText('Green Status')).toBeInTheDocument();
      expect(screen.getByText('ระดับน้ำ')).toBeInTheDocument();
      expect(screen.getByText('350 - 400 เซนติเมตร')).toBeInTheDocument();
    });
  });

  test('updates the component with new data every 30 seconds', async () => {
    jest.useFakeTimers();

    render(<DataCard selectedCamera="2" options={options} />);

    await waitFor(() => {
      expect(screen.getByText('Camera 2')).toBeInTheDocument();
      expect(screen.getByAltText('Yellow Status')).toBeInTheDocument();
      expect(screen.getByText('450 - 500 เซนติเมตร')).toBeInTheDocument();
    });

    // Simulate time passing to trigger the interval
    jest.advanceTimersByTime(30000);

    await waitFor(() => {
      // The data should be fetched again
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers();
  });

  test('formats date and time correctly', async () => {
    render(<DataCard selectedCamera="3" options={options} />);

    await waitFor(() => {
      expect(screen.getByText('300 - 400 เซนติเมตร')).toBeInTheDocument();
      expect(screen.getByText(/อัพเดทล่าสุด วันที่ 14\/08\/2023 เวลา 00:00:00 น./)).toBeInTheDocument();
    });
  });
});
