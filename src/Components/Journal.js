import React from 'react';

const Journal = (props) => {
  return (
    <div className="wrapper journalParent">
      <h2>Journal</h2>
      <ul className="journal">
        {
          props.savedHaikus.map((haiku, index) => {
            return (
              <li key={haiku.title + Math.random()}>
                <button
                  onClick={props.displayJournalLog}
                  className={props.activeHaiku === index ? 'activeHaiku' : ''}
                  value={index}
                >
                  {haiku.title} by {haiku.author} - {haiku.date}
                </button>
              </li>
            )
          })
        }
      </ul>
      <button className="journalWrite" onClick={props.createHaiku}>Write</button>
    </div>
  )
}

export default Journal;