import React from 'react';
import { Form, Button, Row, Col, InputGroup, Table, FormControl } from 'react-bootstrap';
import '../assets/style/AddDocumentCSS.css'
import { useState } from 'react';

function AddDocument() {

  const [title,setTitle] = useState('');
  const [stakeholder,setStakeholder] = useState('');
  const [scale,setScale] = useState('');
  const [issuanceDate,setIssuanceDate] = useState();
  const [type,setType] = useState('');
  const [language,setLanguage] = useState('');
  const [description,setDescription] = useState('');



  const handleSubmit = () =>{
    
  }
  
  return  (
    <div className="form-container">
      <h2>New Document</h2>
      
      <Form onSubmit={handleSubmit}>
        <div className='top-form'>
        <Row>
          <Col className='col-form'>
            <Form.Group className='form-group'  controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" required minLength={2} value={title} onChange={(event) => setTitle(event.target.value)}/>
            </Form.Group>
            
            <Form.Group className='form-group'  controlId="stakeholder">
              <Form.Label>Stakeholder</Form.Label>
              <Form.Control type="text" placeholder="Enter stakeholder" required minLength={2} value={stakeholder} onChange={(event) => setStakeholder(event.target.value)}/>
            </Form.Group>
            
            <Form.Group className='form-group'  controlId="scale">
              <Form.Label>Scale</Form.Label>
              <Form.Control type="text" placeholder="Enter scale" required minLength={2} value={scale} onChange={(event) => setScale(event.target.value)}/>
            </Form.Group>

            <Form.Group className='form-group'  controlId="issuanceDate">
              <Form.Label>Issuance Date</Form.Label>
              <Form.Control type="date" required minLength={2} value={issuanceDate} onChange={(event) => setIssuanceDate(event.target.value)}/>
            </Form.Group>

            <Form.Group className='form-group' controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Select required value={type} onChange={(event) => setType(event.target.value)}>
                <option>Select type</option>
                <option>Type 1</option>
                <option>Type 2</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='form-group' controlId="language">
              <Form.Label>Language</Form.Label>
              <Form.Select required value={language} onChange={(event) => setLanguage(event.target.value)}>
                <option>Select language</option>
                <option>English</option>
                <option>Italian</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col className='col-form'>
            <Form.Group  className='form-group' controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" placeholder="Enter description" required value={description} onChange={(event) => setDescription(event.target.value)}/>
            </Form.Group>
          </Col>
        </Row>
        </div>
        <Button className="add-button" type='submit'>+Add</Button>
      </Form>
    </div>
  );
}


export default AddDocument;