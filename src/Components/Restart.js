import React, { Component } from 'react';

class Restart extends Component {
    render() {
        return (
            <div className="restart wrapper">
                <h2>Your haiku is complete!</h2>
                <button onClick={this.props.createHaiku}>Write</button>
                <button onClick={this.props.save}>Save</button>
            </div>
        )
    }
}

export default Restart;