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

class Profile extends Component {

    render() {
        return (
            <Container>
                <h1 style={{textAlign: 'center'}}>My Profile</h1>
                <Row>
                    <Col xs lg="5">
                        <Jumbotron>
                            <h1>Welcome, JohnSmith123!</h1>
                            <img src="https://i.imgur.com/aoCg9r0.png"/>
                            <a style={{fontWeight: 'bold'}}>Share your profile: </a>
                            <a href="https://www.facebook.com">
                                <img src="https://i.imgur.com/vqfy6fF.png"/>
                            </a>
                            <a href="https://www.instagram.com">
                                <img src="https://i.imgur.com/MIS2GGQ.png"/>
                            </a>
                            <a href="https://www.twitter.com">
                                <img src="https://i.imgur.com/0Bf2pk4.png"/>
                            </a>
                        </Jumbotron>
                    </Col>
                    <Col xs lg="7">
                        <Jumbotron>
                            <h4>User Information</h4>
                            <p>Username: JohnSmith123</p>
                            <p>Email: jsmith@mail.sfsu.edu</p>
                            <p>School Year: Class of 2021</p>
                            <p>Points Accumulated: 1300</p>
                            <p>Preferred Categories: Technology, Recreation</p>
                            <p>Description: Hi, I am JohnSmith123. I like pizza.</p>
                        </Jumbotron>
                        <Jumbotron>
                            <h4>My Events</h4>
                        </Jumbotron>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Profile;
