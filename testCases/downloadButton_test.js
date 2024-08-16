import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DownloadButton from '../components/DownloadButton';

// Mocking the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    blob: () => Promise.resolve(new Blob(['sample data'], { type: 'text/csv' })),
  })
);

describe('DownloadButton Component', () => {
  test('renders correctly and handles year selection', () => {
    render(<DownloadButton selectedCamera="1" />);

    // Check if the select dropdown and button are rendered
    expect(screen.getByText('ดาวน์โหลดข้อมูลระดับน้ำ:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ดาวน์โหลด/i })).toBeInTheDocument();

    // Check if years dropdown is populated
    const yearOptions = screen.getAllByRole('option');
    expect(yearOptions).toHaveLength(3); // Current year and previous year + default option
    expect(yearOptions[1].textContent).toBe(new Date().getFullYear().toString());
    expect(yearOptions[2].textContent).toBe((new Date().getFullYear() - 1).toString());
  });

  test('enables download button when a year is selected', () => {
    render(<DownloadButton selectedCamera="1" />);

    // Select a year
    fireEvent.change(screen.getByRole('combobox'), { target: { value: new Date().getFullYear() } });

    // Check if button is enabled
    const downloadButton = screen.getByRole('button', { name: /ดาวน์โหลด/i });
    expect(downloadButton).not.toBeDisabled();
  });

  test('triggers download when button is clicked', async () => {
    render(<DownloadButton selectedCamera="1" />);

    // Select a year
    fireEvent.change(screen.getByRole('combobox'), { target: { value: new Date().getFullYear() } });

    // Click download button
    fireEvent.click(screen.getByRole('button', { name: /ดาวน์โหลด/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`http://27.254.145.207:8000/download/1/${new Date().getFullYear()}`);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  test('handles fetch error gracefully', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    render(<DownloadButton selectedCamera="1" />);

    // Select a year
    fireEvent.change(screen.getByRole('combobox'), { target: { value: new Date().getFullYear() } });

    // Click download button
    fireEvent.click(screen.getByRole('button', { name: /ดาวน์โหลด/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('Error downloading data:', new Error('Network error'));
    });
  });
});
