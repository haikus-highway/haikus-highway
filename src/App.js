import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { getRandomIntInRangeExclusive } from './randomizers';
import removeFromArray from './removeFromArray';
import Header from './Components/Header';
import Form from './Components/Form';
import Haiku from './Components/Haiku';
import RelatedWords from './Components/RelatedWords';
import Restart from './Components/Restart';
import HaikuImage from './assets/haiku-japanese.jpg';

class App extends Component {
  constructor() {
    super();

    // 1
    this.state = {
      userInput: '', //2,
      firstLine: [], //3
      secondLine: [],
      thirdLine: [],
      allRelatedWords: [],
      tenRelatedWords: [],
      currentLine: [],
      totalSyllables: 0,
      formVisible: false,
      headerVisible: true,
      suggestions: [],
      inputTextValue: ''
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
      const totalSyllablesSoFar = this.getSyllablesPerLine(this.state.currentLine);
      const maxSyllablesAllowed = this.checkMaxSyllablesAllowed(totalSyllablesSoFar);

      if (response.data[0].word === this.state.userInput.toLowerCase() && response.data[0].numSyllables <= maxSyllablesAllowed) {

        let firstLineCopy = [...this.state.firstLine];
        let secondLineCopy = [...this.state.secondLine];
        let thirdLineCopy = [...this.state.thirdLine];
        let currentLineCopy = [...this.state.currentLine]; //6

        if (response.data[0].numSyllables === maxSyllablesAllowed) {
          if (this.state.totalSyllables <= 5) {
            currentLineCopy.push(response.data[0]);
            firstLineCopy = [...currentLineCopy];
            currentLineCopy = [];
          } else if (this.state.totalSyllables <= 12) {
            currentLineCopy.push(response.data[0]);
            secondLineCopy = [...currentLineCopy];
            currentLineCopy = [];
          } else {
            currentLineCopy.push(response.data[0]);
            thirdLineCopy = [...currentLineCopy];
            currentLineCopy = [];
          }
        } else {
          currentLineCopy.push(
            // Recall: .push() adds items into our currentLineCopy array
            {//7
              word: this.state.userInput,
              numSyllables: response.data[0].numSyllables
            }
          );
        }
  
  
        this.setState({ //8
          firstLine: firstLineCopy,
          secondLine: secondLineCopy,
          thirdLine: thirdLineCopy,
          currentLine: currentLineCopy,
          totalSyllables: this.state.totalSyllables + response.data[0].numSyllables,
          formVisible: false,
        },
          //9
          () => {
            this.getRelatedWords(this.state.userInput);
          }
        );
      } else {
        alert('Either you misspelled or entered too many syllables');
        this.setState({
          userInput: ''
        });
      }
    }).catch((error) => {
      alert("This word doesn't exist");
      this.setState({
        userInput: ''
      });

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
      if (response.data.length === 0) {
        this.setState({
          formVisible: true,
          userInput: '',
          tenRelatedWords: []
        });

        alert("Couldn't find any related words - please enter another!")
      } else {
        this.filterResults(response.data);
      }
    });
  }

  checkMaxSyllablesAllowed = (syllablesSoFar) => {
    let maxSyllablesAllowed;

    if (this.state.totalSyllables < 5 || this.state.totalSyllables >= 12) {
      maxSyllablesAllowed = 5 - syllablesSoFar;
    } else {
      maxSyllablesAllowed = 7 - syllablesSoFar;
    }
    return maxSyllablesAllowed;
  }

  randomizeWords = (relatedWords) => {
    const relatedWordsCopy = [...relatedWords];

    const randomWords = [];

    for (let i = 0; i < 10; i++) {
      // Find random index
      const randomIndex = getRandomIntInRangeExclusive(0, relatedWordsCopy.length);

      // Push random index of relatedWordsCopy array into randomWords array
      if (relatedWordsCopy[randomIndex] !== undefined) {
        randomWords.push(relatedWordsCopy[randomIndex]);
      }

      // Remove random index from relatedWordsCopy array to prevent duplicates in randomWords array
      removeFromArray(relatedWordsCopy[randomIndex], relatedWordsCopy);

    }

    return randomWords
  }

  filterResults = (results) => {
    //13

    const totalSyllablesSoFar = this.getSyllablesPerLine(this.state.currentLine);

    //14
    const maxSyllablesAllowed = this.checkMaxSyllablesAllowed(totalSyllablesSoFar);

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
    let formVisible = false;

    if (filteredResults.length > 0) {
      randomWords = this.randomizeWords(filteredResults);
    } else {
      randomWords = [];
      formVisible = true;
    }

    this.setState({
      allRelatedWords: filteredResults,
      tenRelatedWords: randomWords,
      userInput: '',
      inputTextValue: '',
      formVisible: formVisible
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
      userInput: e.target.value,
      inputTextValue: e.target.value
    });

    if (e.target.value !== '') {
      this.autoCompleteSuggestions(e.target.value);
    } else {
      this.setState({
        suggestions: []
      });
    }
  }

  autoCompleteSuggestions = (input) => {
    axios({
      url: `https://api.datamuse.com/sug?s=${input}`,
      method: 'GET',
      responseType: 'json'
    }).then((response)=> {
      this.setState({
        suggestions: response.data
      });
    })
  }

  chooseSuggestedWord = (word) => {
    this.setState({
      userInput: word,
      inputTextValue: word,
      suggestions: []
    });
  }

  // Word onClick function
  wordChosen = (item) => {

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
    }, () => {
      if (this.state.totalSyllables < 17) {
        this.getRelatedWords(item.word)
      }
    })
  }

  // This is the event handler for the Journal button on our home screen, as well as our "restart" button
  createHaiku = () => {
    this.setState({
      userInput: '', 
      firstLine: [],
      secondLine: [],
      thirdLine: [],
      allRelatedWords: [],
      tenRelatedWords: [],
      currentLine: [],
      totalSyllables: 0,
      suggestions: [],
      inputTextValue: '',
      formVisible: true,
      headerVisible: false
    })
  }

  // This button will get user more words related to their word of choice
  moreWords = () => {
    this.setState({
      tenRelatedWords: this.randomizeWords(this.state.allRelatedWords)
    })
  }

  render() {
    return (

      <div className="App">

        <div className="rightHalf">
          {
            this.state.headerVisible ?
            <Header
              createHaiku = {this.createHaiku}
            />
            : null
          }

          {
            this.state.formVisible ?
              <Form
                handleFormSubmit={this.handleFormSubmit}
                handleUserInput={this.handleUserInput}
                inputTextValue={this.state.inputTextValue}
              />
            : null
          }
        
          {
            this.state.formVisible && this.state.suggestions.length > 0 ?
              <div className="autoCompleteSuggestions">
                <ul>
                  {
                    this.state.suggestions.map((suggestion, index)=> {
                      return (
                        <li key={suggestion + index}>
                          <button onClick={ ()=> this.chooseSuggestedWord(suggestion.word) }>{suggestion.word}</button>
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
            : null
          }

        <RelatedWords
          tenRelatedWords={this.state.tenRelatedWords}
          totalSyllables={this.state.totalSyllables}
          wordChosen={this.wordChosen}
          moreWords={this.moreWords}
        />

        {
          this.state.totalSyllables === 17 ?
            <Restart
              createHaiku={this.createHaiku}
            />
            : null    
        }
      </div>

      <div className="leftHalf">
        <Haiku
          firstLine={this.state.firstLine}
          secondLine={this.state.secondLine}
          thirdLine={this.state.thirdLine}
          currentLine={this.state.currentLine}
        />

        <div className="japanese">
          <img src={HaikuImage} alt=""/>
          {/* <p> */}
            {/* 俳句 */}
          {/* </p> */}
        </div>
      </div>

    </div>
    );
  }
}

export default App;
