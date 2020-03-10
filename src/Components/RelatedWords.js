import React, { Component } from 'react';

class RelatedWords extends Component {
    render() {
        return (
            <div className="wrapper relatedWordsFlex">
                <ul className="relatedWords">
                    {
                        this.props.tenRelatedWords.length > 0 && this.props.totalSyllables < 17 ?
                            this.props.tenRelatedWords.map((item, index) => {
                                return (
                                    <div key={item.word + index}>
                                        <li>
                                            <button className="chosenWord" onClick={() => this.props.wordChosen(item)}>{item.word}</button>
                                        </li>
                                    </div>
                                )
                            }) :
                            null
                    }

                </ul>

                {
                    this.props.tenRelatedWords.length > 0 && this.props.totalSyllables < 17 ?
                        <div className="moreWordsButton">
                            <button onClick={this.props.moreWords}>More words</button>
                        </div>
                        : null
                }
            </div>
            
        )
    }
}

export default RelatedWords;

