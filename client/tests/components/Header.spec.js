import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../src/components/Header';
import { AuthContext } from '../../src/layouts/AuthContext'; // Adjust path as necessary

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('Header Component', () => {
  const mockNavigate = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue({ pathname: '/' }); // Default location
  });

  it('renders the header with title and icon', () => {
    render(
      <AuthContext.Provider value={{ logout: mockLogout, user: null }}>
        <Header />
      </AuthContext.Provider>
    );

    const titleElement = screen.getByText(/Kiruna eXplorer/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('navigates to "/" when title is clicked', () => {
    render(
      <AuthContext.Provider value={{ logout: mockLogout, user: null }}>
        <Header />
      </AuthContext.Provider>
    );

    const titleElement = screen.getByText(/Kiruna eXplorer/i);
    fireEvent.click(titleElement);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders profile icon and navigates to login page when not logged in', () => {
    render(
      <AuthContext.Provider value={{ logout: mockLogout, user: null }}>
        <Header />
      </AuthContext.Provider>
    );

    const profileIcon = screen.getByTestId('profile-icon');
    expect(profileIcon).toBeInTheDocument();
    fireEvent.click(profileIcon);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('does not render profile icon when on login page', () => {
    useLocation.mockReturnValue({ pathname: '/login' });

    render(
      <AuthContext.Provider value={{ logout: mockLogout, user: null }}>
        <Header />
      </AuthContext.Provider>
    );

    const profileIcon = screen.queryByTestId('profile-icon');
    expect(profileIcon).toBeNull();
  });

  // it('renders logout button when user is logged in and not on login page', () => {
  //   useLocation.mockReturnValue({ pathname: '/' });

  //   render(
  //     <AuthContext.Provider
  //       value={{ logout: mockLogout, user: { name: 'resident' } }}
  //     >
  //       <Header />
  //     </AuthContext.Provider>
  //   );

  //   const logoutButton = screen.getByText(/Logout/i);
  //   expect(logoutButton).toBeInTheDocument();
  //   fireEvent.click(logoutButton);

  //   expect(mockLogout).toHaveBeenCalled();
  // });

  it('applies additional classes correctly', () => {
    render(
      <AuthContext.Provider value={{ logout: mockLogout, user: null }}>
        <Header className="test-class" />
      </AuthContext.Provider>
    );

    const navbarElement = screen.getByTestId('header-wrapper');
    expect(navbarElement).toHaveClass('custom-navbar');
    expect(navbarElement).toHaveClass('test-class');
  });

  // it('renders the logout icon when user is logged in', () => {
  //   render(
  //     <AuthContext.Provider
  //       value={{ logout: mockLogout, user: { name: 'resident' } }}
  //     >
  //       <Header />
  //     </AuthContext.Provider>
  //   );

  //   const logoutIcon = screen.getByText(/Logout/i);
  //   expect(logoutIcon).toBeInTheDocument();
  // });

  // it('handles the logout function correctly', async () => {
  //   render(
  //     <AuthContext.Provider
  //       value={{ logout: mockLogout, user: { name: 'resident' } }}
  //     >
  //       <Header />
  //     </AuthContext.Provider>
  //   );

  //   const logoutButton = screen.getByText(/Logout/i);
  //   fireEvent.click(logoutButton);

  //   // Check if the logout function was called
  //   expect(mockLogout).toHaveBeenCalled();
  //   expect(window.location.reload).toHaveBeenCalled();
  // });
});
