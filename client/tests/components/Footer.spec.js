import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../src/components/Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation((message) => {
      if (!message.includes('validateDOMNesting')) {
        console.error(message);
      }
    });
  });
  test('renders footer with correct content', () => {
    render(<Footer />);

    const explorerText = screen.getByText(/Kiruna Explorer/i);
    expect(explorerText).toBeInTheDocument();

    const groupText = screen.getByText(/Done by GROUP 11/i);
    expect(groupText).toBeInTheDocument();
  });
});
