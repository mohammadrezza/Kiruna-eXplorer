import '../style/DocumentsList.css';
import React, { useState,useEffect } from 'react';
import {Button, Row, Col,ListGroup } from 'react-bootstrap';
import API from '../services/API.mjs';
import * as dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';
import { PiFileMagnifyingGlassLight } from 'react-icons/pi';
import DocumentDetailsModal from '../components/DocumentDetailsModal';


function List(props){


    

    const handleCloseModal = () => {
        props.handleShowModal(false);
        props.handleCurrentDocument(null);
      };

      
      


    return(<div className="document-list">
        <ListGroup className='relatedDocs'>
          <ListGroup.Item className='relatedDocs-header'>
            <Row>
              <Col md={3}>Title</Col>
              <Col md={3}>Stakeholders</Col>
              <Col md={2}>Type</Col>
              <Col md={1}>Connections</Col>
              <Col md={2}>Issuance Date</Col>
            </Row>
          </ListGroup.Item>
          {!props.loading && props.list.map((doc, num) => (
            <ListGroup.Item 
              key={doc.id}  
              >
              <Row className="align-items-center">
                <Col md={3} className='doc-title' onClick={() => props.handleDocumentClick(doc.id)}>{doc.title}</Col>
                <Col md={3}> 
                {doc.stakeholders.map((s, index) => (<span
                        key={index}
                        className={`stakeholder-badge stakeholder-${s.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {s}
                      </span>
                ))}
                </Col>
                <Col md={2}>{doc.type}</Col>
                <Col md={1}>{doc.connections}</Col>
                <Col md={2}>{dayjs(doc.issuanceDate).format('DD/MM/YYYY')}</Col>
                <Col>
                  <PiFileMagnifyingGlassLight 
                    className='filesymbol' 
                    size={22} 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      props.handleIconClick(doc);
                    }}>
                  </PiFileMagnifyingGlassLight>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <DocumentDetailsModal
          show={props.showModal}
          onHide={handleCloseModal}
          document={props.currentDocument}
            />
      </div>)
}

export default List