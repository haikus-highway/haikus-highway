import React from 'react';

const RelatedWords = (props) => {
  return (
      <div className="wrapper">
          <ul className="relatedWords">
            {
              props.tenRelatedWords.length > 0 && props.totalSyllables < 17 ?
                props.tenRelatedWords.map((item, index) => {
                  return (
                    <li key={item.word + index}>
                        <button className="chosenWord" onClick={() => props.wordChosen(item)}>{item.word}</button>
                    </li>
                  )
                }) 
              : null
            }
          </ul>
                
            {
              props.tenRelatedWords.length > 0 && props.totalSyllables < 17 ?
                <div className="moreWordsButton">
                    <button onClick={props.moreWords}>More words</button>
                </div>
              : null
            }
      </div>
    )
  }

export default RelatedWords;

