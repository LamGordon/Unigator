import React, { useState } from "react";
import axios from "axios";
import {
  Dropdown,
  Button,
  Row,
  Container,
  Card,
} from "react-bootstrap";
import styled from "styled-components";

const is_production = process.env.REACT_APP_IS_PRODUCTION;
//const base_url = is_production ? "http://ec2-54-193-95-217.us-west-1.compute.amazonaws.com:3003" : "http://localhost:3003";
axios.defaults.baseURL = "http://54.193.95.217:3003";

const Form = styled.form`
  display: flex;
  max-width: 50%;
  margin: 0 auto;
  & .submit-btn {
    margin-left: auto;
  }

  & .my-dropdown {
    margin-right: 10px;
  }
`;
const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;
const Head = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 25px;
  & button {
    margin: 5px;
  }
`;
const Search = styled.label`
  margin-bottom: 0;
  display: flex;
  align-items: center;
  font-size: 20px;
  width: 600px;
  & input {
    flex: 1;
    border: 2px solid black;
    font-size: 18px;
    margin-left: 7px;
    padding: 2px 2px;
  }
`;
const Dropdowns = styled.div`
  display: flex;
  margin: 5px auto;
  max-width: 50%;
`;

const RenderEvents = styled.div`
	background-color: #f8f8f8;

	justify-content: space-evenly;
`;

class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchEvent: "",
      category: "Categories",
      events: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    const { searchEvent, category } = this.state;

    e.preventDefault();
    if (category === "Categories") {
      axios
        .post(`/events`, { name: searchEvent })
        .then((res) => {
          this.setState({ events: res.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (category !== "Categories") {
      console.log("Category:", category, "Name:", searchEvent);
      axios
        .get(`/events/${category}`, {
          params: {
            name: searchEvent,
          },
        })
        .then((res) => {
          this.setState({ events: res.data });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  onClickHandler = (category) => {
    const value = category.target.getAttribute("value");
    this.setState({ category: value });
  };

  render() {
    console.log("------------------------------------");
    console.log("State: ", this.state);
    console.log("------------------------------------");
    const { category, events } = this.state;

    return (
      <Root>
        <Head>
          <h1>UniGator</h1>
          <div>
            <Form onSubmit={this.handleSubmit}>
              <Search>
                Search:
                <input
                  type="text"
                  name="searchEvent"
                  onChange={this.handleInput}
                />
              </Search>
              <Button className="submit-btn" variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <Dropdowns>
              <Dropdown className="my-dropdown">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {category}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item value='Categories' onClick={this.onClickHandler}>
                    None
                  </Dropdown.Item>
                  <Dropdown.Item value='Technology' onClick={this.onClickHandler}>
                    Technology
                  </Dropdown.Item>
                  <Dropdown.Item value='Education' onClick={this.onClickHandler}>
                    Education
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Dropdowns>
          </div>
          <div className="fancy-btn">
            <Button variant="outline-primary">Log in</Button>
            <Button variant="outline-primary">Sign Up</Button>
          </div>
        </Head>
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
                    <Button variant="link">Learn More</Button>
                  </Card.Body>
                </Card>
              ))}
            </Row>
          </Container>
        </RenderEvents>
      </Root>
    );
  }
}

export default Events;
