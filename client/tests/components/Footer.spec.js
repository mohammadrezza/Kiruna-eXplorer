import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../src/components/Footer';
import { AuthContext } from '../../src/layouts/AuthContext'; // Adjust path as necessary

describe('Footer Component', () => {
  
  test('renders footer with correct content', () => {
    render(
    <AuthContext.Provider value={{ user: null }}>
    <Footer />
    </AuthContext.Provider>);

    const explorerText = screen.getByText(/Kiruna Explorer/i);
    expect(explorerText).toBeInTheDocument();

    const groupText = screen.getByText(/Done by GROUP 11/i);
    expect(groupText).toBeInTheDocument();
  });
});
