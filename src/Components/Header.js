import React from 'react';

const Header = (props) => {
  return(
    <header>
      <div className="wrapper">
        <h1>HaikYou</h1>
        <p>A haiku is a Japanese poem of seventeen syllables, in three lines of five, seven, and five, traditionally evoking images of the natural world. Create your own!</p>

        <div className="homeButtonDiv">
          <button className="homeButton" onClick={props.createHaiku}>
              Write
          </button>

          <button className="homeButton" onClick={props.showJournal}>
              Journal
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header;