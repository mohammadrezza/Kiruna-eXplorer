import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import MapAreaSelector from "@/components/CreateDocument/MapAreaSelector"

const AreaForm = ({coordinates, mode, edit}) => {
  return (
  <Row>
    <Row>
      Area
    </Row>
    <Row>
      <MapAreaSelector></MapAreaSelector>
    </Row>
  </Row>
)};

export default AreaForm;
