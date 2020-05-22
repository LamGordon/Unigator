import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Events from "./pages/Events/Events";
import Results from './pages/SearchResults/Results';
import Profile from "./pages/Profile/Profile";
import EventDetail from "./pages/EventDetail/EventDetail";
import Store from "./pages/Store/Store";
import "bootstrap/dist/css/bootstrap.min.css";

import Navibar from "./pages/Navibar"

class Routes extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props)
    return (
      <Router>
        <div>
          {/* A <Switch> looks through its children <Route>s and
             renders the first one that matches the current URL. */}
          <Navibar />

          <Switch>
            <Route path="/home" component={Events} exact />
            <Route path="/profile" component={Profile} />
            <Route path="/eventdetail" component={EventDetail} />
            <Route path="/store" component={Store} />
            <Route path="/results" component={Results} />
          </Switch>
        </div>
      </Router>
    );
  }
};

export default Routes;