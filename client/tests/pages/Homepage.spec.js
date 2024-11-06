import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Homepage from '../../src/pages/Homepage';

describe('Homepage Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders the welcome text, title, and location correctly', () => {
    render(<Homepage />);

    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
    expect(screen.getByText(/Kiruna/i)).toBeInTheDocument();
    expect(screen.getByText(/Sweden/i)).toBeInTheDocument();
  });

  it('renders the Kiruna image with the correct alt text', () => {
    render(<Homepage />);

    const image = screen.getByAltText('Kiruna Design');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/kiruna.png');
  });

  it('renders the "Create new document" button', () => {
    render(<Homepage />);

    const button = screen.getByRole('button', { name: /Create new document/i });
    expect(button).toBeInTheDocument();
  });

  it('navigates to the document creation page when the button is clicked', () => {
    render(<Homepage />);

    const button = screen.getByRole('button', { name: /Create new document/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/documents/add');
  });
});