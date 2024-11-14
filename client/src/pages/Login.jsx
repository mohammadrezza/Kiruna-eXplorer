import React, { useState } from 'react';
import { Form, Button, InputGroup, Table, FormControl } from 'react-bootstrap';
import '../style/Login.css';
import { Alert } from 'react-bootstrap';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  

  const handleSubmit = (event) => {
    event.preventDefault();
    props.setMessage('');

    let valid = true;
    let msg = '';

    if (!username || username === '') {
        valid = false;
        msg += 'Please insert a valid username\r\n'
    }

    if (!password || password === '') {
        valid = false;
        msg += 'Please insert a valid password\r\n'
    }

    if (valid) {
        props.login(username, password);
    }
    else {
        props.setMessage(msg);
    }
}

  return (
    <div className="login-wrapper">
      <div className='login-block'>
        <h3>Login</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='form-group'  controlId="username">
            <Form.Label>username</Form.Label>
            <Form.Control 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}/>
          </Form.Group>
          <Form.Group className='form-group'  controlId="password">
            <Form.Label>password</Form.Label>
            <Form.Control 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}/>
          </Form.Group>
          <Button type="submit">Login</Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
