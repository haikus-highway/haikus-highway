import React, { Component } from 'react';

class Header extends Component{
    render(){
        return(
            <header>
                <div className="wrapper">
                    <h1>HaikYou</h1>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo ex ut doloremque iste excepturi sit officiis odit quisquam quasi suscipit neque soluta, esse commodi nesciunt, ipsa nemo labore illum veniam.</p>

                    <div className="homeButtonDiv">
                        <button className="homeButton" onClick={this.props.createHaiku}>
                            Journal
                  </button>

                        <button className="homeButton">
                            Haiku Log
                  </button>
                    </div>
                </div>
            </header>
        )
    }
}

export default Header;