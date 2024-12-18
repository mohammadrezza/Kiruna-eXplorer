import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MunicipalDocuments from '../../../src/components/DocumentsMap/MunicipalDocuments';
import { MemoryRouter } from 'react-router-dom';

// Mock data
const mockDocuments = [
  {
    id: "1",
    title: 'Municipal Document 1',
    type: 'Type A',
    stakeholders: 'Stakeholder A',
    issuanceDate: '2024-01-01',
  },
  {
    id:'2',
    title: 'Municipal Document 2',
    type: 'Type B',
    stakeholders: 'Stakeholder B',
    issuanceDate: '2024-02-01',
  },
];

const mockUser = {
  username: 'Test User',
  role: 'test'
};

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockToggleList = jest.fn();

describe('MunicipalDocuments Component', () => {
  it('renders the title when there are municipal documents', () => {
    render(
      <MunicipalDocuments
        municipalDocuments={mockDocuments}
        showDocuments={false}
        toggleList={mockToggleList}
        user={null}
      />,
      { wrapper: MemoryRouter }
    );

    expect(
      screen.getByText(/There are documents for the whole municipal./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Show them/i)).toBeInTheDocument();
  });

  it('calls toggleList when the "Show them" or "Hide" text is clicked', () => {
    render(
      <MunicipalDocuments
        municipalDocuments={mockDocuments}
        showDocuments={false}
        toggleList={mockToggleList}
        user={null}
      />,
      { wrapper: MemoryRouter }
    );

    const toggleButton = screen.getByText(/Show them/i);
    fireEvent.click(toggleButton);
    expect(mockToggleList).toHaveBeenCalledTimes(1);
  });

  it('displays the list of municipal documents when showDocuments is true', () => {
    render(
      <MunicipalDocuments
        municipalDocuments={mockDocuments}
        showDocuments={true}
        toggleList={mockToggleList}
        user={null}
      />,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText('Municipal Document 1')).toBeInTheDocument();
    expect(screen.getByText('Municipal Document 2')).toBeInTheDocument();
  });

  it('renders "Open the document" link for each document if user is logged in', () => {
    render(
      <MunicipalDocuments
        municipalDocuments={mockDocuments}
        showDocuments={true}
        toggleList={mockToggleList}
        user={mockUser}
      />,
      { wrapper: MemoryRouter }
    );

    const openLinks = screen.getAllByText(/Open the document/i);
    expect(openLinks).toHaveLength(2); // One for each document
  });

  it('calls handleDocumentClick when "Open the document" link is clicked', () => {
    render(
      <MunicipalDocuments
        municipalDocuments={mockDocuments}
        showDocuments={true}
        toggleList={mockToggleList}
        user={mockUser}
      />,
      { wrapper: MemoryRouter }
    );

    const openLinks = screen.getAllByText(/Open the document/i);
    fireEvent.click(openLinks[0]); // Simulate clicking the first link
    expect(mockNavigate).toHaveBeenCalledWith('/document/view/1');

    fireEvent.click(openLinks[1]); // Simulate clicking the second link
    expect(mockNavigate).toHaveBeenCalledWith('/document/view/2');
  });

  it('does not render documents if the list is empty', () => {
    render(
      <MunicipalDocuments
        municipalDocuments={[]}
        showDocuments={true}
        toggleList={mockToggleList}
        user={null}
      />,
      { wrapper: MemoryRouter }
    );

    expect(screen.queryByText(/Municipal Document/i)).not.toBeInTheDocument();
  });
});
