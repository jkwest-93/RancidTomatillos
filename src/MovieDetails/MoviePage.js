import React, { Component } from "react";
import './MoviePage.css';
import { getSingleMovieDetails } from '../NetworkRequests/APIRequests'
import RatingForm from '../RatingForm/RatingForm'

class MoviePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: {},
      averageRatingDecimal: 0,
      userRating: '',
      userRatingObj: {}
    };
    this.formatBudgetAndRevenue = this.formatBudgetAndRevenue.bind(this)
    this.findUserRatingsForFoundMovie = this.findUserRatingsForFoundMovie.bind(this);
    this.formatAvRating = this.formatAvRating.bind(this)
  }

  async componentDidMount() {
    try {
      const movie = await getSingleMovieDetails(this.props.foundMovieId)
      const movieInfo = movie.movie
      this.setState({
        movie: movieInfo
      })
    } catch (error) {
      this.setState({error: error})
    }
    this.findUserRatingsForFoundMovie()
  }

  formatBudgetAndRevenue(x) {
    if (x === 0 || x === undefined) {
      return 'Not Available'
    }
    else {
      let numWithCommas = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return `$${numWithCommas}`
    }
  }

  findUserRatingsForFoundMovie() {
    const userRating = this.props.userRatings.ratings.find(rating => {
      return this.props.foundMovieId === rating.movie_id
    })
    if (userRating === undefined && this.props.isLoggedIn) {
      this.setState({userRating: 'You haven\'t rated this movie yet'})
    } else if (!this.props.isLoggedIn) {
      this.setState({userRating: 'Log in to rate this movie'})
    } else {
      this.setState({userRating: `You rated this movie: ${userRating.rating}`, userRatingObj: userRating})
    }
    this.formatAvRating()
  }

  formatAvRating() {
      const shortedRating = this.state.movie.average_rating.toFixed()
      this.setState({averageRatingDecimal: shortedRating})
  }

  iconStatus = () => {
    const favoriteStatus = this.props.determineFavoriteStatus(this.state.id)
    if(favoriteStatus) {
      return 'active'
    }
    if(!favoriteStatus) {
      return 'inactive'
    }
  }

  render() {
    const budget = this.formatBudgetAndRevenue(this.state.movie.budget)
    const revenue = this.formatBudgetAndRevenue(this.state.movie.revenue)

    return (
      <div className="Movie-Page" style={{
        backgroundImage: `url(${this.state.movie.backdrop_path})`}}>
        <div className="Movie-Page-Container">
        <img data-testid="favorite-icon-large" className={`favorite-icon-large ${this.iconStatus()}`} src="/heart.png" alt="Favorite icon" id={this.state.id} onClick={this.props.handleFavorite}/>
        <img src={this.state.movie.poster_path} alt="Movie poster"/>
          <div className="movie-body">
            <h1>{this.state.movie.title}</h1>
            <p>{this.state.movie.tagline}</p>
            <div className="MoviePage-rating-box">
              <p className="MoviePage-rating-text"> <span role="img" aria-label="Star Emoji">⭐</span> {this.state.averageRatingDecimal}/10</p>
            </div>
            <p>{this.state.movie.overview}</p>
          </div>
          <div className="movie-details">
            <p>Release Date: {this.state.movie.release_date}</p>
            <p>Budget: {budget}</p>
            <p>Runtime: {this.state.movie.runtime} minutes</p>
            <p>Revenue: {revenue}</p>  
          </div>
        </div>
        <RatingForm 
          foundMovieId={this.props.foundMovieId} 
          isLoggedIn={this.props.isLoggedIn} 
          updateUserRating={this.props.updateUserRating} 
          userId={this.props.userId} 
          movie={this.state.movie} 
          userRating={this.state.userRating} 
          userRatingObj={this.state.userRatingObj} 
          userName={this.props.userName}/>
      </div>
    )
  }
}

export default MoviePage