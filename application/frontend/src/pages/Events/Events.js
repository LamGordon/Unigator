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
          <Row>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="" />
            </Form.Group>
            <Button style={{color: 'red', background: 'none', border: 'none'}} onClick={this.termsAndAgreementModal.bind(this)}>
              I agree with the terms & conditions.
            </Button>
          </Row>
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
            <>
              <h2>Welcome to UniGator</h2>
              <p>These terms and conditions outline the rules and regulations for the use of UniGator's Website.</p> <br />
              <p>By accessing this website we assume you accept these terms and conditions in full. Do not continue to use UniGator's website
                if you do not accept all of the terms and conditions stated on this page.</p>
              <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice
                and any or all Agreements: "Client", "You" and "Your" refers to you, the person accessing this website
                and accepting the Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers
                to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves, or either the Client
                or ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake
                the process of our assistance to the Client in the most appropriate manner, whether by formal meetings
                of a fixed duration, or any other means, for the express purpose of meeting the Client's needs in respect
                of provision of the Company's stated services/products, in accordance with and subject to, prevailing law
                of . Any use of the above terminology or other words in the singular, plural,
                capitalisation and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p><h2>Cookies</h2>
              <p>We employ the use of cookies. By using UniGator's website you consent to the use of cookies
                in accordance with UniGator's privacy policy.</p><p>Most of the modern day interactive web sites
              use cookies to enable us to retrieve user details for each visit. Cookies are used in some areas of our site
              to enable the functionality of this area and ease of use for those people visiting. Some of our
              affiliate / advertising partners may also use cookies.</p><h2>License</h2>
              <p>Unless otherwise stated, UniGator and/or it's licensors own the intellectual property rights for
                all material on UniGator. All intellectual property rights are reserved. You may view and/or print
                pages from http://13.52.231.107:3006/ for your own personal use subject to restrictions set in these terms and conditions.</p>
              <p>You must not:</p>
              <ol>
                <li>Republish material from http://13.52.231.107:3006/</li>
                <li>Sell, rent or sub-license material from http://13.52.231.107:3006/</li>
                <li>Reproduce, duplicate or copy material from http://13.52.231.107:3006/</li>
              </ol>
              <p>Redistribute content from UniGator (unless content is specifically made for redistribution).</p>
              <h2>Hyperlinking to our Content</h2>
              <ol>
                <li>The following organizations may link to our Web site without prior written approval:
                  <ol>
                    <li>Government agencies;</li>
                    <li>Search engines;</li>
                    <li>News organizations;</li>
                    <li>Online directory distributors when they list us in the directory may link to our Web site in the same
                      manner as they hyperlink to the Web sites of other listed businesses; and</li>
                    <li>Systemwide Accredited Businesses except soliciting non-profit organizations, charity shopping malls,
                      and charity fundraising groups which may not hyperlink to our Web site.</li>
                  </ol>
                </li>
              </ol>
              <ol start="2">
                <li>These organizations may link to our home page, to publications or to other Web site information so long
                  as the link: (a) is not in any way misleading; (b) does not falsely imply sponsorship, endorsement or
                  approval of the linking party and its products or services; and (c) fits within the context of the linking
                  party's site.
                </li>
                <li>We may consider and approve in our sole discretion other link requests from the following types of organizations:
                  <ol>
                    <li>commonly-known consumer and/or business information sources such as Chambers of Commerce, American
                      Automobile Association, AARP and Consumers Union;</li>
                    <li>dot.com community sites;</li>
                    <li>associations or other groups representing charities, including charity giving sites,</li>
                    <li>online directory distributors;</li>
                    <li>internet portals;</li>
                    <li>accounting, law and consulting firms whose primary clients are businesses; and</li>
                    <li>educational institutions and trade associations.</li>
                  </ol>
                </li>
              </ol>
              <p>We will approve link requests from these organizations if we determine that: (a) the link would not reflect
                unfavorably on us or our accredited businesses (for example, trade associations or other organizations
                representing inherently suspect types of business, such as work-at-home opportunities, shall not be allowed
                to link); (b)the organization does not have an unsatisfactory record with us; (c) the benefit to us from
                the visibility associated with the hyperlink outweighs the absence of UniGator; and (d) where the
                link is in the context of general resource information or is otherwise consistent with editorial content
                in a newsletter or similar product furthering the mission of the organization.</p>

              <p>These organizations may link to our home page, to publications or to other Web site information so long as
                the link: (a) is not in any way misleading; (b) does not falsely imply sponsorship, endorsement or approval
                of the linking party and it products or services; and (c) fits within the context of the linking party's
                site.</p>

              <p>If you are among the organizations listed in paragraph 2 above and are interested in linking to our website,
                you must notify us by sending an e-mail to <a href="mailto:unigator648@gmail.com" title="send an email to unigator648@gmail.com">unigator648@gmail.com</a>.
                Please include your name, your organization name, contact information (such as a phone number and/or e-mail
                address) as well as the URL of your site, a list of any URLs from which you intend to link to our Web site,
                and a list of the URL(s) on our site to which you would like to link. Allow 2-3 weeks for a response.</p>

              <p>Approved organizations may hyperlink to our Web site as follows:</p>

              <ol>
                <li>By use of our corporate name; or</li>
                <li>By use of the uniform resource locator (Web address) being linked to; or</li>
                <li>By use of any other description of our Web site or material being linked to that makes sense within the
                  context and format of content on the linking party's site.</li>
              </ol>
              <p>No use of UniGator's logo or other artwork will be allowed for linking absent a trademark license
                agreement.</p>
              <h2>Iframes</h2>
              <p>Without prior approval and express written permission, you may not create frames around our Web pages or
                use other techniques that alter in any way the visual presentation or appearance of our Web site.</p>
              <h2>Reservation of Rights</h2>
              <p>We reserve the right at any time and in its sole discretion to request that you remove all links or any particular
                link to our Web site. You agree to immediately remove all links to our Web site upon such request. We also
                reserve the right to amend these terms and conditions and its linking policy at any time. By continuing
                to link to our Web site, you agree to be bound to and abide by these linking terms and conditions.</p>
              <h2>Removal of links from our website</h2>
              <p>If you find any link on our Web site or any linked web site objectionable for any reason, you may contact
                us about this. We will consider requests to remove links but will have no obligation to do so or to respond
                directly to you.</p>
              <p>Whilst we endeavour to ensure that the information on this website is correct, we do not warrant its completeness
                or accuracy; nor do we commit to ensuring that the website remains available or that the material on the
                website is kept up to date.</p>
              <h2>Content Liability</h2>
              <p>We shall have no responsibility or liability for any content appearing on your Web site. You agree to indemnify
                and defend us against all claims arising out of or based upon your Website. No link(s) may appear on any
                page on your Web site or within any context containing content or materials that may be interpreted as
                libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or
                other violation of, any third party rights.</p>
              <h2>Disclaimer</h2>
              <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website (including, without limitation, any warranties implied by law in respect of satisfactory quality, fitness for purpose and/or the use of reasonable care and skill). Nothing in this disclaimer will:</p>
              <ol>
                <li>limit or exclude our or your liability for death or personal injury resulting from negligence;</li>
                <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
              </ol>
              <p>The limitations and exclusions of liability set out in this Section and elsewhere in this disclaimer: (a)
                are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer or
                in relation to the subject matter of this disclaimer, including liabilities arising in contract, in tort
                (including negligence) and for breach of statutory duty.</p>
              <p>To the extent that the website and the information and services on the website are provided free of charge,
                we will not be liable for any loss or damage of any nature.</p>
              <h2></h2>
              <p></p>
              <h2>Credit & Contact Information</h2>
              <p>This Terms and conditions page was created at <a style={{color:'inherit',textDecoration:'none',cursor:'text'}}
                                                                  href="https://termsandconditionstemplate.com/generate/">termsandconditionstemplate.com</a> generator. If you have
                any queries regarding any of our terms, please contact us.</p>
            </>
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
