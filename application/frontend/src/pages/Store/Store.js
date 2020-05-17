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
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const RenderPointShop = styled.div`
	background-color: #f8f8f8;

	justify-content: space-evenly;
`;

class Store extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pointshop: [],
        };
        this.getPointsShop = this.getPointsShop.bind(this);
    }

    getPointsShop(){    //currently returns nothing
        const { pointshop } = this.state;

        const config = {
            headers: { 'Content-Type': 'text/plain' }
        }

        axios
            .get(`/pointshop`, config)
            .then((res) => {
                this.setState({ pointshop: res.data });
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        const { pointshop } = this.state;
        this.getPointsShop();
        return (
            <RenderPointShop>
                <Container>
                    <Row className="justify-content-md-center">
                        {pointshop.map((item) => (
                            <Card style={{ width: "18rem" }}>
                                <Card.Img
                                    variant="top"
                                    src="https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/uploads/2017/12/22223742/Events-1200x630.jpg"
                                />
                                <Card.Body>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Button>Purchase</Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </Row>
                </Container>
            </RenderPointShop>
        );
    }
}

export default Store;
