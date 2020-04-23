import React from 'react';
import './about.css';
import profileImage from './assets/jorgeprofile.jpg';

const Jorge = () => {
    return (
        <div style={{ paddingTop: "40px" }}>
            <div className='profile'>
                <img className='profilepicture'
                    src={profileImage}
                ></img>
                <h2>Jorge Landaverde</h2>
                <br></br>
                <h3>Backend Lead</h3>
                <h3>jlandaverde@mail.sfsu.edu</h3>
            </div>
            <div className='desc'>My name is Jorge Landaverde and I'm a senior persuing my bachelor's degree in Computer Science. I am excited about finishing my degree and also looking forward to having a great product</div>
        </div>
    );
};

export default Jorge;