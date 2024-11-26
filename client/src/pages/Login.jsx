import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { AuthContext, useAuth } from '../layouts/AuthContext'; // Import AuthContext
import '../style/Login.css';

function Login() {
  const { login } = useContext(AuthContext); // Access login function from AuthContext
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth(); 

  if (user) {
    return <Navigate to="/" />;
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    
    if (!username || !password) {
      setError('Please provide a valid username and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-block">
        <h3>Login</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </Form.Group>
          <Form.Group className="form-group" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </Form.Group>
          <Button type="submit" disabled={isLoading} data-testid='submit-button'>
            {isLoading ? 'Logging in...' : 'LOGIN'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
