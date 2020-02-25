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
import Mitul from './mitul';

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
                                <Link to={`${match.url}/kevin`}>kevin</Link>
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
                        <Route path={`${match.url}/mitul`}>
                            <Mitul/>
                        </Route>
                        <Route path="/">
                            <Jorge />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    );
};

export default About;