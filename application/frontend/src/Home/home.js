import React from 'react';
import './home.css';
import Dropdown from 'react-bootstrap/Dropdown';

const Home = () => {
    return (
        <div >
            <h1 >UniGator</h1>
            <h3 className='button'>Log in</h3>
            <h3 className='button2'>Sign Up</h3>
            <div >
                <input className='border1'>
                </input>

                <button className='right'>Submit</button>
            </div>
            <div>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Categories
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>

    );
};

export default Home;