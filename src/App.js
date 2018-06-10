import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import pict from './play.png';
import Trailer from './Trailer';

class App extends Component {
  constructor() {
    super()
    this.state = {
      movies: [],
      page: 1,
      title: 'aa',
      details: [],
      trailer: false,
      year: '',
      trailerTitle: '',
      search: 'Search Movie Titles'
    }
    this.searchingMovies = this.searchingMovies.bind(this)
  }

  componentDidMount() {
    this.getMovies('star wars', 1)
  }

  getMovies(str, page) {
    let movies = []
    //api to get first 10 results of searched movies
    axios.get(`http://www.omdbapi.com/?s=${str}&page=${page}&apikey=97ad0e64`).then(response => {
        let result1 = response.data.Search
        if(result1) {
          result1.map((item) => {
            return movies.push(item)
          })
          //api to get next 10 results of searched movies (to be total of 20 results)
          if(result1.length > 9) {
            let nextPage = page + 1
            axios.get(`http://www.omdbapi.com/?s=${str}&page=${nextPage}&apikey=97ad0e64`).then(response => {
              let result = response.data.Search
              result.map((item) => {
                return movies.push(item)
              })
            })
          }
          let details = []
          //api to then get individual details of each movie title
          movies.map((item) => {
            axios.get(`http://www.omdbapi.com/?t=${item.Title}&apikey=97ad0e64`).then(response => {
              details.push(response.data)
              this.setState({
                movies: movies,
                details: details,
              })
            })
            return null
          })
        } else alert('No results for that title. Please try again!')
    })
  }

  //used to set the props to send to the Trailer component and make it visible
  playTrailer(title, year) {
    this.setState({
      trailerTitle: title,
      year: year,
      trailer: true,
    })
  }

  searchingMovies(title, page) {
    this.getMovies(title, page)
    this.setState({
      search: 'Search Movie Titles'
    })
  }

  searchingMoviesEnter(event, title, page) {
    if(event.key === 'Enter'){
      this.getMovies(title, page)
      this.setState({
        search: ''
      })
    }
  }

  handleFocus() {
    this.setState({
      search: ''
    })
  }

  render() {
    // console.log(this.state)
    const{details} = this.state

    //mapping over movies and displaying information
    let movieDetails = details.map((item, index) => {
      if(item.Title) {
        return <div key={item.imdbID + index} className='indi-movie'>
          <div onClick={() => this.playTrailer(item.Title, item.Year)} className='picture'>
            <div className='poster'>
              <img alt='poster' src={item.Poster}/>
            </div>
            <div className='play'>
              <img alt='play trailer' src={pict} />
              <span>PLAY TRAILER</span>
            </div>
          </div>
            <h6>{item.Title}</h6>
          <div className='movie-details'>
            <h6>{item.Title}</h6>
            <span className='plot'>{item.Plot}</span>
            <div className='mini-details'>
              <span className='runtime'>Length: {item.Runtime}</span>
              <span className='year'>Year: {item.Year}</span>
              <span>
                <span className='rating'>Rating: <strong>{item.imdbRating}</strong></span>
                <span className='votes'>({item.imdbVotes} Votes)</span>
              </span>
            </div>
          </div>
        </div>
      } else return null
    })

    console.log(this.state.search)
    return (
      <div className='main'>
        {/* to display youtube player component */}
        {this.state.trailer &&
          <div onClick={() => this.setState({trailer: false})} className='player'>
            <Trailer title={this.state.trailerTitle} year={this.state.year} close={() => this.setState({trailer: false})}/>
          </div>
        }

        <nav className='navbar'>
          <span>MovieGuide</span>
        </nav>


        <div className='content'>
          <input onKeyPress={(event) => this.searchingMoviesEnter(event, this.state.title, this.state.page)} onFocus={() => this.handleFocus()} onChange={event => this.setState({title: event.target.value, search: event.target.value})} className='search form-control' value={this.state.search} placeholder={this.state.search}/> 
          <button className='btn btn-light' onClick={() => this.searchingMovies(this.state.title, this.state.page)}>Submit</button>
          <div className='movies'>
            {movieDetails}
          </div>
        </div>


        <footer className='footer'>
          <span>footer</span>
        </footer>
      </div>
    );
  }
}

export default App;
