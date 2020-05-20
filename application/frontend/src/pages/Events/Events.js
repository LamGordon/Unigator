import React, { useState } from "react";
import axios from "axios";
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
  Image,
} from "react-bootstrap";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import styled from "styled-components";
import gatorImage from '../../assets/gatorImage.png';
import Results from '../SearchResults/Results';

const is_production = process.env.REACT_APP_IS_PRODUCTION;
//const base_url = is_production ? "http://ec2-54-193-95-217.us-west-1.compute.amazonaws.com:3003" : "http://localhost:3003";
// axios.defaults.baseURL = "http://13.52.231.107:3003";


const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;


class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      carouselShow: true,
      containerShow: true,
    };
  }

  renderCarousel = () => {
    const { carouselShow } = this.state;
    return (
      <Container>
        {carouselShow
          ? <div>
            <h1 style={{ textAlign: 'center' }}>Featured Events</h1>
            <Carousel>
              <Carousel.Item>
                <Link to="/eventdetail">
                  <img
                    className="d-block w-100"
                    src="https://qph.fs.quoracdn.net/main-qimg-9576272f4a2fe3344b1a774db1d7650b-c"
                    alt="First slide"
                  />
                </Link>
                <Carousel.Caption>
                  <h3 style={{ textShadow: '2px 2px #000000' }}>Mobile dev 101</h3>
                  <p style={{ textShadow: '2px 2px #000000' }}>Thornton Hall</p>
                  <p style={{ textShadow: '2px 2px #000000' }}>Lets learn how to create a mobile app</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <Link to="/eventdetail">
                  <img
                    className="d-block w-100"
                    src="https://www.nextavenue.org/wp-content/uploads/2017/05/My-Foray-Into-Watercolors_64633113.jpg"
                    alt="Third slide"
                  />
                </Link>
                <Carousel.Caption>
                  <h3 style={{ textShadow: '2px 2px #000000' }}>Art 101</h3>
                  <p style={{ textShadow: '2px 2px #000000' }}>Cesar Chavez Building</p>
                  <p style={{ textShadow: '2px 2px #000000' }}>Let learn how to use water color</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <Link to="/eventdetail">
                  <img
                    className="d-block w-100"
                    src="https://www.ed2go.com/binaries/content/gallery/ed2go/products/17428.jpg"
                    alt="Third slide"
                  />
                </Link>
                <Carousel.Caption>
                  <h3 style={{ textShadow: '2px 2px #000000' }}>Resume 101</h3>
                  <p style={{ textShadow: '2px 2px #000000' }}>J. Paul Leonard Library</p>
                  <p style={{ textShadow: '2px 2px #000000' }}>Resume 101</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>
          : null
        }
      </Container>
    )
  }

  renderContainer = () => {
    const {containerShow} = this.state;
    return (
        <Container>
          {containerShow
              ?
              <Row>
                <Col>
                  <Jumbotron style={{padding: 0}}>
                    <Col className="text-white text-center"
                         style={{backgroundImage: `url(https://mdbootstrap.com/img/Photos/Others/gradient1.jpg)`}}>
                      <Col className="py-5">
                        <h1 className="mx-5 mb-5 font-weight-bold">
                          A Place to Unite San Fransisco State University Patrons!
                        </h1>
                        <Image src={gatorImage}thumbnail/>
                        <h3 className="font-italic">
                          Take part in our events focused platform to connect and socialize with your fellow Gators!
                        </h3>
                      </Col>
                    </Col>
                  </Jumbotron>
                </Col>
              </Row>
              : null
          }
        </Container>
    )
  }

  render() {
    return (
      <Root>
        {this.renderContainer()}
        {this.renderCarousel()}
      </Root>
    );
  }
}

export default Events;
