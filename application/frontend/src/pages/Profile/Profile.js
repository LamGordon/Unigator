import React, { Component } from 'react';

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            name: 'React'
        };
    }

    render() {
        return (
            <div>
                Profile page goes here
            </div>
        );
    }
}

export default Profile;
