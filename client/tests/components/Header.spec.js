import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../src/components/Header';

describe('Header Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders the header with title and icon', () => {
    useLocation.mockReturnValue({ pathname: '/' });
    render(<Header />);

    const titleElement = screen.getByText(/Kiruna eXplorer/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('navigates to "/" when title is clicked', () => {
    useLocation.mockReturnValue({ pathname: '/login' });
    render(<Header />);

    const titleElement = screen.getByText(/Kiruna eXplorer/i);
    fireEvent.click(titleElement);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('displays profile icon and navigates to "/login" when clicked', () => {
    useLocation.mockReturnValue({ pathname: '/' });
    render(<Header />);

    const profileIcon = screen.getByTestId('profile-icon');
    fireEvent.click(profileIcon);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('does not display profile icon on login page', () => {
    useLocation.mockReturnValue({ pathname: '/login' });
    render(<Header />);

    const profileIcon = screen.queryByTestId('profile-icon');
    expect(profileIcon).toBeNull();
  });
  it('applies additional classes correctly', () => {
    useLocation.mockReturnValue({ pathname: '/' });
    render(<Header className="test-class" />);

    const navbarElement = screen.getByTestId('header-wrapper');
    expect(navbarElement).toHaveClass('custom-navbar');
    expect(navbarElement).toHaveClass('test-class');
  });
});

