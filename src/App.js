import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();

    // 1
    this.state = {
      userInput: '', //2
      firstLine: [], //3
      secondLine: [],
      thirdLine: []
    };
  }
    
    handleFormSubmit = (e) => { //4
      e.preventDefault();
      
      axios({ //5
        url: `https://api.datamuse.com/words?sp=${this.state.userInput}&md=s`,
        method: 'GET',
        responseType: 'json',
      }).then((response)=> {
        // Recall: response = data received from AXIOS call
        
        const firstLineCopy = [...this.state.firstLine]; //6
        
        firstLineCopy.push( 
        // Recall: .push() adds items into our firstLineCopy array
          {//7
            word: this.state.userInput,
            numSyllables: response.data[0].numSyllables
          }
        );

        this.setState({ //8
          firstLine: firstLineCopy
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
    }).then((response)=> {
      //11
        
      //12
      this.filterResults(response.data);
    });
  }

  filterResults = (results) => {
    //13

    const totalSyllablesSoFar = this.getSyllablesPerLine(this.state.firstLine);
    //14

    const maxSyllablesAllowed = 5 - totalSyllablesSoFar;
    //15

    //16
    const filteredResults = results.filter((item) => {
      if (item.numSyllables <= maxSyllablesAllowed) {
      //17
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
