import React, { Component } from 'react';
import {
    Dropdown,
    Button,
    Row,
    Col,
    Container,
    Card,
    Modal,
    Form,
    Carousel,
    Jumbotron,
} from "react-bootstrap";

class Store extends Component {

    render() {
        return (
            <Container>
                <h1 style={{textAlign: 'center'}}>Unigator Store</h1>
                <p>Your Points: 1300</p>
                <h4>Text Fonts - Change the font style on your profile</h4>
                <Row>
                    <Col>
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src="" />
                            <Card.Body>
                                <Card.Title style={{fontFamily: 'Lucida Console'}}>Lucida Console</Card.Title>
                                <p>Price: 200 Points</p>
                                <Button variant="primary">Purchase</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src="" />
                            <Card.Body>
                                <Card.Title style={{fontFamily: 'Impact'}}>Impact</Card.Title>
                                <p>Price: 300 Points</p>
                                <Button variant="primary">Purchase</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src="" />
                            <Card.Body>
                                <Card.Title style={{fontFamily: 'Comic Sans MS'}}>Comic Sans MS</Card.Title>
                                <p>Price: 400 Points</p>
                                <Button variant="primary">Purchase</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src="" />
                            <Card.Body>
                                <Card.Title style={{fontFamily: 'Courier New'}}>Courier New</Card.Title>
                                <p>Price: 200 Points</p>
                                <Button variant="primary">Purchase</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src="" />
                            <Card.Body>
                                <Card.Title style={{fontFamily: 'Arial Black'}}>Arial Black</Card.Title>
                                <p>Price: 300 Points</p>
                                <Button variant="primary">Purchase</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src="" />
                            <Card.Body>
                                <Card.Title style={{fontFamily: 'Georgia'}}>Georgia</Card.Title>
                                <p>Price: 400 Points</p>
                                <Button variant="primary">Purchase</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Store;

