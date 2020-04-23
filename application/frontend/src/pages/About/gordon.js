import React from 'react';
import './about.css';
import profileImage from './assets/gordonprofile.jpg';

const Gordon = () => {
    return (
        <div style={{ paddingTop: "40px" }}>
            <div className='profile'>
                <img className='profilepicture'
                    src={profileImage}
                ></img>
                <h2>Gordon Lam</h2>
                <br></br>
                <h3>Backend Engineer</h3>
                <h3>glam1@mail.sfsu.edu</h3>
            </div>
            <div className='desc'>
                <ul>
                    <li>Currently a student at San Francisco State University.</li>
                    <li>Was born and raised in San Francisco.</li>
                    <li>Hobbies include fishing and gaming.</li>
                    <li>Princess Bride is one of my favorite movies.</li>
                </ul>
            </div>
            
        </div>
    );
};

export default Gordon;