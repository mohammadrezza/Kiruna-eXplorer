import React from 'react';
import { Row } from 'react-bootstrap';
import MapAreaSelector from "@/components/CreateDocument/MapAreaSelector"

const AreaForm = ({area, existList, mode, edit, onAreaChange}) => {
  return (
  <Row>
    <Row>
      <MapAreaSelector mode={mode} edit={edit} area={area} existList={existList} onAreaChange={onAreaChange}></MapAreaSelector>
    </Row>
  </Row>
)};

export default AreaForm;
