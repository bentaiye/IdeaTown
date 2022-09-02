import React, { useState } from "react";

import { Button, Modal, Form, FloatingLabel, Nav, Container, Navbar } from "react-bootstrap";

const Home = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");


  const isFormFilled = () => name && description;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
<>
    <Navbar>
      <Container>
        <Navbar.Brand href="#home">Idea Town</Navbar.Brand>
        <Navbar.Toggle />
        <Nav className="me-auto">
        <Nav.Link href="#home">Your Balance is {props.cUSDBalance}cUSD</Nav.Link>
       
          </Nav>
        <Navbar.Collapse className="justify-content-end">
        
        <Button
        onClick={handleShow}
        variant="primary"
        
      >
        <h4> Add Idea </h4>
      </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    
      
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Idea</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputName"
              label="Name of Idea"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="name"
              />
            </FloatingLabel>
            
            <FloatingLabel
              controlId="inputDescription"
              label="Description of Idea"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            
           
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              props.addIdea( 
                name,
                description,
              );
              handleClose();
            }}
          >
            Add Idea
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Home;
