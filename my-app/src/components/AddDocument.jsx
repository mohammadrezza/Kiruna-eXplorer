import React from 'react';
import { Form, Button, Row, Col, InputGroup, Table } from 'react-bootstrap';
import '../assets/style/AddDocumentCSS.css'

function AddDocument() {
  return  (
    <div className="form-container mt-5">
      <h2>New Document</h2>
      
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-4" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" required />
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="stakeholder">
              <Form.Label>Stakeholder</Form.Label>
              <Form.Control type="text" placeholder="Enter stakeholder" />
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="scale">
              <Form.Label>Scale</Form.Label>
              <Form.Control type="text" placeholder="Enter scale" />
            </Form.Group>

            <Form.Group className="mb-4" controlId="issuanceDate">
              <Form.Label>Issuance Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>

            <Form.Group className="mb-4" controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Select>
                <option>Select type</option>
                <option>Type 1</option>
                <option>Type 2</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4" controlId="language">
              <Form.Label>Language</Form.Label>
              <Form.Select>
                <option>Select language</option>
                <option>English</option>
                <option>Italian</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4" controlId="coordinates">
              <Form.Label>Coordinates</Form.Label>
              <InputGroup>
                <Form.Control type="text" placeholder="Enter coordinates" />
                <Button className="show-map">Show on Map</Button>
              </InputGroup>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={15} placeholder="Enter description" />
            </Form.Group>
          </Col>
        </Row>

        {/* Sezione Connections con layout per il pulsante + Add */}
        <div className="connections-section">
          <h5 className="mt-4">Connections</h5>
          <div className="table-container">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th></th>
                  <th>Document Title</th>
                  <th>Stakeholder</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><Form.Check /></td>
                  <td>Document Title 1</td>
                  <td>Stakeholder 1</td>
                  <td>24/12/2020</td>
                  <td>...</td>
                </tr>
                <tr>
                  <td><Form.Check /></td>
                  <td>Document Title 2</td>
                  <td>Stakeholder 2</td>
                  <td>25/12/2020</td>
                  <td>...</td>
                </tr>
              </tbody>
            </Table>
            <Button className="add-button">+ Add</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}


export default AddDocument;