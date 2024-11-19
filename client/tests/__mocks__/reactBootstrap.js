import React from 'react';
const MockedComponent = (props) => <div {...props}>{props.children}</div>;
const MockedForm = ({ onSubmit, children }) => (
    <form onSubmit={onSubmit} data-testid="mocked-form">
      {children}
    </form>
  );
MockedForm.Label = MockedComponent;
MockedForm.Control = ({ isInvalid, ...props }) => (
  <div>
    <input {...props} />
    {isInvalid && <div className="invalid-feedback">Invalid input</div>}
  </div>
);

MockedForm.Control.Feedback = ({ children }) => (
  <div className="invalid-feedback">{children}</div>
);

MockedForm.Group = ({ children, controlId, ...props }) => (
  <div {...props}>{children}</div>
);

MockedForm.Check = ({ children, controlId, disabled, checked, onChange, ...props }) => (
  <div {...props}>
    <input
      type="checkbox"
      id={controlId}
      disabled={disabled}
      checked={checked}
      onChange={onChange}
    />
    <label htmlFor={controlId}>{children}</label>
  </div>
);

const MockedButton = ({ type, children, ...props }) => (
    <button type={type} {...props}>
      {children}
    </button>
  );

  const MockedAlert = ({ variant, children, ...props }) => (
    <div className={`alert alert-${variant}`} role="alert" {...props}>
      {children}
    </div>
  );

export const ListGroup = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);
ListGroup.Item = MockedComponent;

export const Navbar = MockedComponent;
export const Button = MockedButton;
export const Form = MockedForm;
export const FormControl = MockedComponent;
export const FormLabel = MockedComponent;
export const Container = MockedComponent;
export const Row = MockedComponent;
export const Col = MockedComponent;
export const Modal = ({ children }) => <div>{children}</div>;
export const InputGroup = MockedComponent;
export const Table = MockedComponent;
export const Alert = MockedAlert;