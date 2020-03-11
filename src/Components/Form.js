import React from 'react';

const Form = (props) => {
  return (
    <form onSubmit={props.handleFormSubmit} action="submit" className="form wrapper">
      <label className="visuallyHidden" htmlFor="userInput">Type a word:</label>
      <input placeholder="Type a word here" onChange={props.handleUserInput} type="text" id="userInput" name="userInput" pattern="^[a-zA-Z]*$" autoComplete="off" value={props.inputTextValue} />
      <button type="submit">Submit</button>
    </form>
  )
}

export default Form;