import React from 'react';
import './about.css';
import profileImage from './assets/mitulprofile.jpg';

const Mitul = () => {
    return (
        <div style={{ paddingTop: "40px" }}>
            <div className='profile'>
                <img className='profilepicture'
                    src={profileImage}
                ></img>
                <h2>Mitul Savani</h2>
                <br></br>
                <h3>Github Master</h3>
                <h3>msavani@mail.sfsu.edu</h3>
            </div>
            <div className='desc'>My name is Mitul Savani and I am graduating senior majoring in Computer Science. I am excited to build this project and help my teammates along the way.</div>
        </div>
    );
};

export default Mitul;