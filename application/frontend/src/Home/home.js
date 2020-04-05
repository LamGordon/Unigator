import React, { useState } from 'react';
import axios from 'axios';
import './home.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';


const Home = () => {

    const [event, setEvent] = React.useState('');
    const [category, setCategory] = React.useState('Categories');

    const handleSubmit = event => {
        event.preventDefault();
        if (category != "Categories") {
            axios.post(`/events`, {name: event})
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                })
        }
    }

    const onClickHandler = category =>{
        const value = category.target.getAttribute('value');
        setCategory(value);

    }

    return (
        <div >
            <h1 >UniGator</h1>
            <h3 className='button'>Log in</h3>
            <h3 className='button2'>Sign Up</h3>
            <div >
                <form onSubmit={handleSubmit}>
                    <label>
                        Search:
                        <input className='border1' type="text" name="name" onChange={e => setEvent(e.target.value)} />
                    </label>
                    <Button className='right' variant="dark">Submit</Button>{' '}
                </form>

            </div>
            <div>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {category}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item value='Categories' onClick={onClickHandler}>None</Dropdown.Item>
                        <Dropdown.Item value='Technology' onClick={onClickHandler}>Technology</Dropdown.Item>
                        <Dropdown.Item value='Education' onClick={onClickHandler}>Education</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
};

export default Home;