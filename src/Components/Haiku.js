import React, { Component } from 'react';

class Haiku extends Component {
    render() {
        return (
            <div className="printedHaiku wrapper">

                {
                    this.props.firstLine.length > 0 ?
                        <p className="line firstLine">
                            {
                                this.props.firstLine.map((item, index) => {
                                    return <span key={item.word + index}>{item.word} </span>
                                })
                            }
                        </p>
                        : null
                }

                {

                    this.props.secondLine.length > 0 ?
                        <p className="line secondLine">
                            {
                                this.props.secondLine.map((item, index) => {
                                    return <span key={item.word + index}>{item.word} </span>
                                })
                            }
                        </p>
                        : null
                }

                {
                    this.props.thirdLine.length > 0 ?
                        <p className="line thirdLine">
                            {
                                this.props.thirdLine.map((item, index) => {
                                    return <span key={item.word + index}>{item.word} </span>
                                })
                            }
                        </p>
                        : null
                }

                {
                    this.props.currentLine.length > 0 ?
                        <p className="line currentLine underline">
                            {
                                this.props.currentLine.map((item, index) => {
                                    return <span key={item.word + index}>{item.word} </span>
                                })
                            }
                        </p>
                        : null
                }

            </div>
        )
    }
}

export default Haiku;