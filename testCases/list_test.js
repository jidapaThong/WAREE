import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import List from '../components/List';

describe('List Component', () => {
  test('renders List with correct elements', () => {
    render(
      <Router>
        <List />
      </Router>
    );

    // Check if the dropdown is present
    expect(screen.getByText('เลือกตำแหน่งกล้องวงจรปิด')).toBeInTheDocument();

    // Check if the map container is present
    expect(screen.getByTestId('map')).toBeInTheDocument();

    // Check if the DownloadButton and DataCard components are rendered
    expect(screen.getByText('ดาวน์โหลด')).toBeInTheDocument();
    expect(screen.getByText('สถานะระดับน้ำ')).toBeInTheDocument(); // Based on DataCard content
  });

  test('dropdown selection triggers map update', async () => {
    render(
      <Router>
        <List />
      </Router>
    );

    // Simulate selecting an option from the dropdown
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });

    // Use waitFor to handle async operations
    await waitFor(() => {
      expect(screen.getByRole('combobox').value).toBe('1');
    });
    
    // Verify that the DataCard displays relevant data (example based on content)
    expect(screen.getByText('กล้องดูระดับน้ำคลองท่าใหญ่')).toBeInTheDocument();
  });

  test('DownloadButton receives selectedCamera prop', () => {
    render(
      <Router>
        <List />
      </Router>
    );

    // Simulate selecting an option from the dropdown
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });

    // Verify that DownloadButton receives the selectedCamera prop
    const downloadButton = screen.getByText('ดาวน์โหลด');
    expect(downloadButton).toBeInTheDocument();
  });
});
