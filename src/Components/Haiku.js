import React from 'react';

const Haiku = (props) => {
  return (
    <div className="printedHaiku wrapper">

      {
        props.firstLine.length > 0 ?
          <p className="line firstLine">
            {
              props.firstLine.map((item, index) => {
                return <span key={item.word + index}>{item.word} </span>
              })
            }
          </p>
        : null
      }

      {
        props.secondLine.length > 0 ?
          <p className="line secondLine">
            {
              props.secondLine.map((item, index) => {
                return <span key={item.word + index}>{item.word} </span>
              })
            }
          </p>
        : null
      }

      {
        props.thirdLine.length > 0 ?
          <p className="line thirdLine">
            {
              props.thirdLine.map((item, index) => {
                return <span key={item.word + index}>{item.word} </span>
              })
            }
          </p>
        : null
      }

      {
        props.currentLine.length > 0 ?
          <p className="line currentLine underline">
            {
              props.currentLine.map((item, index) => {
                return <span key={item.word + index}>{item.word} </span>
              })
            }
          </p>
        : null
      }

    </div>
  )
}

export default Haiku;