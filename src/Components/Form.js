import React, { Component } from 'react';

class Form extends Component {
    render() {
        return (
            <form onSubmit={this.props.handleFormSubmit} action="submit" className="form wrapper">
                <label className="visuallyHidden" htmlFor="userInput">Type a word:</label>
                <input placeholder="Type a word here" onChange={this.props.handleUserInput} type="text" id="userInput" name="userInput" pattern="^[a-zA-Z]*$" autoComplete="off" value={this.props.inputTextValue} />
                <button type="submit">Submit</button>
            </form>
        )
    }
}

export default Form;