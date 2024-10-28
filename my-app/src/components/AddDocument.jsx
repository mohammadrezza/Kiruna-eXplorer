import React from 'react';
import { Form, Button, Row, Col, InputGroup, Table } from 'react-bootstrap';
import '../assets/style/AddDocumentCSS.css'

function AddDocument() {
  return  (
    <div className="form-container">
      <h2>New Document</h2>
      
      <Form>
        <div className='top-form'>
        <Row>
          <Col className='col-form'>
            <Form.Group className='form-group'  controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" required />
            </Form.Group>
            
            <Form.Group className='form-group'  controlId="stakeholder">
              <Form.Label>Stakeholder</Form.Label>
              <Form.Control type="text" placeholder="Enter stakeholder" />
            </Form.Group>
            
            <Form.Group className='form-group'  controlId="scale">
              <Form.Label>Scale</Form.Label>
              <Form.Control type="text" placeholder="Enter scale" />
            </Form.Group>

            <Form.Group className='form-group'  controlId="issuanceDate">
              <Form.Label>Issuance Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>

            <Form.Group className='form-group' controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Select>
                <option>Select type</option>
                <option>Type 1</option>
                <option>Type 2</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='form-group' controlId="language">
              <Form.Label>Language</Form.Label>
              <Form.Select>
                <option>Select language</option>
                <option>English</option>
                <option>Italian</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col className='col-form'>
            <Form.Group  className='form-group' controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={15} placeholder="Enter description" />
            </Form.Group>
          </Col>
        </Row>
        </div>
      </Form>
    </div>
  );
}


export default AddDocument;