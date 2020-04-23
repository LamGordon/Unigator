import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import About from "./pages/About/about";
import Events from "./pages/Events/Events";
import Profile from "./pages/Profile/Profile";
import EventDetail from "./pages/EventDetail/EventDetail";
import "bootstrap/dist/css/bootstrap.min.css";

const Routes = (props) => {
  return (
      <Router {...props}>
        <div>
          <nav>
            <ul className="navbar">
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
             renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/home">
              <Events />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/eventdetail">
              <EventDetail />
            </Route>
          </Switch>
        </div>
      </Router>
  );
};

export default Routes;
