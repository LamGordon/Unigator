import React from 'react';
import './about.css';
import profileImage from './assets/jackprofile.jpg';

const Jack = () => {
    return (
        <div style={{ paddingTop: "40px" }}>
            <div className='profile'>
                <img className='profilepicture'
                    src={profileImage}
                ></img>
                <h2>Jack Kower</h2>
                <br></br>
                <h3>Software Developer</h3>
                <h3>jkower@mail.sfsu.edu</h3>
            </div>
            <div className='desc'>My name is Jack Kower and I am a graduating senior. I love learning about tech and am excited for this project.</div>
        </div>
    );
};

export default Jack;