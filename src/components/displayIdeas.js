import React from 'react';
import { useState } from "react";
import { Card, Form, Badge, Button, ButtonGroup, Row } from 'react-bootstrap';




export const Ideas = (props) => {

const [ammount, setAmmount] = useState('');

return ( 
    <Row xs={1} md={3} className="g-4">
    {props.ideas.map((idea)=> (
    <Card key={idea.index} style={{ width: '28rem' }}>
      <Card.Body>
        <Card.Title>{idea.name}</Card.Title>
        <h6>
        Number of supports <Badge bg="secondary">{idea.noOfsupports}</Badge>
      </h6>
        
          <h4 className= "mb-3">{idea.description}</h4>
        
        <h5>
        Perfect Rating <Badge bg="secondary">{idea.perfect}</Badge>
      </h5>
      <h5>
        Good Rating <Badge bg="secondary">{idea.good}</Badge>
      </h5>
      <h5>
        Bad Rating <Badge bg="secondary">{idea.bad}</Badge>
      </h5>

     {props.walletAddress !== idea.owner &&(
      <ButtonGroup className = "mb-2">
        <Button onClick ={()=> props.ratePerfect(idea.index)}>Rate Perfect</Button>
        <Button onClick ={()=> props.rateGood(idea.index)}>Rate Good</Button>
        <Button onClick ={()=> props.rateBad(idea.index)}>Rate Bad</Button>
      </ButtonGroup>
)}

     {props.walletAddress !== idea.owner &&(
       <Form>
       <Form.Group className="mb-3" >
         <Form.Control type="number" placeholder="Enter Amount" onChange={(e) => setAmmount(e.target.value)} />
       </Form.Group>
       <Button variant="primary"  onClick={()=> props.supportIdea(idea.index, ammount)}>
         Support Idea
       </Button>
     </Form>
      )}


     {props.walletAddress === idea.owner &&(
      <Button onClick ={()=> props.removeIdea(idea.index)}>Remove this idea</Button>
      )}

      </Card.Body>
    </Card>
  ))}
</Row>




  
)};
