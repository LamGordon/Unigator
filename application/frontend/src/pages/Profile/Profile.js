import React, { Component } from 'react';
import {
    Dropdown,
    Button,
    Row,
    Col,
    Container,
    Jumbotron,
} from "react-bootstrap";
import axios from "axios";



const Profile = () => {
    const [userInfo, setUserInfo] = React.useState({});

    const handleProfile = (e) => {
        e.preventDefault();
            axios
                .get(`/profileInfo`, {})
                .then((res) => {
                    console.log(res);
                    console.log(res.data);
                    setUserInfo(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });

    }


        return (
            <Container>
                <h1 style={{ textAlign: 'center' }}>My Profile</h1>
                <Row>
                    <Col xs lg="5">
                        <Jumbotron>
                              <h1>{userInfo.name}</h1>
                            <img src="https://i.imgur.com/aoCg9r0.png" />
                            <a style={{ fontWeight: 'bold' }}>Share your profile: </a>
                            <a href="https://www.facebook.com">
                                <img src="https://i.imgur.com/vqfy6fF.png" />
                            </a>
                            <a href="https://www.instagram.com">
                                <img src="https://i.imgur.com/MIS2GGQ.png" />
                            </a>
                            <a href="https://www.twitter.com">
                                <img src="https://i.imgur.com/0Bf2pk4.png" />
                            </a>
                        </Jumbotron>
                    </Col>
                    <Col xs lg="7">
                        <Jumbotron>
                            <h4>User Information</h4>
                            {/*<p>Email: jsmith@mail.sfsu.edu{userInfo.email}</p>*/}
                            <p>School Year: {userInfo.year}</p>
                            <p>Points Accumulated: {userInfo.points}</p>
                            <p>Preferred Categories: Technology, Recreation</p>
                            <p>Description: Hi, I am JohnSmith123. I like pizza.</p>
                        </Jumbotron>
                        <Jumbotron>
                            <h4>My Events</h4>
                            <p></p>
                        </Jumbotron>
                    </Col>
                </Row>
            </Container>
        );

}

export default Profile;
