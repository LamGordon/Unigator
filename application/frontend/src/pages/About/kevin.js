import React from 'react';
import './about.css';
import profileImage from './assets/kevinprofile.jpg';

const Kevin = () => {
    return (
        <div style={{ paddingTop: "40px" }}>
            <div className='profile'>
                <img className='profilepicture'
                    src={profileImage}
                ></img>
                <h2>Kevin Huang</h2>
                <br></br>
                <h3>Frontend engineer</h3>
                <h3>khuang2@mail.sfsu.edu</h3>
            </div>
            <div className='desc'>
                <ul>
                    <li>My name is Kevin Huang.</li>
                    <li>I am a computer science major at San Francisco State University.</li>
					<li>My favorite food are cheeseburgers.</li>
                </ul>
            </div>
        </div>
    );
};

export default Kevin;