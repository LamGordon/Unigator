import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch
} from "react-router-dom";
import './about.css';
import Jorge from './jorge'
import Kevin from './kevin'

const About = () => {
    let match = useRouteMatch();

    return (
        <div>
            <Router >
                <div>
                    <nav>
                        <ul className="aboutnavbar">
                            <li>
                                <Link to={`${match.url}/jorge`}>Jorge</Link>
                            </li>
                            <li>
                                <Link to={`${match.url}/lionel`}>Lionel</Link>
                            </li>
                            <li>
                                <Link to={`${match.url}/mitul`}>Mitul</Link>
                            </li>
                            <li>
                                <Link to={`${match.url}/gordon`}>Gordon</Link>
                            </li>
                            <li>
                                <Link to={`${match.url}/kevin`}>Kevin</Link>
                            </li>
                            <li>
                                <Link to={`${match.url}/jack`}>Jack</Link>
                            </li>
                        </ul>
                    </nav>

                    {/* A <Switch> looks through its children <Route>s and
             renders the first one that matches the current URL. */}
                    <Switch>
                        <Route path={`${match.url}/jorge`}>
                            <Jorge/>
                        </Route>
                        <Route path="/">
                            <Jorge />
                        </Route>
						
						<Route path={`${match.url}/kevin`}>
                            <Kevin/>
                        </Route>
                        <Route path="/">
                            <Kevin />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    );
};

export default About;