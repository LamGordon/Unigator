import React from 'react';

const Home = () => {
    return (
        <div style={{ paddingTop: "40px" }}>
            <h1>UniGator</h1>

            <div className="content">
                <div className="container">
                    <section className="section">
                        <ul>
                            {this.state.list.map(item => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </section>
                    <hr />
                    <section className="section">
                        <form className="form" id="addItemForm">
                            <input
                                type="text"
                                className="input"
                                id="addInput"
                                placeholder="Something that needs ot be done..."
                            />
                            <button className="button is-info" onClick={this.addItem}>
                                Add Event
                             </button>
                            <div>
                                <button>
                                    Show Events
                                </button>

                                <div className="menu">
                                    <button> Schedule an event </button>
                                    <button> Sign up for event </button>
                                    <button> see events saved </button>
                                </div>
                            </div>

                        </form>
                    </section>
                </div>

                <br></br>
                <h3>Connecting, .... </h3>
            </div>
            </div>
    );
};

export default Home;