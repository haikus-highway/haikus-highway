import React from 'react';

const Restart = (props) => {
  return (
    <div className="restart wrapper">
      <h2>Your haiku is complete!</h2>
      <button onClick={props.createHaiku}>Write</button>
      <button onClick={props.save}>Save</button>
    </div>
  )
}

export default Restart;