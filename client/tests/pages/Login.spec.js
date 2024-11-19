import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../src/pages/Login';
import { AuthContext, useAuth } from '../../src/layouts/AuthContext'; // Import your AuthContext
import { useParams, useNavigate } from 'react-router-dom';




jest.mock('../../src/layouts/AuthContext', () => ({
    ...jest.requireActual('../../src/layouts/AuthContext'), // Se vuoi mantenere altre funzioni esistenti
    useAuth: jest.fn()
  }));

  jest.mock('../../src/services/API.mjs', () => ({
    login: jest.fn()
  }));

  describe('Login page',() =>{
    const mockLogin = jest.fn(); // Funzione mock per login
    const mockNavigate = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      useNavigate.mockReturnValue(mockNavigate);
    });

    it('should render the login page correctly',()=>{

        const mockContextValue = {
            login: mockLogin,
            user: null, // Assicurati che l'utente non sia loggato
          };

          useAuth.mockReturnValue(mockContextValue);

        render(<AuthContext.Provider value={mockContextValue}>
            <Login />
          </AuthContext.Provider>)



        expect(screen.getAllByText('Login')).toHaveLength(2)
        const usernameField = screen.getByPlaceholderText(/Enter your username/i);
        expect(usernameField).toBeInTheDocument();

        const passwordField = screen.getByPlaceholderText(/Enter your password/i);
        expect(passwordField).toBeInTheDocument();
    })


    it('should submit the login correctly',async()=>{
        const mockContextValue = {
            login: mockLogin,
            user: null, // Assicurati che l'utente non sia loggato
          };

          useAuth.mockReturnValue(mockContextValue);

        render(<AuthContext.Provider value={mockContextValue}>
            <Login />
          </AuthContext.Provider>)

        await waitFor(() =>{
            fireEvent.change(screen.getByPlaceholderText(/Enter your username/i),{ target: { value: 'urban_planner' } })
            fireEvent.change(screen.getByPlaceholderText(/Enter your password/i),{ target: { value: '708090' } })
        })

        fireEvent.submit(screen.getByTestId('mocked-form'));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('urban_planner','708090');
          });
    })

    it('should retrieve error if param missing',async () =>{
        const mockContextValue = {
            login: mockLogin,
            user: null, 
          };

          useAuth.mockReturnValue(mockContextValue);

        render(<AuthContext.Provider value={mockContextValue}>
            <Login />
          </AuthContext.Provider>)

        await waitFor(() =>{
            fireEvent.change(screen.getByPlaceholderText(/Enter your username/i),{ target: { value: '' } })
            fireEvent.change(screen.getByPlaceholderText(/Enter your password/i),{ target: { value: '' } })
        })

        fireEvent.click(screen.getByTestId('submit-button'));

        await waitFor(() => {
            expect(screen.getByText('Please provide a valid username and password.')).toBeInTheDocument()
          });
    })

    it('should retrieve error if user/pass wrong',async () =>{
        const mockLoginWrong = jest.fn().mockImplementation(() => {
            throw new Error('Invalid credentials');
          });
        const mockContextValue = {
            login: mockLoginWrong,
            user: null, 
          };

          useAuth.mockReturnValue(mockContextValue);

        render(<AuthContext.Provider value={mockContextValue}>
            <Login />
          </AuthContext.Provider>)

        await waitFor(() =>{
            fireEvent.change(screen.getByPlaceholderText(/Enter your username/i),{ target: { value: 'urban_planner' } })
            fireEvent.change(screen.getByPlaceholderText(/Enter your password/i),{ target: { value: 'wrong' } })
        })

        fireEvent.click(screen.getByTestId('submit-button'));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
          });
    })
  })