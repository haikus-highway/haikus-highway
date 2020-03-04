import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userInput: '',
      firstLine: [],
      secondLine: [],
      thirdLine: []
    };
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    axios({
      url: `https://api.datamuse.com/words?sp=${this.state.userInput}&md=s`,
      method: 'GET',
      responseType: 'json',
    }).then((response)=> {
      const firstLineCopy = [...this.state.firstLine];
      firstLineCopy.push({
        word: this.state.userInput,
        numSyllables: response.data[0].numSyllables
      });
      this.setState({
        firstLine: firstLineCopy
      },
        () => {
          this.getRelatedWords(this.state.userInput);
        }
      );
    });
  }

  getRelatedWords = (word) => {
    axios({
      url: `https://api.datamuse.com/words?rel_bga=${word}&md=s`,
      method: 'GET',
      responseType: 'json',
    }).then((response)=> {
      this.filterResults(response.data);
    });
  }

  filterResults = (results) => {
    const totalSyllablesSoFar = this.getSyllablesPerLine(this.state.firstLine);
    const maxSyllablesAllowed = 5 - totalSyllablesSoFar;
    const filteredResults = results.filter((item) => {
      if (item.numSyllables <= maxSyllablesAllowed) {
        return item;
      } else {
        return false;
      }
    });
    console.log(filteredResults);
  }

  // Provide a line to check and get the total number of syllables within that line
getSyllablesPerLine = (line) => {
  // Line will be an array that is received from state

  // initialize a sum variable to 0
  let numberOfSyllablesLine = 0;
  // Loop through each item in the line array provided
  line.forEach((item)=> {
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

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleFormSubmit} action="submit"> 
          <label htmlFor="userInput">Type a word:</label>
          <input onChange={this.handleUserInput} type="text" id="userInput" name="userInput" />
          <button type="submit">Submit</button>
        </form>
        <div>
          <p></p>
        </div>
      </div>
    );
  }
}

export default App;
