import React, { useState } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

const Form = styled.form`
    display: flex;
    max-width: 50%;
    margin: 0 auto;
    & .submit-btn {
        margin-left: auto;
    }

    & .my-dropdown {
        margin-right: 10px;
    }
`
const Root = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`
const Head = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 25px;
    & button {
        margin: 5px;
    }
`
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
`
const Dropdowns = styled.div`
    display: flex;
    margin: 5px auto;
    max-width: 50%;
`

const Events = styled.div`
    text-align: left;
`

const Home = () => {
    const [event, setEvent] = React.useState('');
    const [category, setCategory] = React.useState('Categories');
    const [eventsRes, setEventsRes] = React.useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (category === "Categories") {
            axios.post(`/events`, { name: event })
                .then(res => {
                    setEventsRes(res.data)
                })
        }
        else if(category !== "Categories") {
            console.log("Category:", category, "Name:", event)
            axios.get(`/events/${category}`, {
                params: {
                  name: event
                }
              })
                .then(res => {
                    setEventsRes(res.data)
                })
        }
    }

    const onClickHandler = category => {
        const value = category.target.getAttribute('value');
        setCategory(value);
    }

    return (
        <Root>
            <Head>
                <h1>UniGator</h1>
                <div className="fancy-btn">
                    <Button>Log in</Button>
                    <Button>Sign Up</Button>
                </div>
            </Head>
            <div>
                <Form onSubmit={handleSubmit}>
                    <Search>
                        Search:
                            <input type="text" name="name" onChange={e => setEvent(e.currentTarget.value)} />
                    </Search>
                    <Button className="submit-btn" variant="dark" type="submit">Submit</Button>
                </Form>
                <Dropdowns>
                    <Dropdown className="my-dropdown">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {category}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item value='Categories' onClick={onClickHandler}>None</Dropdown.Item>
                            <Dropdown.Item value='Technology' onClick={onClickHandler}>Technology</Dropdown.Item>
                            <Dropdown.Item value='Education' onClick={onClickHandler}>Education</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Dropdowns>
            </div>
            <Events>
                <pre>
                    {JSON.stringify(eventsRes, null, 2)}
                </pre>
            </Events>
        </Root>
    );
};

export default Home;