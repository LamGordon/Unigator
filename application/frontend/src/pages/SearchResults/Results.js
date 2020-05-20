import React from "react";
import {Card, Button, Row, Col, Container} from 'react-bootstrap';
import styled from "styled-components";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

const RenderEvents = styled.div`
  background-color: #f8f8f8;

  justify-content: space-evenly;
`;

class Results extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            events: [],
        };
    }
    componentDidMount() {
        const { events } = this.props.location.state;
        this.setState({events});
        console.log(events)
    }
    render() {
        const { events } = this.state;
        //DATA NOT GETTING FETCHED HERE
        console.log('------------------------------------');
        console.log("Event : ", events);
        console.log('------------------------------------');
        return (
        <RenderEvents>
            <Container>
            <Row className="justify-content-md-center">
                {events.map((item) => (
                <Card style={{ width: "18rem" }}>
                    <Card.Img
                    variant="top"
                    src="https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/uploads/2017/12/22223742/Events-1200x630.jpg"
                    />
                    <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        {item.location}
                    </Card.Subtitle>
                    <Card.Text>{item.desc}</Card.Text>
                    <Button variant="link">Share</Button>
                    <Link to="/eventdetail">
                        <Button variant="link">Learn More</Button>
                    </Link>
                    </Card.Body>
                </Card>
                ))}
            </Row>
            </Container>
        </RenderEvents>
        );
    }
}

export default Results;