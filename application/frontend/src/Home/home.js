import React, { useState } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import Card from 'react-bootstrap/Card';
import logo from "../logo.svg";

const is_production = process.env.REACT_APP_IS_PRODUCTION;
// const base_url = is_production ? "http://ec2-54-193-95-217.us-west-1.compute.amazonaws.com:3003" : "http://localhost:3003";
// axios.defaults.baseURL = "http://54.193.95.217:3003";
axios.defaults.baseURL = "http://localhost:3003";

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
    align-items: left;
    display: flex;
    margin-top: 25px;
    flex-wrap: wrap;
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
                .catch(err => {
                    console.log(err)
                })
        }
        else if (category !== "Categories") {
            console.log("Category:", category, "Name:", event)
            axios.get(`/events/${category}`, {
                params: {
                    name: event
                }
            })
                .then(res => {
                    setEventsRes(res.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    function timeConverter(dateString){
        var a = new Date(dateString).getTime();
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
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
                {eventsRes.map(event => {
                    return (
                        <Card style={{ width: '16rem', margin: '16px'}}>
                            <Card.Img variant="top" src={logo}/>
                            <Card.Body>
                                <Card.Title>{event.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{event.date.slice(0,10)}</Card.Subtitle>
                                <Card.Text>
                                    {event.desc}
                                </Card.Text>
                                <Button variant="primary">More Info</Button>
                            </Card.Body>
                        </Card>
                    )
                })}
            </Events>
        </Root>
    );
};

export default Home;