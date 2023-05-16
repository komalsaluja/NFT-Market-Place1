import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import dataRef from "../pages/dashboard.js";

function Card1(props) {
  const price = props.price;
  const name = props.name;
  const description = props.description;
  const imageuri = props.imageuri;
  const listed = dataRef.listed;
  const nonListed = dataRef.nonListed;
  return (
    <div>
      <Card
        style={{ width: "18rem", margin: "10px", border: "2px solid gold" }}
      >
        <Card.Img variant="top" src={imageuri} alt="Image" />
        <Card.Body>
          <Card.Title>Name : {name}</Card.Title>
          <hr />
          <Card.Text>Description : {description}</Card.Text>
          <hr />
          <Card.Text>Price : {price}</Card.Text>
          <hr />
        </Card.Body>
        <Card.Body>
          <Card.Link href="#" className="btn btn-primary">
            Card Link
          </Card.Link>
          <Card.Link href="#" className="btn btn-warning">
            Another Link
          </Card.Link>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Card1;
