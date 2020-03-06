import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { getRandomIntInRangeExclusive } from './randomizers';
import removeFromArray from './removeFromArray';

const randomizeWords = (relatedWords) => {
  const relatedWordsCopy = [...relatedWords];

  const randomWords = [];

  for (let i = 0; i < 10; i++) {
    // Find random index
    const randomIndex = getRandomIntInRangeExclusive(0, relatedWordsCopy.length)

    // Push random index of relatedWordsCopy array into randomWords array
    randomWords.push(relatedWordsCopy[randomIndex])

    // Remove random index from relatedWordsCopy array to prevent duplicates in randomWords array
    removeFromArray(relatedWordsCopy[randomIndex], relatedWordsCopy)

  }

  return randomWords
}

class App extends Component {
  constructor() {
    super();

    // 1
    this.state = {
      userInput: '', //2
      firstLine: [], //3
      secondLine: [],
      thirdLine: [],
      allRelatedWords: [],
      tenRelatedWords: [],
      currentLine: [],
      totalSyllables: 0,
    };
  }

  handleFormSubmit = (e) => { //4
    e.preventDefault();

    axios({ //5
      url: `https://api.datamuse.com/words?sp=${this.state.userInput}&md=s`,
      method: 'GET',
      responseType: 'json',
    }).then((response) => {
      // Recall: response = data received from AXIOS call

      const currentLineCopy = [...this.state.currentLine]; //6

      currentLineCopy.push(
        // Recall: .push() adds items into our currentLineCopy array
        {//7
          word: this.state.userInput,
          numSyllables: response.data[0].numSyllables
        }
      );

      this.setState({ //8
        currentLine: currentLineCopy,
        totalSyllables: this.state.totalSyllables + response.data[0].numSyllables,
      },
        //9
        () => {
          this.getRelatedWords(this.state.userInput);
        }
      );
    });
  }

  //10
  getRelatedWords = (word) => {
    axios({
      url: `https://api.datamuse.com/words?rel_bga=${word}&md=s`,
      method: 'GET',
      responseType: 'json',
    }).then((response) => {
      //11

      //12
      this.filterResults(response.data);
      console.log(response.data);
    });
  }

  filterResults = (results) => {
    //13

    const totalSyllablesSoFar = this.getSyllablesPerLine(this.state.currentLine);

    //14
    let maxSyllablesAllowed;

    if (this.state.totalSyllables < 5 || this.state.totalSyllables >= 12) {

      maxSyllablesAllowed = 5 - totalSyllablesSoFar;
    } else {
      maxSyllablesAllowed = 7 - totalSyllablesSoFar;
    }
    //15

    const regex = /[a-z]/g;

    //16
    const filteredResults = results.filter((item) => {
      if (item.numSyllables <= maxSyllablesAllowed && item.word.match(regex)) {
        //17
        return item;
      } else {
        return false;
      }
    });

    // console.log(filteredResults)

    let randomWords;

    if (filteredResults.length > 0) {
      randomWords = randomizeWords(filteredResults);
    } else {
      randomWords = [];
    }

    this.setState({
      allRelatedWords: filteredResults,
      tenRelatedWords: randomWords
    })
  }

  // Provide a line to check and get the total number of syllables within that line
  getSyllablesPerLine = (line) => {
    // Line will be an array that is received from state

    // initialize a sum variable to 0
    let numberOfSyllablesLine = 0;
    // Loop through each item in the line array provided
    line.forEach((item) => {
      // Add the number of syllables in this word to the sum variable
      numberOfSyllablesLine += item.numSyllables;
    });
    // Return the total sum of syllables
    return numberOfSyllablesLine;
  }

  handleUserInput = (e) => {
    this.setState({
      userInput: e.target.value
    });
  }

  // Word onClick function
  wordChosen = (item) => {

    // const syllablesSoFar = this.getSyllablesPerLine(this.state.currentLine);
    let firstLineCopy = [...this.state.firstLine];
    let secondLineCopy = [...this.state.secondLine];
    let thirdLineCopy = [...this.state.thirdLine];

    let lineArrayCopy = [...this.state.currentLine];
    lineArrayCopy.push(item);

    let totalSyllablesCopy = this.state.totalSyllables + item.numSyllables;

    //if the current line is line one, and syllables so far is five, then move to line two and update the current line to two
    if (totalSyllablesCopy === 5) {
      //when we've reached our cap, push the array to first line, reset current line to an empty array
      firstLineCopy = [...lineArrayCopy];
      lineArrayCopy = [];
      console.log(firstLineCopy);

    } else if (totalSyllablesCopy === 12) {
      secondLineCopy = [...lineArrayCopy];
      lineArrayCopy = [];
    } else if (totalSyllablesCopy === 17) {
      thirdLineCopy = [...lineArrayCopy];
      lineArrayCopy = [];
    }

    this.setState({
      currentLine: lineArrayCopy,
      firstLine: firstLineCopy,
      secondLine: secondLineCopy,
      thirdLine: thirdLineCopy,
      totalSyllables: totalSyllablesCopy,
      // tenRelatedWords: []
    }, () => {
      if (this.state.totalSyllables < 17) {
        this.getRelatedWords(item.word)
        console.log("done");

      }
    })
  }

  render() {
    return (
      <div className="App wrapper">
        {/* <header>
          <h1>HaikYou</h1>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo ex ut doloremque iste excepturi sit officiis odit quisquam quasi suscipit neque soluta, esse commodi nesciunt, ipsa nemo labore illum veniam.</p>

          <div className="homeButtonDiv">
            <button className="homeButton">
              <a href="">Journal</a>
            </button>

            <button className="homeButton">
              <a href="">Haiku Log</a>
            </button>
          </div>

        </header> */}

        <form onSubmit={this.handleFormSubmit} action="submit" className="form">
          <label className="visuallyHidden" htmlFor="userInput">Type a word:</label>
          <input placeholder="Type a word here" onChange={this.handleUserInput} type="text" id="userInput" name="userInput" />
          {/* <button type="submit">Submit</button> */}
        </form>
        <ul className="relatedWords">
          {
            this.state.totalSyllables < 17 ?
              this.state.tenRelatedWords.map((item, index) => {
                return (
                  <li key={item.word + index}>
                    <button className="chosenWord" onClick={() => this.wordChosen(item)}>{item.word}</button>
                  </li>
                )
              }) :
              null
          }
        </ul>



        <div className="printedHaiku">

          {

            this.state.firstLine.length > 0 ?
              <p className="line firstLine">
                {
                  this.state.firstLine.map((item, index) => {
                    return <span key={item.word + index}>{item.word} </span>
                  })
                }
              </p>
              : null
          }

          {

            this.state.secondLine.length > 0 ?
              <p className="line secondLine">
                {
                  this.state.secondLine.map((item, index) => {
                    return <span key={item.word + index}>{item.word} </span>
                  })
                }
              </p>
              : null
          }

          {

            this.state.thirdLine.length > 0 ?
              <p className="line thirdLine">
                {
                  this.state.thirdLine.map((item, index) => {
                    return <span key={item.word + index}>{item.word} </span>
                  })
                }
              </p>
              : null
          }
          {

            this.state.currentLine.length > 0 ?
              <p className="line currentLine">
                {
                  this.state.currentLine.map((item, index) => {
                    return <span key={item.word + index}>{item.word} </span>
                  })
                }
              </p>
              : null
          }

        </div>
      </div>
    );
  }
}

export default App;
