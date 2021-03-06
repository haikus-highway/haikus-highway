import React, { Component } from 'react';
import firebase from './firebase';
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
import SyncLoader from "react-spinners/SyncLoader";
import TitleForm from './Components/TitleForm';
import Journal from './Components/Journal';

const override = `
  display: block;
  margin: 0 auto;
`;

class App extends Component {
  constructor() {
    super();

    this.state = {
      userInput: '',
      firstLine: [],
      secondLine: [],
      thirdLine: [],
      allRelatedWords: [],
      tenRelatedWords: [],
      currentLine: [],
      totalSyllables: 0,
      formVisible: false,
      headerVisible: true,
      suggestions: [],
      inputTextValue: '',
      messageToUser: 'Letter characters only, please.',
      areRelatedWordsLoading: false,
      showTitleForm: false,
      titleInput: '',
      authorInput: '',
      savedHaikus: [],
      showJournal: false,
      activeHaiku: false
    };
  }

  componentDidMount() {
    const dbRef = firebase.database().ref();

    
    dbRef.on('value', (response) => {
      let savedHaikusArray = [];
      
      const savedHaikusRaw = response.val();
      
      for (let haiku in savedHaikusRaw) {
        savedHaikusArray.push(savedHaikusRaw[haiku]);
      }

      this.setState({
        savedHaikus: savedHaikusArray
      });
    });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    axios({
      url: `https://api.datamuse.com/words?sp=${this.state.userInput}&md=s`,
      method: 'GET',
      responseType: 'json',
    }).then((response) => {
      const totalSyllablesSoFar = this.getSyllablesPerLine(this.state.currentLine);
      const maxSyllablesAllowed = this.checkMaxSyllablesAllowed(totalSyllablesSoFar);

      if (response.data[0].word === this.state.userInput.toLowerCase() && response.data[0].numSyllables <= maxSyllablesAllowed) {

        let firstLineCopy = [...this.state.firstLine];
        let secondLineCopy = [...this.state.secondLine];
        let thirdLineCopy = [...this.state.thirdLine];
        let currentLineCopy = [...this.state.currentLine];

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
            {
              word: this.state.userInput,
              numSyllables: response.data[0].numSyllables
            }
          );
        }
  
        this.setState({
          firstLine: firstLineCopy,
          secondLine: secondLineCopy,
          thirdLine: thirdLineCopy,
          currentLine: currentLineCopy,
          totalSyllables: this.state.totalSyllables + response.data[0].numSyllables,
          formVisible: false,
          messageToUser: 'Choose the next word.'
        },
          () => {
            this.getRelatedWords(this.state.userInput);
          }
        );
      } else if (response.data[0].word !== this.state.userInput.toLowerCase()) {
        this.setState({
          userInput: '',
          inputTextValue: '',
          messageToUser: 'I think you may have misspelled that. Please try again.'
        });
      } else if (response.data[0].numSyllables > maxSyllablesAllowed) {
        this.setState({
          userInput: '',
          inputTextValue: '',
          messageToUser: 'That word is too many syllables. Please try another.'
        });
      }
    }).catch(() => {
      this.setState({
        userInput: '',
        inputTextValue: '',
        messageToUser: "That word doesn't seem to exist. Please try another.",
        suggestions: []
      });
    });
  }

  getRelatedWords = (word) => {
    this.setState({areRelatedWordsLoading: true}, () => {
      axios({
        url: `https://api.datamuse.com/words?rel_bga=${word}&md=s`,
        method: 'GET',
        responseType: 'json',
      }).then((response) => {

        if (response.data.length === 0) {
          this.setState({
            formVisible: true,
            userInput: '',
            tenRelatedWords: [],
            areRelatedWordsLoading: false,
            messageToUser: "Couldn't find any words related to that. Please enter the next one.",
            inputTextValue: ''
          });
        } else {
          this.filterResults(response.data);
          this.setState({
            areRelatedWordsLoading: false,
          })
        }
      });
    })
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
    const totalSyllablesSoFar = this.getSyllablesPerLine(this.state.currentLine);

    const maxSyllablesAllowed = this.checkMaxSyllablesAllowed(totalSyllablesSoFar);

    const regex = /[a-z]/g;

    const filteredResults = results.filter((item) => {
      if (item.numSyllables <= maxSyllablesAllowed && item.word.match(regex)) {
        return item;
      } else {
        return false;
      }
    });

    let randomWords;
    let formVisible = false;
    let messageToUser = 'Choose the next word.';

    if (filteredResults.length > 0) {
      randomWords = this.randomizeWords(filteredResults);
    } else {
      randomWords = [];
      formVisible = true;
      messageToUser = "Couldn't find any words related to that. Please enter the next one.";
    }

    this.setState({
      allRelatedWords: filteredResults,
      tenRelatedWords: randomWords,
      userInput: '',
      inputTextValue: '',
      formVisible: formVisible,
      messageToUser: messageToUser
    })
  }

  // Provide a line to check and get the total number of syllables within that line
  getSyllablesPerLine = (line) => {
    // Line will be an array that is received from state

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

  wordChosen = (item) => {

    let firstLineCopy = [...this.state.firstLine];
    let secondLineCopy = [...this.state.secondLine];
    let thirdLineCopy = [...this.state.thirdLine];

    let lineArrayCopy = [...this.state.currentLine];
    lineArrayCopy.push(item);

    let totalSyllablesCopy = this.state.totalSyllables + item.numSyllables;

    let messageToUser = 'Choose the next word.';

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
      messageToUser = '';
    }

    this.setState({
      currentLine: lineArrayCopy,
      firstLine: firstLineCopy,
      secondLine: secondLineCopy,
      thirdLine: thirdLineCopy,
      totalSyllables: totalSyllablesCopy,
      messageToUser: messageToUser
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
      headerVisible: false,
      showJournal: false,
      activeHaiku: false,
      titleInput: '',
      authorInput: '',
    })
  }

  // This button will get user more words related to their word of choice
  moreWords = () => {
    this.setState({
      tenRelatedWords: this.randomizeWords(this.state.allRelatedWords)
    })
  }

  handleTitleInput = (e) => {
    this.setState({
      titleInput: e.target.value
    });
  }

  handleAuthorInput = (e) => {
    this.setState({
      authorInput: e.target.value
    });
  }

  toggleTitleForm = () => {
    this.setState({
      showTitleForm: !this.state.showTitleForm
    });
  }

  toggleJournal = () => {
    this.setState({
      showJournal: !this.state.showJournal,
      headerVisible: false
    })
  }

  saveHaiku = (e) => {
    e.preventDefault();

    let title, author;
    if (this.state.titleInput === '') {
      title = 'Untitled';
    } else {
      title = this.state.titleInput;
    }

    if (this.state.authorInput === '') {
      author = 'Anonymous';
    } else {
      author = this.state.authorInput;
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const monthNumber = currentDate.getMonth();
    const dayOfMonth = currentDate.getDate();

    const date = `${monthNumber + 1}-${dayOfMonth}-${year}`;

    const haiku = {
      title: title,
      author: author,
      firstLine: this.state.firstLine,
      secondLine: this.state.secondLine,
      thirdLine: this.state.thirdLine,
      date: date
    };

    const dbRef = firebase.database().ref();

    dbRef.push(haiku);

    this.toggleTitleForm();
    this.toggleJournal();
  }

  displayJournalLog = (event) => {
    const haiku = this.state.savedHaikus[event.target.value]

    this.setState({
      activeHaiku: parseInt(event.target.value),
      firstLine: haiku.firstLine,
      secondLine: haiku.secondLine,
      thirdLine: haiku.thirdLine,
    })
  }

  render() {

    const currentSyllables = this.getSyllablesPerLine(this.state.currentLine);
    let maxSyllables = 5;
    if (this.state.firstLine.length > 0 && this.state.secondLine.length === 0) {
      maxSyllables = 7;
    }

    let showPreloader = false;
    if (!this.state.areRelatedWordsLoading) {
      setTimeout(() => {
        showPreloader = true;
      }, 300);
    }

    return (
      <div className="App">
        <div className="rightHalf">
          {
            this.state.headerVisible ?
            <Header
              createHaiku = {this.createHaiku}
              showJournal = {this.toggleJournal}
            />
            :
            <div className="wrapper informationForUser">
              {
                this.state.totalSyllables < 17 && !this.state.showJournal ? 
                <div className="syllableCounter">
                  <h3> Syllables {currentSyllables} / {maxSyllables}</h3>
                </div>
                : null
              }
              {
                !this.state.showJournal ? 
                  <div className="messageToUser">
                    <p>{this.state.messageToUser}</p>
                  </div>
                : null
              }
            </div>
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

          {
            this.state.areRelatedWordsLoading && showPreloader ?
              <SyncLoader
                size={15}
                color={"#fff"}
                css={override}
              />
            :
            
            this.state.totalSyllables < 17 ?
              <RelatedWords
                tenRelatedWords={this.state.tenRelatedWords}
                totalSyllables={this.state.totalSyllables}
                wordChosen={this.wordChosen}
                moreWords={this.moreWords}
              />
            : null
            
          }

          {
            this.state.totalSyllables === 17 && !this.state.showTitleForm && !this.state.showJournal ?
              <Restart
                createHaiku={this.createHaiku}
                save={this.toggleTitleForm}
              />
              : null    
          }
          {
            this.state.showTitleForm ?
              <TitleForm
                saveHaiku={this.saveHaiku}
                handleTitleInput={this.handleTitleInput}
                handleAuthorInput={this.handleAuthorInput}
              />
            : null
          }
          {
            this.state.showJournal ?
              <Journal
                activeHaiku={this.state.activeHaiku}
                savedHaikus={this.state.savedHaikus}
                displayJournalLog={this.displayJournalLog}
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
        </div>
      </div>

    </div>
    );
  }
}

export default App;
