import React, { Component } from 'react';
import { getAllMovies } from '../NetworkRequests/APIRequests'
import MovieContainer from '../MovieContainer/MovieContainer'
import Login from '../Login/Login'

import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      movies: [],
      isLoggedIn: false,
      error: '',
      pageDisplayed: 'home',
      isOpen: true,
      showElement: true
    }

    this.logOut = this.logOut.bind(this)
    this.logIn = this.logIn.bind(this) 
    this.showCorrectPage = this.showCorrectPage.bind(this)
    this.toggleButton = this.toggleButton.bind(this)
    this.getMovieID = this.getMovieID.bind(this)
  }

  componentDidMount = async () => {
    try {
      const data = await getAllMovies()
      this.setState({movies: data.movies})
    } catch (error) {
      this.setState({error: error})
    }
  }
      
  getMovieID(event) {
    this.setState({foundMovie: event.target.id})
  }

  logOut() {
    this.setState({pageDisplayed: 'home', isLoggedIn: false, isOpen: true, showElement: true})
    alert('You are now logged out of Rancid Tomatillos, see you again soon!')
  }

  showCorrectPage(page) {
    if(page === "login") {
      this.setState({showElement: false, pageDisplayed: page})
    } else {
      this.setState({pageDisplayed: page, showElement: true})
    }
  }

  toggleButton() {
    this.setState(prevState => {
      return {
          isOpen: !prevState.isOpen
      }
    })
  }

  logIn() {
    this.setState({pageDisplayed: 'home', isLoggedIn: true})
    this.toggleButton()
  }

  render() {
    let btnTxt = this.state.isOpen ? 'Login' : 'Logout'
    return (
      <main className="App">
        <header className="App-header">
          <h1 className="App-header-text">Rancid Tomatillos</h1>
            <nav className="App-navigation-buttons">
              <button className="App-nav-button" onClick={() => this.showCorrectPage('home')}>Home</button>
              {!this.state.isLoggedIn && 
              <>
                <button className="App-nav-button" style={{display: this.state.showElement ? '' : 'none' }} 
                  onClick={() => this.showCorrectPage('login')}>{btnTxt}</button>
                <input placeholder="Search Movies..." style={{display: this.state.showElement ? '' : 'none' }}></input>
                <button style={{display: this.state.showElement ? '' : 'none' }}>Search</button>
              </>
              }
               {this.state.isLoggedIn && 
               <>
                <button className="App-nav-button" onClick={this.logOut}>{btnTxt}</button>
                <input placeholder="Search Movies..."></input><button>Search</button>
                <h2 className="App-welcome-user" >Welcome, Greg!</h2>
              </>
              }
          </nav>
        </header>

        {this.state.pageDisplayed === 'login' && <Login validateLogin={this.validateLogin} action={this.logIn}/>}
        {this.state.pageDisplayed === 'home' && <MovieContainer movies={this.state.movies} getMovieId={this.getMovieID}/>}
      </main>
    )
  }
}

export default App;
