import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { getRandomIntInRangeExclusive } from './randomizers';
import removeFromArray from './removeFromArray';

const randomizeWords = (relatedWords) => {
  const relatedWordsCopy = [...relatedWords];

  const randomWords = [];

  for (let i = 0; i < 10; i++){
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
      tenRelatedWords: []
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


    console.log(filteredResults)

    let randomWords;

    if(filteredResults.length > 0){
      randomWords = randomizeWords(filteredResults);
    }else{
      randomWords = []
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

  wordChosen = (item) => {
   const lineArrayCopy = [...this.state.firstLine]

   lineArrayCopy.push(item)

   this.setState({
     firstLine: lineArrayCopy
   }, () => {
     this.getRelatedWords(item.word)
   })


  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleFormSubmit} action="submit"> 
          <label htmlFor="userInput">Type a word:</label>
          <input onChange={this.handleUserInput} type="text" id="userInput" name="userInput" />
          <button type="submit">Submit</button>
        </form>
        <ul>
          {
            this.state.tenRelatedWords.length > 0 ?
              this.state.tenRelatedWords.map((item, index) => {
                return (
                  <li key={item.word + index}>
                    <button onClick={() => this.wordChosen(item)}>{item.word}</button>
                  </li>
                )
            }) :
              null
          }
        </ul>

        <div className="printedHaiku">
          {
            this.state.firstLine.map((item, index) => {
              return <p>{item.word}</p>
            })
          }
        </div>
      </div>
    );
  }
}

export default App;
