import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import About from './About/about';
import Home from './Home/home'
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <div className="App">
        <Router className="App-header">
          <div>
            <nav>
              <ul className="navbar">
                <li>
                  <Link to="/">Home</Link>
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
                <About/>
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
    </div>
  );
}

export default App;
