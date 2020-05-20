import React from "react";
import "./App.css";
import {
  Dropdown,
  Button,
  Row,
  Col,
  Container,
  Card,
  Modal,
  Form,
  FormControl,
  Carousel,
  Nav,
  Navbar,
} from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import About from "./pages/About/about";
import Events from "./pages/Events/Events";
import Results from './pages/SearchResults/Results';
import Profile from "./pages/Profile/Profile";
import EventDetail from "./pages/EventDetail/EventDetail";
import Store from "./pages/Store/Store";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import axios from "axios";

import logoImage from './assets/unigatorLogo.png';


const is_production = process.env.REACT_APP_IS_PRODUCTION;
axios.defaults.baseURL = "http://13.52.231.107:3003";
//use this instead when running backend locally
// axios.defaults.baseURL = "http://localhost:3003";

const RenderEvents = styled.div`
	background-color: #f8f8f8;

	justify-content: space-evenly;
`;

const Search = styled.label`
  margin-bottom: 0;
  display: flex;
  align-items: center;
  font-size: 20px;
  width: 300px;
  & input {
    flex: 1;
    border: 2px solid black;
    font-size: 18px;
    margin-left: 7px;
    padding: 2px 2px;
  }
`;

class Routes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchEvent: "",
      category: "Categories",
      events: [],
      pointshop: [],
      signupName: '',
      signupEmail: '',
      signupPassword: '',
      signupConfirmPassword: '',
      signupYear: '',
      loginEmail: '',
      loginPassword: '',
      loginIsOpen: false,
      signupIsOpen: false,
      createEventIsOpen: false,
      isLoggedIn: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
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
            this.props.history.push("/results", { events: res.data })
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
            this.props.history.push("/results", { events: res.data })
          })
          .catch((err) => {
            console.log(err);
          });
    }
  }

  handleSignup(e) {
    const { signupName, signupEmail, signupPassword, signupConfirmPassword, signupYear } = this.state;
    e.preventDefault();

    if ((signupName !== '' && signupEmail !== '' && signupPassword !== '' &&
        signupConfirmPassword !== '' && signupYear !== '') && signupPassword === signupConfirmPassword) {
      axios
        .post(`/register`, {
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          year: signupYear
        })
        .then((res) => {
          console.log(res);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log("Valid signup form");
      this.setState({
        signupIsOpen: ! this.state.signupIsOpen
      })
    } else {
      console.log("Invalid signup form");
    }
  }

  handleLogin(e) {
    const { loginEmail, loginPassword } = this.state;
    e.preventDefault();

    if (loginEmail !== '' && loginPassword !== '') {
      axios
          .post(`/login`, { email: loginEmail, password: loginPassword})
          .then((res) => {
            console.log(res);
            console.log(res.data);
            this.setState({
              isLoggedIn: true
            })
          })
          .catch((err) => {
            console.log(err);
          });
      console.log("Valid login form");
      this.setState({
        loginIsOpen: ! this.state.loginIsOpen
      })
    } else {
      console.log("Invalid signup form");
    }
  }

  handleLogout(e) {
    const { isLoggedIn } = this.state;
    // e.preventDefault();

    if (isLoggedIn) {
      axios
          .post('/logout')
          .then((res) => {
            console.log(res);
            console.log(res.data);
            this.setState({
              isLoggedIn: false
            })
          })
          .catch((err) => {
            console.log(err);
          });
    } else {
      console.log('Not Logged In')
    }
  }


  onClickHandler = (category) => {
    const value = category.target.getAttribute("value");
    this.setState({ category: value });
  };

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

  renderLogin = () => {
    return (
        <Modal className="Log-in" show={this.state.loginIsOpen} aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton onClick={this.toggleLoginModal.bind(this)}>
            <Modal.Title>Log In</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label style={{fontWeight:'bold'}}>Email address</Form.Label>
                <Form.Control type="email" name="loginEmail" onChange={this.handleInput} placeholder="Enter San Francisco State University Email" />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label style={{fontWeight:'bold'}}>Password</Form.Label>
                <Form.Control type="password" name="loginPassword" onChange={this.handleInput} placeholder="Enter Password" />
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
            <Button variant="primary" onClick={this.handleLogin}>Log In</Button>
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
            <div style={{border: 'solid red'}}>
              <a >
                If you do not have a San Francisco State University email, please contact us here:
              </a>
              <Link to="/contact"> Contact Us</Link>
            </div>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label style={{fontWeight:'bold'}}><br/>San Francisco State University Email</Form.Label>
                <Form.Control type="email" name="signupEmail" onChange={this.handleInput} placeholder="Enter San Francisco State University Email" />
              </Form.Group>
              <Form.Group controlId="formBasicName">
                <Form.Label style={{fontWeight:'bold'}}>Your Name</Form.Label>
                <Form.Control type="text" name="signupName" onChange={this.handleInput} placeholder="Enter Full Name" />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label style={{fontWeight:'bold'}}>Password</Form.Label>
                <Form.Control type="password" name="signupPassword" onChange={this.handleInput} placeholder="Enter Password" />
              </Form.Group>
              <Form.Text className="text-muted">
                Password must contain:
                <li>8-20 Characters</li>
                <li>Numbers (0-9)</li>
                <li>Uppercase Letters</li>
                <li>Lowercase Letters</li>
              </Form.Text>
              <Form.Group controlId="Password">
                <Form.Label style={{fontWeight:'bold'}}>Confirm Password</Form.Label>
                <Form.Control type="password" name="signupConfirmPassword" onChange={this.handleInput} placeholder="Confirm Password" />
              </Form.Group>
              <Form.Group controlId="formBasicYear">
                <Form.Label style={{fontWeight:'bold'}}>Year</Form.Label>
                <Form.Control type="number" name="signupYear" onChange={this.handleInput} placeholder="Year" />
              </Form.Group>
            </Form>
            <Button style={{color: 'blue', background: 'none', border: 'none'}} onClick={this.signupToLoginModal.bind(this)}>
              I already have an account. Log in here.
            </Button>
            <Form.Check type="checkbox" >
              <Form.Check.Input isValid />
              <Form.Check.Label>
                {<Button style={{color: 'red', background: 'none', border: 'none'}} onClick={this.termsAndAgreementModal.bind(this)}>
                  I agree with the terms & conditions.
                </Button>}
              </Form.Check.Label>
            </Form.Check>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleSignup}>Sign Up</Button>
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
            <Button variant="secondary" onClick={this.toggleTermsAndAgreementModal.bind(this)}>Close</Button>
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

  render() {
    console.log("------------------------------------");
    console.log("State: ", this.state);
    console.log("------------------------------------");
    const { category, events, isLoggedIn } = this.state;
    return (
        <Router>
          <div>
            <Navbar bg="dark" variant="dark">
              <Col>
                <Link to="/">
                  <img className='logo' src={logoImage}></img>
                </Link>
              </Col>
              <Col>
                <Form inline onSubmit={this.handleSubmit} style={{color:'white'}}>
                  <Search>
                    Search:
                    <input
                        type="text"
                        name="searchEvent"
                        placeholder="Search for Events"
                        onChange={this.handleInput}
                    />
                  </Search>
                  <Button className="submit-btn" variant="primary" type="submit">Submit</Button>
                  <Dropdown className="my-dropdown">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {category}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item value='Categories' onClick={this.onClickHandler}>
                        All Categories
                      </Dropdown.Item>
                      <Dropdown.Item value='Technology' onClick={this.onClickHandler}>
                        Technology
                      </Dropdown.Item>
                      <Dropdown.Item value='Education' onClick={this.onClickHandler}>
                        Education
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Form>
              </Col>
              <div className="fancy-btn">
                {isLoggedIn
                    ?
                    <>
                      <Button variant="outline-primary" onClick={this.toggleCreateEventModal.bind(this)}>Create Event</Button>
                      <Link to='/store'>
                        <Button variant="outline-primary">Store</Button>
                      </Link>
                      <Link to='/profile'>
                        <Button variant="outline-primary">My profile</Button>
                      </Link>
                      <Button variant="outline-primary" onClick={this.handleLogout}>Log Out</Button>
                    </>
                    :
                    <>
                      <Button variant="outline-primary" onClick={this.toggleLoginModal.bind(this)}>Log in</Button>
                      <Button variant="outline-primary" onClick={this.toggleSignupModal.bind(this)}>Sign Up</Button>
                    </>
                }
              </div>
            </Navbar>
            {this.renderLogin()}
            {this.renderSignUp()}
            {this.renderCreateEvent()}
            {this.renderTermsAndAgreement()}
            {this.renderEvents()}

            {/* A <Switch> looks through its children <Route>s and
             renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/about">
                <About/>
              </Route>
              <Route path="/profile">
                <Profile/>
              </Route>
              <Route path="/eventdetail">
                <EventDetail/>
              </Route>
              <Route path="/store">
                <Store/>
              </Route>
              <Route path="/results" component={Results} />
              <Route path="/" component={Events} exact />
            </Switch>
          </div>
        </Router>
    );
  }
};

export default Routes;