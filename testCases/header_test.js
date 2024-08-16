import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom'; 
import Header from '../components/Header'; 

describe('Header Component', () => {
  test('renders header with correct elements', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    // Check if logo is displayed
    expect(screen.getByAltText('DEPA Logo')).toBeInTheDocument();

    // Check if navigation links are present
    expect(screen.getByText('หน้าหลัก')).toBeInTheDocument();
    expect(screen.getByText('แดชบอร์ด')).toBeInTheDocument();
    expect(screen.getByText('คู่มือ')).toBeInTheDocument();

    // Check if language dropdown is present
    expect(screen.getByText('TH ▾')).toBeInTheDocument();
    expect(screen.getByAltText('TH Logo')).toBeInTheDocument();
  });

  test('dropdown menu displays language options', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    // Open dropdown menu
    fireEvent.mouseEnter(screen.getByText('TH ▾'));

    // Verify that dropdown options are displayed
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByAltText('EN Logo')).toBeInTheDocument();
  });

  test('links have correct href attributes', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    // Check href attributes of links
    expect(screen.getByText('หน้าหลัก').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('แดชบอร์ด').closest('a')).toHaveAttribute('href', '/dashboard');
    expect(screen.getByText('คู่มือ').closest('a')).toHaveAttribute('href', '/manual');
    expect(screen.getByText('EN').closest('a')).toHaveAttribute('href', '/en');
  });
});
