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
import axios from "axios";
import styled from "styled-components";

const EventDetail = () => {
    const [eventDetail, setEventDetail] = React.useState({});
    const [rsvp, setRsvp] = React.useState({});

    const handleEventDetail = (e) => {
        e.preventDefault();
        axios
            .get(`/eventDetailInfo`, {})
            .then((res) => {
                console.log(res);
                console.log(res.data);
                setEventDetail(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

    }

    const handleRsvp = (e) => {
        e.preventDefault();
        axios
            .get(`/rsvp`, {})
            .then((res) => {
                console.log(res);
                console.log(res.data);
                setRsvp(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

    }


        return (
            <Container>
                <h1 style={{textAlign: 'center'}}>Event Details</h1>
                <Row>
                    <Col xs lg="5">
                        <Jumbotron>
                            <h1>{eventDetail.name}PLACEHOLDER</h1>
                            <p style={{fontWeight: 'bold'}}>
                               {eventDetail.date} PLACEHOLDER&emsp; {eventDetail.time}PLACEHOLDER &emsp; {eventDetail.location}PLACEHOLDER
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
                            <p>{eventDetail.desc}PLACEHOLDER</p>
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

export default EventDetail;

