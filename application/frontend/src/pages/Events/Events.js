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
} from "react-bootstrap";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import styled from "styled-components";
import logoImage from '../../assets/unigatorLogo.png';

const is_production = process.env.REACT_APP_IS_PRODUCTION;
//const base_url = is_production ? "http://ec2-54-193-95-217.us-west-1.compute.amazonaws.com:3003" : "http://localhost:3003";
axios.defaults.baseURL = "http://54.193.95.217:3003";

const Forms = styled.form`
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
      loginIsOpen: false,
      signupIsOpen: false,
      createEventIsOpen: false,
      carouselShow: true,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  toggleLoginModal(){
    this.setState({
      loginIsOpen: ! this.state.loginIsOpen
    })
  }

  toggleSignupModal(){
    this.setState({
      signupIsOpen: ! this.state.signupIsOpen
    })
  }
  
  toggleCreateEventModal(){
    this.setState({
      createEventIsOpen: ! this.state.createEventIsOpen
    })
  }

  toggleTermsAndAgreementModal(){
    this.setState({
      termsAndAgreementIsOpen: ! this.state.termsAndAgreementIsOpen
    })
  }

  signupToLoginModal(){
    this.setState({
      signupIsOpen: ! this.state.signupIsOpen,
      loginIsOpen: ! this.state.loginIsOpen,
    });
  }

  loginToSignupModal(){
    this.setState({
      loginIsOpen: ! this.state.loginIsOpen,
      signupIsOpen: ! this.state.signupIsOpen,
    });
  }

  termsAndAgreementModal(){
    this.setState({
      termsAndAgreementIsOpen: ! this.state.termsAndAgreementIsOpen,
    });
  }

  // createEventModal(){
  //   this.setState({
  //     createEventIsOpen: !this.state.createEventIsOpen,
  //     loginIsOpen: ! this.state.loginIsOpen,
  //     signupIsOpen: ! this.state.signupIsOpen
  //   });
  // }

  carouselHide(){
    this.setState({
      carouselShow: false
    })
  }

  carouselShow(){
    this.setState({
      carouselShow: true
    })
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

  renderLogin = () => {
    return (
      <Modal className="Log-in" show={this.state.loginIsOpen} aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton onClick={this.toggleLoginModal.bind(this)}>
            <Modal.Title>Log In</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter SFSU Email" />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>
            </Form>
            <Button style={{color: 'blue', background: 'none', border: 'none'}} onClick={this.loginToSignupModal.bind(this)}>
              I want to create an account. Sign up here.
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary">Log In</Button>
            <Button variant="secondary" onClick={this.toggleLoginModal.bind(this)}>Cancel</Button>
          </Modal.Footer>
        </Modal>
    )
  }

  renderSignUp = () => {
    return(
      <Modal className="Sign-Up" show={this.state.signupIsOpen} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton onClick={this.toggleSignupModal.bind(this)}>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <a>
            Note: You must have an SFSU email to sign up for an account on this page.
            If you do not have an SFSU email, please contact an administrator here:
          </a>
          <Link to="/contact"> Contact Us</Link>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>SFSU Email</Form.Label>
              <Form.Control type="email" placeholder="Enter SFSU Email" />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="username" placeholder="Enter Username" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter Password" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm Password" />
            </Form.Group>
          </Form>
          <Button style={{color: 'blue', background: 'none', border: 'none'}} onClick={this.signupToLoginModal.bind(this)}>
            I already have an account. Log in here.
          </Button>
          <Button style={{color: 'red', background: 'none', border: 'none'}} onClick={this.termsAndAgreementModal.bind(this)}>
            Terms and Agreement.
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">Sign Up</Button>
          <Button variant="secondary" onClick={this.toggleSignupModal.bind(this)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  renderTermsAndAgreement = () => {
    return(
        <Modal show={this.state.termsAndAgreementIsOpen} aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton onClick={this.toggleTermsAndAgreementModal.bind(this)}>
            <Modal.Title>Terms and Agreement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <a>
              Lorem ipsum dolor sit amet, mea movet euripidis et, mei et hinc apeirian splendide, latine veritus eu pro. At nec consequat definiebas, prima prompta saperet te per.
              Facilis concludaturque te pri, omnium forensibus te pri. Duo prodesset efficiantur ei. Ut facer cetero has, mentitum conclusionemque vim no.
              An est ceteros sapientem. Mea regione repudiare abhorreant cu, pro suas sale labore ex. Minim scripserit his at, usu te omnium assueverit.
              No liber labores apeirian eum, nibh maiorum repudiare nec et, pro quot erroribus prodesset in. Cu altera diceret probatus nam, omnes vocibus vel ne.
              Ei justo postea timeam pro, at nec tale prima tractatos. Nec magna prima laudem cu, et dolorum sententiae eloquentiam vim.
              Ne est illum sonet ocurreret. Odio nisl sed cu, autem nostro sadipscing mea cu.
              Per menandri abhorreant vituperatoribus cu. Ei iracundia mnesarchum efficiantur est, vix amet laboramus ut. Elit interesset no eum.
              Mea homero voluptaria et, id has legere primis hendrerit. Natum summo torquatos ut vis. Option vidisse discere an vix, sit te saepe diceret vituperata.
              Vix ne mucius omnium, dicta mundi antiopam vix ei, eu etiam homero qui. No nusquam euripidis vel, aliquip percipit forensibus per eu.
              Usu denique principes an, enim nobis option qui eu. Saepe laudem sententiae usu no. Odio graecis honestatis duo ea, id detracto efficiendi his.
            </a>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.toggleTermsAndAgreementModal.bind(this)}>Cancel</Button>
          </Modal.Footer>
        </Modal>
    )
  }

  renderCreateEvent = () => {
    return(
        <Modal className="Create-Event" show={this.state.createEventIsOpen} aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton onClick={this.toggleCreateEventModal.bind(this)}>
            <Modal.Title>Create Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Event Name</Form.Label>
                <Form.Control type="email" placeholder="Name of the event" />
              </Form.Group>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Description</Form.Label>
                <Form.Control type="username" placeholder="Enter description..." />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Location</Form.Label>
                <Form.Control type="password" placeholder="Enter Location..." />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Label>Admission</Form.Label>
                <Form.Check type="checkbox" label="Free"/>
                <Form.Check type="checkbox" label="Paid"/>
                <Form.Control type="basic" placeholder="Enter Price..." />
              </Form.Group>
            </Form>
            <div className="mb-3">
              <Form.File id="formcheck-api-regular">
                <Form.File.Label>Choose picture</Form.File.Label>
                <Form.File.Input />
              </Form.File>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary">Submit Event</Button>
            <Button variant="secondary" onClick={this.toggleCreateEventModal.bind(this)}>Cancel</Button>
          </Modal.Footer>
        </Modal>
    )
  }

  renderCarousel = () => {
    const { carouselShow } = this.state;
    return (
        <Container>
          {carouselShow
            ?<div>
              <h1 style={{textAlign: 'center'}}>Featured Events</h1>
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
                    <h3 style={{textShadow: '2px 2px #000000'}}>Mobile dev 101</h3>
                    <p style={{textShadow: '2px 2px #000000'}}>Thornton Hall</p>
                    <p style={{textShadow: '2px 2px #000000'}}>Lets learn how to create a mobile app</p>
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
                    <h3 style={{textShadow: '2px 2px #000000'}}>Art 101</h3>
                    <p style={{textShadow: '2px 2px #000000'}}>Cesar Chavez Building</p>
                    <p style={{textShadow: '2px 2px #000000'}}>Let learn how to use water color</p>
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
                    <h3 style={{textShadow: '2px 2px #000000'}}>Resume 101</h3>
                    <p style={{textShadow: '2px 2px #000000'}}>J. Paul Leonard Library</p>
                    <p style={{textShadow: '2px 2px #000000'}}>Resume 101</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
              : null
            }
        </Container>
    )
  }


  renderEvents = () => {
    const { events } = this.state;
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
    )
  }

  render() {
    console.log("------------------------------------");
    console.log("State: ", this.state);
    console.log("------------------------------------");
    const { category, events } = this.state;

    return (
      <Root>
        <Head>
          <Link to="/home">
            <img className='logo' src={logoImage} onClick={this.carouselShow.bind(this)}></img>
          </Link>
          <div>
            <Forms onSubmit={this.handleSubmit}>
              <Search>
                Search:
                <input
                  type="text"
                  name="searchEvent"
                  onChange={this.handleInput}
                />
              </Search>
              <Button className="submit-btn" variant="primary" type="submit" onClick={this.carouselHide.bind(this)}>
                Submit
              </Button>
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
            </Forms>
          </div>
          <div className="fancy-btn">
            <Button variant="outline-primary" onClick={this.toggleCreateEventModal.bind(this)}>Create Event</Button>
            <Button variant="outline-primary" onClick={this.toggleLoginModal.bind(this)}>Log in</Button>
            <Button variant="outline-primary" onClick={this.toggleSignupModal.bind(this)}>Sign Up</Button>
            <Link to="/profile">
              <Button variant="outline-primary">My profile</Button>
            </Link>
            <Link to="/store">
              <Button variant="outline-primary">Store</Button>
            </Link>
          </div>
        </Head>
        {this.renderLogin()}
        {this.renderSignUp()}
        {this.renderCreateEvent()}
        {this.renderCarousel()}
        {this.renderEvents()}
        {this.renderTermsAndAgreement()}
      </Root>
    );
  }
}

export default Events;
