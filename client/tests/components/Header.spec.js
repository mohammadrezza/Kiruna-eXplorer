import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../src/components/Header';

describe('Header Component', () => {
  it('renders the header with title and icon', () => {
    render(<Header />);

    const titleElement = screen.getByText(/Kiruna eXplorer/i);
    expect(titleElement).toBeInTheDocument();
  });
  it('applies additional classes correctly', () => {
    render(<Header className="test-class" />);

    const navbarElement = screen.getByTestId('header-wrapper');
    expect(navbarElement).toHaveClass('custom-navbar');
    expect(navbarElement).toHaveClass('test-class');
  });
});

