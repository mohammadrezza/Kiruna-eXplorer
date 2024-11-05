import React from 'react';
const MockedComponent = (props) => <div {...props}>{props.children}</div>;
const MockedForm = ({ onSubmit, children }) => (
    <form onSubmit={onSubmit} data-testid="mocked-form">
      {children}
    </form>
  );
MockedForm.Label = MockedComponent;
MockedForm.Select = ({ value, onChange, ...props }) => (
    <select {...props} value={value} onChange={onChange}>
      {props.children}
    </select>
  );
MockedForm.Control = ({ isInvalid, ...props }) => (
  <div>
    <input {...props} />
    {isInvalid && <div className="invalid-feedback">Invalid input</div>}
  </div>
);

MockedForm.Control.Feedback = ({ children }) => (
  <div className="invalid-feedback">{children}</div>
);

// Mocked Form.Group that does not pass down controlId
MockedForm.Group = ({ children, controlId, ...props }) => (
  <div {...props}>{children}</div>
);

const MockedButton = ({ type, children, ...props }) => (
    <button type={type} {...props}>
      {children}
    </button>
  );

export const Navbar = MockedComponent;
export const Button = MockedButton;
export const Form = MockedForm;
export const FormControl = MockedComponent;
export const FormLabel = MockedComponent;
export const Container = MockedComponent;
export const Row = MockedComponent;
export const Col = MockedComponent;
export const Modal = ({ children }) => <div>{children}</div>;
export const ListGroup = MockedComponent
export const InputGroup = MockedComponent;
export const Table = MockedComponent;