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
import styled from "styled-components";

class EventDetail extends Component {
    render() {
        return (
            <Container>
                <h1 style={{textAlign: 'center'}}>Event Details</h1>
                <Row>
                    <Col xs lg="5">
                        <Jumbotron>
                            <h1>Mobile dev 101</h1>
                            <p style={{fontWeight: 'bold'}}>
                                4/7/2020 &emsp; 9:20 AM &emsp; Towers Conference Center
                            </p>
                            <Row>
                                <Col sm={8}>
                                    <Button>Save</Button>
                                    <Button>Share</Button>
                                </Col>
                                <Col>
                                    <Button size="lg">RSVP</Button>
                                </Col>
                            </Row>
                        </Jumbotron>
                        <Jumbotron>
                            <h3>Event Description</h3>
                            <p>Lets learn how to create a mobile app</p>
                        </Jumbotron>
                    </Col>
                    <Col xs lg="7">
                        <Carousel>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://qph.fs.quoracdn.net/main-qimg-9576272f4a2fe3344b1a774db1d7650b-c"
                                    alt="First slide"
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://www.iqvis.com/wp-content/uploads/2017/04/Cross-platform-mobile-development.jpg"
                                    alt="First slide"
                                />
                            </Carousel.Item>
                        </Carousel>
                    </Col>
                </Row>
                {/*<h3>Event Description</h3>*/}
                {/*<p>Lets learn how to create a mobile app</p>*/}
            </Container>
        );
    }
}

export default EventDetail;

